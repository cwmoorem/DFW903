package gw.plugin.billing.bc800

uses java.math.BigDecimal
uses wsi.remote.gw.webservice.bc.bc800.entity.types.complex.PremiumReportInfo

@Export
@Deprecated(:value="800 inter-app integration packages will be removed in PC10.", :version="PC 9.0.0")
enhancement PremiumReportInfoEnhancement : PremiumReportInfo
{
  function sync(period : PolicyPeriod){
    this.syncBasicPolicyInfo(period)
    var auditInfo = period.Audit.AuditInformation
    this.AuditPeriodEndDate = auditInfo.AuditPeriodEndDate.XmlDateTime
    this.AuditPeriodStartDate = auditInfo.AuditPeriodStartDate.XmlDateTime
    var paymentReceived = period.Audit.PaymentReceived
    this.PaymentReceived = paymentReceived != null 
      and paymentReceived.Amount.compareTo( BigDecimal.ZERO ) > 0
  }
}
