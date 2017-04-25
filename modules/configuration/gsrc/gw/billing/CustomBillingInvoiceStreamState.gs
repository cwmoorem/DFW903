package gw.billing

uses gw.plugin.billing.BillingInvoiceStreamInfo
uses gw.plugin.billing.BillingPaymentInstrument
uses gw.plugin.billing.PaymentPlanData

/**
 * This class provides the behavior when creating a Custom Invoice Stream for billing on a PolicyPeriod
 */
@Export
class CustomBillingInvoiceStreamState extends AbstractInvoiceStreamState {

  protected construct(parent : InvoiceStreamStateContainerImpl) {
    super(parent)
  }

  override function populateFromPolicyPeriod(period: PolicyPeriod) {
    super.populateFromPolicyPeriod(period)
    InvoiceStreamCode = period.InvoiceStreamCode
    InvoiceStreamInterval = period.NewInvoiceStream.Interval
    Automatic = period.NewInvoiceStream.Automatic
    UnappliedFundID = period.NewInvoiceStream.UnappliedFundID
    AccountUnapplied = false
    UnappliedFundDescription = period.NewInvoiceStream.UnappliedFundDescription
    DueDateBilling = period.NewInvoiceStream.DueDateBilling
    FirstDayOfMonth = period.NewInvoiceStream.FirstDayOfMonth
    SecondDayOfMonth = period.NewInvoiceStream.SecondDayOfMonth
    DayOfWeek = period.NewInvoiceStream.DayOfWeek
    FirstAnchorDate = period.NewInvoiceStream.FirstAnchorDate
    Description = period.NewInvoiceStream.Description

    InvoiceStreams = Container.retrieveAvailableInvoiceStreams()
    PaymentInstruments = Container.retrieveAvailablePaymentInstruments()
    PaymentInstrument = PaymentInstruments.firstWhere(\elt -> elt.PublicID == period.NewInvoiceStream.PaymentInstrumentID)
    NewInvoicing = (InvoiceStreamCode == null)
    if (InvoiceStream != null) {
      updateInvoiceStreamAccordingToPaymentPlan(Container.PaymentPlanChoice)
    }
  }

  override property get CustomBilling() : boolean {
    return true
  }

  override function updateInvoiceStreamAccordingToPaymentPlan(plan : PaymentPlanData) {
    var oldInvoiceStreams = InvoiceStreams
    InvoiceStreams = Container.retrieveAvailableInvoiceStreams()
    var validInvoiceStreams = InvoiceStreams*.PublicID
    if (not validInvoiceStreams.contains(InvoiceStreamCode)) {
      if (validInvoiceStreams.IsEmpty) {
        InvoiceStreamCode = null
        NewInvoicing = true
      } else {
        InvoiceStreamCode = validInvoiceStreams.first()
        NewInvoicing = false
      }
    }
    InvoiceStreamInterval = plan.PaymentFrequency

    if (not(Automatic or Container.AllowResponsive)) {
      Automatic = true
    }
    // Refresh the InvoiceStreamsLV only if the list of invoice streams have changed.
    if (!InvoiceStreams*.PublicID.disjunction(oldInvoiceStreams*.PublicID).isEmpty()) {
      Container.invalidatePCFElementIterators(BillingInvoiceStreamInfo)
    }
  }

  override protected function resetInvoiceStreamsAndPaymentInstruments() {
    updateInvoiceStreamAccordingToPaymentPlan(Container.PaymentPlanChoice)
    PaymentInstruments = Container.retrieveAvailablePaymentInstruments()
    PaymentInstrument = PaymentInstruments.first()
    Container.invalidatePCFElementIterators(BillingPaymentInstrument)
  }
}