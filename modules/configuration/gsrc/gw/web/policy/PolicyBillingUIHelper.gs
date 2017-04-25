package gw.web.policy

uses gw.api.locale.DisplayKey
uses gw.api.util.LocationUtil
uses gw.plugin.billing.BillingPeriodInfo
uses gw.plugin.billing.BillingTermInfo
uses gw.plugin.billing.IBillingSummaryPlugin

uses java.lang.Exception
uses java.lang.Integer
uses java.util.Collection
uses java.util.LinkedHashSet
uses java.util.List

@Export
class PolicyBillingUIHelper {

  var _currentPolicyTermInfo : gw.plugin.billing.BillingTermInfo as CurrentPolicyTermInfo

  construct() {
  }

  construct(period: PolicyPeriod, policyTermInfos : gw.plugin.billing.BillingTermInfo[]) {
    if(policyTermInfos==null) {
      policyTermInfos = new BillingTermInfo[0]
    }
    _currentPolicyTermInfo = getPolicyTermInfoFor(period, policyTermInfos)
  }
  /**
   * @deprecated 8.0.2 use (0..termNumbers.Count).toList() instead
   */
  @Deprecated(:value="Use (0..termNumbers.Count).toList() instead.", :version="8.0.2")
  static function getTermNumberIndexes(termNumbers : Integer[]) : List<Integer>{
    var indexes = new java.util.ArrayList<Integer>(termNumbers.Count)
    for (i in 0..|termNumbers.Count) {
      indexes.add(i)
    }
    return indexes
  }

  /**
   * @deprecated 8.0.2 use periodInfo.PolicyTermInfos.toList().indexOf(periodInfo.PolicyTermInfos.firstWhere(\ termInfo -> termInfo.TermNumber == policyPeriod.TermNumber)) instead
   */
  @Deprecated(:value="use periodInfo.PolicyTermInfos.toList().indexOf(periodInfo.PolicyTermInfos.firstWhere(\ termInfo -> termInfo.TermNumber == policyPeriod.TermNumber)) instead.", :version="8.0.2")
  static function getTermNumberIndex(policyPeriod : PolicyPeriod, termNumbers : Integer[]) : int {
    for (termNumber in termNumbers index i) {
      if (termNumber == policyPeriod.TermNumber) {
        return i
        }
    }
    return -1
  }

  /**
  * Return a sorted array of term numbers of bound policy terms.
  * Note that the sort order needs to be the same as the list of bound policy period returned by BC in
  * {@link #retrieveBillingSummary(IBillingSummaryPlugin, PolicyPeriod, int)
  * @deprecated 8.0.2 use BillingPeriodInfo.PolicyTermInfos.map(\ termInfo -> termInfo.TermNumber) instead
  */
  @Deprecated(:value="Use BillingPeriodInfo.PolicyTermInfos.map(\ termInfo -> termInfo.TermNumber) instead.", :version="8.0.2")
  static function getSortedTermNumbers(policy : Policy) : Integer[] {
    var termNumbersOfPeriod = policy.Periods.where(\ p -> p.TermNumber != null and p.PolicyTerm.Bound)
    .sortBy(\ p -> p.EditEffectiveDate).map(\ p -> p.TermNumber)
    return (new LinkedHashSet<Integer>(termNumbersOfPeriod?.toList()))?.toTypedArray()
  }

  /**
   * @deprecated 8.0.2 Use retrieveBillingSummary(..., policyPeriod.PolicyNumber, termNumber) instead
   */
  @Deprecated(:value="Use retrieveBillingSummary(..., policyPeriod.PolicyNumber, termNumber) instead.", :version="8.0.2")
  static function retrieveBillingSummary(billingPlugin : IBillingSummaryPlugin, policyPeriod : PolicyPeriod,
                                         termNumber : int) : BillingPeriodInfo {
    return retrieveBillingSummary(billingPlugin, policyPeriod.PolicyNumber, termNumber)
  }

  /**
   * Look up the {@link BillingTermInfo} in the specified array that corresponds
   *    to the specified {@link PolicyPeriod}.
   *
   * @param policyPeriod the {@link PolicyPeriod}
   * @param policyTermInfos the array of {@link BillingTermInfo}s that identify
   *                        the terms
   * @return the {@link BillingTermInfo} that identifies the
   *         {@link PolicyPeriod}, if any.
   */
  static function getPolicyTermInfoFor(
      policyPeriod : PolicyPeriod, policyTermInfos : BillingTermInfo []) : BillingTermInfo {
    return policyTermInfos.firstWhere( \ termInfo ->
        termInfo.PolicyNumber == policyPeriod.PolicyNumber
            and termInfo.TermNumber == policyPeriod.TermNumber)
  }

  function createBillingSummary(billingPlugin :IBillingSummaryPlugin , policyPeriod: PolicyPeriod): BillingPeriodInfo {
    if(CurrentPolicyTermInfo.TermNumber!=policyPeriod.TermNumber) {
      return gw.web.policy.PolicyBillingUIHelper.retrieveBillingSummary(billingPlugin, CurrentPolicyTermInfo)
    }
      return gw.web.policy.PolicyBillingUIHelper.retrieveBillingSummary(billingPlugin, policyPeriod)
  }

  /**
   * Fetch the {@link BillingPeriodInfo billing summary} for the specified
   *    {@link PolicyPeriod}.
   *
   * This uses the {@link PolicyPeriod#PolicyNumber} and {@link
   * PolicyPeriod#TermNumber} to identify the billing summary.
   *
   * @param billingPlugin the {@link IBillingSummaryPlugin billing system
   *                      summary} plugin
   * @param policyPeriod the {@link PolicyPeriod} for which to fetch the summary
   * @return the {@link BillingPeriodInfo} for the {@link PolicyPeriod}.
   */
  static function retrieveBillingSummary(
      billingPlugin : IBillingSummaryPlugin, policyPeriod : PolicyPeriod) : BillingPeriodInfo {
    return retrieveBillingSummary(billingPlugin, policyPeriod.PolicyNumber, policyPeriod.TermNumber)
  }

  /**
   * Fetch the {@link BillingPeriodInfo billing summary} for the billing period
   *    identified by the {@link BillingTermInfo}.
   *
   * @param billingPlugin the {@link IBillingSummaryPlugin billing system
   *                      summary} plugin
   * @param policyTermInfo the policy term info' whose PolicyNumber and TermNumber
   *                       identify for which billing period to fetch the summary
   * @return the {@link BillingPeriodInfo} for the billing period.
   */
  static function retrieveBillingSummary(
      billingPlugin : IBillingSummaryPlugin, policyTermInfo : BillingTermInfo) : BillingPeriodInfo {
    return retrieveBillingSummary(billingPlugin, policyTermInfo.PolicyNumber, policyTermInfo.TermNumber)
  }

  /**
   * Fetch the {@link BillingPeriodInfo billing summary} for the period
   *    identified by the specified PolicyNumber and TermNumber.
   *
   * @param billingPlugin the {@link IBillingSummaryPlugin billing system
   *                      summary} plugin
   * @param policyNumber the policy number that identifies the billing period
   * @param termNumber   the term number that identifies the billing period
   * @return the {@link BillingPeriodInfo} for the identified billing period.
   */
  static function retrieveBillingSummary(billingPlugin : IBillingSummaryPlugin, policyNumber : String,
                                        termNumber : int) : BillingPeriodInfo {
    try {
      return billingPlugin.retrievePolicyBillingSummary(policyNumber, termNumber)
    } catch (e : Exception) {
      LocationUtil.addRequestScopedErrorMessage(DisplayKey.get("Web.AccountBilling.Error.PolicyNotFound"))
      return null
      }
    }

  /**
   * Format a {@link BillingTermInfo} for use as an option label.
   */
  static function optionFormat(policyTermInfo : BillingTermInfo) : String {
    return DisplayKey.get("Web.Billing.BillingPeriod.Entry", policyTermInfo.TermNumber,
        policyTermInfo.EffectiveDate.ShortFormat,
        policyTermInfo.ExpirationDate.ShortFormat)
  }
}

