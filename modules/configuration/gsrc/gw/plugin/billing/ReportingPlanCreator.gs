package gw.plugin.billing

uses gw.api.locale.DisplayKey
uses gw.api.productmodel.AuditSchedulePatternLookup
uses gw.api.system.PCLoggerCategory
uses java.util.List

@Export
class ReportingPlanCreator {
  static function createReportingPlansForPlanId(planId: String, allowedPaymentMethods: AccountPaymentMethod[]): List< ReportingPlanData > {
    var pcReportingPlans : List< ReportingPlanData > = {}
    var auditSchedulePatterns = AuditSchedulePatternLookup.getAll().where(\elt -> elt.PaymentPlanCode == planId)
    if (auditSchedulePatterns.size() == 0) {
      PCLoggerCategory.BILLING_SYSTEM_PLUGIN.warn(DisplayKey.get("BillingSystemPlugin.Error.NoAuditSchedulePatternsFound", planId))
    }

    // Add one PC PaymentPlanSummary for each AuditSchedulePattern we found matching the billing system's payment plan Public ID
    for (reportingPattern in auditSchedulePatterns) {
      var newReportingPlan = new ReportingPlanDataImpl ()
      newReportingPlan.BillingId = planId
      newReportingPlan.ReportingPatternCode = reportingPattern.PublicID
      newReportingPlan.AllowedPaymentMethods = allowedPaymentMethods
      pcReportingPlans.add(newReportingPlan)
    }

    return pcReportingPlans
  }
}
