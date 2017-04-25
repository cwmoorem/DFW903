package gw.plugin.billing.bc900

uses wsi.remote.gw.webservice.bc.bc900.entity.types.complex.CancelPolicyInfo

@Export
enhancement CancelPolicyInfoEnhancement : CancelPolicyInfo {
  function sync(period : PolicyPeriod) {
    this.syncBasicPolicyInfo(period)
    this.CancellationType = period.RefundCalcMethod.Code
    this.CancellationReason = period.Cancellation.CancelReasonCode.Description
  }
}