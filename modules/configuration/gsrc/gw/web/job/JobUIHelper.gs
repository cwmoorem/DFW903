package gw.web.job

uses gw.api.locale.DisplayKey
uses gw.lang.Export

/**
 * Helper functions to Job UI elements
 */
@Export
class JobUIHelper {

  /**
   * Determines whether "Resolve with future bound periods" is shown on the
   * job complete screen
   */
  public static function showResolveWithFutureBoundPeriods(policyPeriod: PolicyPeriod): boolean {
    if (policyPeriod.JobProcess.applyChangeToFutureRenewalAutomatic()) return false
    return policyPeriod.JobProcess.canApplyChangesToFutureBoundRenewal()
  }

  /**
   * Determines whether "Resolve with future unbound periods" is shown on the
   * job complete screen
   */
  public static function showResolveWithFutureUnboundPeriods(policyPeriod: PolicyPeriod): boolean {
    if (policyPeriod.JobProcess.applyChangeToFutureRenewalAutomatic()) return false
    return policyPeriod.JobProcess.canApplyChangesToFutureUnboundRenewal()
  }

  /**
   * Determines whether to display the link "View your Policy (policy-number)" on the
   * screen shown when a job is complete
   */
  public static function showViewPolicy(policyPeriod: PolicyPeriod): boolean {
    if (policyPeriod.Job typeis Submission) {
      if (!policyPeriod.isPromoted()) return false
      if (policyPeriod.Status == PolicyPeriodStatus.TC_DECLINED) return false
      if (policyPeriod.Status == PolicyPeriodStatus.TC_WITHDRAWN) return false
      if (policyPeriod.Status == PolicyPeriodStatus.TC_NOTTAKEN) return false
    }
    if (policyPeriod.Job typeis RewriteNewAccount) {
      if (!policyPeriod.isPromoted()) return false
      if (policyPeriod.Status == PolicyPeriodStatus.TC_WITHDRAWN) return false
    }
    // filter out nonexistent/temporary policy instances
    return policyPeriod.PolicyNumberAssigned
  }

  /**
   * Determines whether to display the link "View your {job}" on the screen shown
   * when a job is complete
   */
  public static function showViewJob(policyPeriod: PolicyPeriod): boolean {
    if (policyPeriod.Job typeis Submission) return true
    if (policyPeriod.Job typeis Issuance) return true
    if (policyPeriod.Job typeis Renewal) return true
    if (policyPeriod.Job typeis Audit) return true
    if (policyPeriod.Job typeis RewriteNewAccount) return true
    return false
  }

  /**
   * Determines whether "Go to Submission Manager" should be displayed on the
    * job complete screen
   */
  public static function showGoToSubmissionManager(policyPeriod: PolicyPeriod): boolean {
    if (policyPeriod.Job typeis Submission) return true
    if (policyPeriod.Job typeis Issuance) return true
    return false
  }

  /**
   * Determines whether "Submit application for different account" should be displayed on the
   * job complete screen
   */
  public static function showSubmitAnother(policyPeriod: PolicyPeriod): boolean {
    if (policyPeriod.Job typeis Submission) return true
    if (policyPeriod.Job typeis Issuance) return true
    return false
  }

  /**
   * Determines whether "Review Changes" is shown on the job complete screen
   */
  public static function showReviewChanges(policyPeriod: PolicyPeriod): boolean {
    if (policyPeriod.Job typeis Rewrite) return true
    if (policyPeriod.Job typeis PolicyChange) return true
    return false
  }

  /**
   * Compiles a string "View your {job-type}({job-number})" to be displayed on the
   * job complete screen
   */
  public static function viewJobText(job: Job): String {
    if (job typeis Submission) return DisplayKey.get("Web.SubmissionComplete.ViewSubmission", job.JobNumber)
    if (job typeis Issuance) return DisplayKey.get("Web.IssuanceComplete.ViewIssuance", job.JobNumber)
    if (job typeis Renewal) return DisplayKey.get("Web.Renewal.Complete.ViewRenewal", job.JobNumber)
    if (job typeis RewriteNewAccount) return DisplayKey.get("Web.RewriteNewAccountComplete.ViewRewriteNewAccount", job.JobNumber)
    if (job typeis Audit) return DisplayKey.get("Web.AuditComplete.ViewAudit", 
        job.AuditInformation.AuditScheduleType.DisplayName.toLowerCase(), job.JobNumber)
    return ""
  }
}