package gw.policy

uses gw.api.locale.DisplayKey
uses gw.api.database.Query
uses gw.api.policy.period.PolicyPeriodQueryFilters

uses java.util.Date
uses gw.losshistory.ClaimSearchCriteria
uses gw.plugin.claimsearch.NoResultsClaimSearchException
uses java.lang.Exception
uses gw.api.database.IQueryBeanResult

enhancement PolicyTermEnhancement : PolicyTerm {
  property get PolicyNumber() : String {
    return getPeriodAsOf(Date.Today).PolicyNumber
  }

  property get PolicyNumberDisplayString() : String {
    return getPeriodAsOf(Date.Today).PolicyNumberDisplayString
  }

  property get Periods() : PolicyPeriod[] {
    return this.Policy.Periods.where(\ period -> period.PolicyTerm == this)
  }

  property get ConfirmationReceived() : boolean { return this.Bound }

  /**
   * Returns policy period as of the given date, or last bound period if the period is null asOf date
   * @param date the date to be checked
   * @return policy period
   */
  function getPeriodAsOf(date : Date) : PolicyPeriod {
    var period = entity.Policy.finder.findPolicyPeriodByPolicyAndAsOfDate(this.Policy, date)
    if (period == null) {
      period = this.Policy.Periods.last()
    }
    return period
  }

  function removePreRenewalDirection() {
    //clear out the fields that represent pre-renewal direction
    this.PreRenewalDirection = null
    this.NonRenewAddExplanation = null
    this.NonRenewReason = null
    this.NonRenewalExplanations.each( \ n -> this.removeFromNonRenewalExplanations( n ) )
  }

  function getAvailableNonRenewalExplanationPatterns() : NonRenewalExplanationPattern[]{
    var currentDate = Date.CurrentDate
    var existingPatternList = this.NonRenewalExplanations.map( \ n -> n.Code ).toList()
    var result = Query.make(NonRenewalExplanationPattern)
      .and(\ andRestriction -> andRestriction
        .or(\ restriction -> {
          var effDateColumnName = NonRenewalExplanationPattern#EffectiveDate.PropertyInfo.Name
          restriction.compare(effDateColumnName, Equals, null)
          restriction.compare(effDateColumnName, LessThanOrEquals, currentDate)
        })
        .or(\ restriction -> {
          var expDateColumnName = NonRenewalExplanationPattern#ExpirationDate.PropertyInfo.Name
          restriction.compare(expDateColumnName, Equals, null)
          restriction.compare(expDateColumnName, GreaterThanOrEquals, currentDate)
        })
      ).compareNotIn("Code", existingPatternList.toArray()).select().toTypedArray()
    return result
  }

  function createPreRenewalDirectionHistoryDescription(originalValue : typekey.PreRenewalDirection) : String{
    return originalValue == null ?
           DisplayKey.get("Web.History.PreRenewal.PreRenewalDirectionSet",  this.PreRenewalDirection ) : DisplayKey.get("Web.History.PreRenewal.PreRenewalDirection",  originalValue, this.PreRenewalDirection )
  }

  function createNonRenewalReasonHistoryDescription(originalValue : NonRenewalCode) : String{
    return originalValue == null ?
           DisplayKey.get("Web.History.PreRenewal.NonRenewReasonSet",  this.NonRenewReason ) : DisplayKey.get("Web.History.PreRenewal.NonRenewReason",  originalValue, this.NonRenewReason )
  }

  function createNonRenewalAdditionalExplanationHistoryDescription() : String{
    return DisplayKey.get("Web.History.PreRenewal.NonRenewAddExplanation")
  }

  function createPreRenewalAssignmentHistoryDescription(assignment : UserRoleAssignment) : String{
     return DisplayKey.get("Web.History.PreRenewal.AssignmentUser",  assignment.AssignedUser)
  }

  function createNonRenewalExplanationRemovedHistoryDescription() : String{
     return DisplayKey.get("Web.History.PreRenewal.NonRenewalExplanations.Remove")
  }

  function createNonRenewalExplanationAddedHistoryDescription() : String{
     return DisplayKey.get("Web.History.PreRenewal.NonRenewalExplanations.Add")
  }

  function findMostRecentPeriod() : PolicyPeriod {
    var query = Query.make(PolicyPeriod)
    var termTable = query.join("PolicyTerm")
    termTable.compare("ID", Equals, this.ID)
    PolicyPeriodQueryFilters.inForce(query)
    return query.select().AtMostOneRow
  }

  function recalculateLossRatio()  : String {
    var message : String
    // try is used mostly in case of failure to commit the bundle
    try {
      var aPeriod = this.Periods.firstWhere( \ elt -> elt.MostRecentModel)
      // this will not work for multiline policies
      if (aPeriod.MultiLine) {
        return DisplayKey.get("Web.Policy.LossRatioUnavailableForMultilinePolicies")
      }

      // find all claims associated with this PolicyTerm
      var claimSet = new ClaimSet()
      var criteria = new ClaimSearchCriteria()
      criteria.Policy = this.Policy
      criteria.DateCriteria.StartDate = aPeriod.PeriodStart
      criteria.DateCriteria.EndDate = aPeriod.PeriodEnd
      criteria.DateCriteria.DateSearchType = DateSearchType.TC_ENTEREDRANGE

      try {
        claimSet = criteria.performSearch()
      } catch (ex : NoResultsClaimSearchException) {
        // no action but set message
        message = DisplayKey.get("Web.Policy.NoClaimsFound")
      } catch (ex : java.net.ConnectException) {
        return DisplayKey.get("Web.Policy.UnableToConnectToClaimSystem")
      }
      // sum the TotalIncurred
      var totalIncurred = 0bd.ofCurrency(aPeriod.PreferredSettlementCurrency)
      claimSet.Claims.each( \ claim -> {
        if (claim.TotalIncurred != null ) {
          totalIncurred += claim.TotalIncurred
        }
      })

      // calculate the Earned Premium
      // remember this is for only monoline policies
      var txs = gw.api.domain.financials.TransactionFinder.instance.findPostedTransactions(aPeriod)
      var txsByPolicyLine = txs.partition(\ t -> t.Cost.PolicyLine.Pattern.Name)
      var aLine = txsByPolicyLine.Keys.first()
      var lastReportedDate = !aPeriod.Archived ? (aPeriod.IsReportingPolicy ? aPeriod.LastReportedDate : aPeriod.PeriodStart) : gw.api.system.PLDependenciesGateway.getSystemClock().DateTime
      var earned = (txsByPolicyLine.get(aLine)).
          sum(aPeriod.PreferredSettlementCurrency, \ t -> t.earnedAsOf(Date.Today, lastReportedDate, true))

      // protect against border conditions and divide by zero
      if ( earned.Amount <= 0bd) {
        return DisplayKey.get("Web.Policy.EarnedPremiumIsZeroLossRatioCannotBeCalculated")
      }

      // set the loss ratio and calc date
      this.ClaimSystemTotalIncurred = totalIncurred
      this.LossRatio = (100 * totalIncurred.Amount / earned.Amount).setScale(2, HALF_UP)
      this.LossRatioCalculationDate = Date.Today
      this.Bundle.commit()
  } catch (ex : Exception) {
      message = DisplayKey.get("Web.Policy.UnableToCalculateOrSaveLossRatio")
    }
    return message
  }
}
