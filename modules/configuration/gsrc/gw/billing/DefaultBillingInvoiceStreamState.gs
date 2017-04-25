package gw.billing

uses gw.plugin.billing.PaymentPlanData

/**
 *
 */
@Export
class DefaultBillingInvoiceStreamState extends AbstractInvoiceStreamState {

  protected construct(parent : InvoiceStreamStateContainerImpl) {
    super(parent)
  }

  override function updateInvoiceStreamAccordingToPaymentPlan(plan: PaymentPlanData) {

  }


  property get CustomBilling() : boolean {
    return false
  }

  override protected function resetInvoiceStreamsAndPaymentInstruments() {
    clearInvoiceStreamState()
  }
}