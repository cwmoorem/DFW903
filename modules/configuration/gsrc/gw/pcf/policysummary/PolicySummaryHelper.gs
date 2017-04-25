package gw.pcf.policysummary
uses gw.api.locale.DisplayKey
uses pcf.DiffPolicyPeriodsPopup
uses pcf.JobForward
uses java.util.Date


/**
 * Provides support for the PolicySummary page.
 */
@Export
class PolicySummaryHelper {

  private var _policyPeriod : PolicyPeriod
  private var _asOfDate : Date
  
  construct(policyPeriod : PolicyPeriod, asOfDate : Date) {
    _policyPeriod = policyPeriod
    _asOfDate = asOfDate
  }
  
  function gotoWorkOrdersDiff(checkedValues : Job[], title : String) {
    var firstRev = checkedValues.minBy(\ j -> j.LatestPeriod.EditEffectiveDate.Time + j.LatestPeriod.CreateTime.Time)
    var secondRev = checkedValues.maxBy(\ j -> j.LatestPeriod.EditEffectiveDate.Time + j.LatestPeriod.CreateTime.Time)
    if (firstRev.SelectedVersion.PolicyTerm.Archived) {
      JobForward.go(firstRev)
    }
    if (secondRev.SelectedVersion.PolicyTerm.Archived) {
      JobForward.go(secondRev)
    }
    DiffPolicyPeriodsPopup.push(firstRev.LatestPeriod, secondRev.LatestPeriod, _policyPeriod, _asOfDate, title)
  }

  function gotoPolicyTransactionsDiff(checkedValues : PolicyPeriod[], title : String) {
    var firstRev = checkedValues.minBy( \ p -> p.EditEffectiveDate.Time + p.CreateTime.Time)  
    var secondRev = checkedValues.maxBy( \ p -> p.EditEffectiveDate.Time + p.CreateTime.Time) 
    if (firstRev.PolicyTerm.Archived) {
      JobForward.go(firstRev.Job)
    }
    if (secondRev.PolicyTerm.Archived) {
      JobForward.go(secondRev.Job)
    }
    DiffPolicyPeriodsPopup.push(firstRev, secondRev, _policyPeriod, _asOfDate, title)
  }
  
  function isCancelling(policyPeriod: PolicyPeriod) : boolean{
    var cancelling = false
    for (thejob in policyPeriod.Policy.OpenJobs) {
      if (thejob.LatestPeriod.Status == typekey.PolicyPeriodStatus.TC_CANCELING) {
        gw.api.util.LocationUtil.addRequestScopedWarningMessage(DisplayKey.get("Web.PolicyFile.Summary.PendingCancellation"))
        cancelling = true
      }
    }
    return cancelling
  }
}
