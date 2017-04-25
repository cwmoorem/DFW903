package gw.billing

uses gw.plugin.billing.BillingInvoiceStreamInfo
uses gw.plugin.billing.BillingPaymentInstrument
uses gw.plugin.billing.PaymentPlanData

/**
 * This class provides the common implementation and interface for InvoiceStreamStateContainer
 */
@Export
abstract class AbstractInvoiceStreamState implements InvoiceStreamStateContainer {
  var _container : InvoiceStreamStateContainerImpl as Container
  var _invoiceStreamCode : String as InvoiceStreamCode
  var _invoiceStreamInterval : BillingPeriodicity as InvoiceStreamInterval
  var _invoiceStreamAutomatic : boolean as Automatic
  var _unappliedFundID : String as UnappliedFundID
  var _accountUnapplied : boolean as AccountUnapplied
  var _unappliedFundDescription : String as UnappliedFundDescription
  var _paymentInstrument : BillingPaymentInstrument as PaymentInstrument
  var _paymentInstruments : BillingPaymentInstrument[] as PaymentInstruments
  var _dueDateBilling : boolean as DueDateBilling
  var _firstDayOfMonth : int as FirstDayOfMonth
  var _secondDayOfMonth : int as SecondDayOfMonth
  var _dayOfWeek : DayOfWeek as DayOfWeek
  var _firstAnchorDate : Date as FirstAnchorDate
  var _description : String as Description

  var _invoiceStreams: BillingInvoiceStreamInfo[] as InvoiceStreams
  var _newInvoicing: boolean as NewInvoicing

  protected construct(parent : InvoiceStreamStateContainerImpl) {
    _container = parent
  }

  static function createDefaultBillingInvoiceStreamState(parent : InvoiceStreamStateContainerImpl) : DefaultBillingInvoiceStreamState {
    var result = new DefaultBillingInvoiceStreamState(parent)
    result.clearInvoiceStreamState()
    return result
  }

  static function createCustomBillingInvoiceStreamState(parent : InvoiceStreamStateContainerImpl) : CustomBillingInvoiceStreamState {
    var result = new CustomBillingInvoiceStreamState(parent)
    result.clearInvoiceStreamState()
    return result
  }

  function populateFromPolicyPeriod(period: PolicyPeriod) {
    // do nothing
  }

  function saveStateToPolicyPeriod(period : PolicyPeriod) {
    period.CustomBilling = CustomBilling
    if (NewInvoicing) {
      saveNewInvoicingToPolicyPeriod(period)
    } else {
      period.InvoiceStreamCode = InvoiceStreamCode
    }
  }

  private function saveNewInvoicingToPolicyPeriod(period : PolicyPeriod) {
    period.InvoiceStreamCode = null
    period.NewInvoiceStream.Interval = InvoiceStreamInterval
    period.NewInvoiceStream.UnappliedFundID = UnappliedFundID
    period.NewInvoiceStream.UnappliedFundDescription = UnappliedFundDescription
    if (Automatic) {
      period.NewInvoiceStream.PaymentInstrumentID = PaymentInstrument.PublicID
      period.NewInvoiceStream.PaymentMethod = PaymentInstrument.PaymentMethod
    } else {
      period.NewInvoiceStream.PaymentInstrumentID = null
      period.NewInvoiceStream.PaymentMethod = AccountPaymentMethod.TC_RESPONSIVE
    }
    period.NewInvoiceStream.DueDateBilling = DueDateBilling
    period.NewInvoiceStream.FirstDayOfMonth = FirstDayOfMonth
    period.NewInvoiceStream.SecondDayOfMonth = SecondDayOfMonth
    period.NewInvoiceStream.DayOfWeek = DayOfWeek
    period.NewInvoiceStream.FirstAnchorDate = FirstAnchorDate
    period.NewInvoiceStream.Description = Description
  }

  override property get NewInvoicing() : boolean {
    return _newInvoicing and Container.AllowNewInvoicing
  }

  property set Automatic(value : boolean) {
    _invoiceStreamAutomatic = value
    if (Automatic) {
      var instrument = Container.retrieveAvailablePaymentInstruments().first()
      PaymentInstrument = instrument
      Container.invalidatePCFElementIterators(BillingPaymentInstrument)
    } else {
      PaymentInstrument = null
    }
  }

  override property set CustomBilling(isCustom : boolean) {
    if (isCustom != CustomBilling) {
      Container.selectCustomBilling(isCustom)
    }
  }

  property get InvoiceStream() : BillingInvoiceStreamInfo {
    return InvoiceStreams == null
        ? null
        : InvoiceStreams.firstWhere(\elt -> elt.PublicID == InvoiceStreamCode)
  }

  protected property get Container() : InvoiceStreamStateContainerImpl {
    return _container
  }

  /**
   * Resets the state back to default values
   */
  function clearInvoiceStreamState() {
    _invoiceStreamCode = null
    _invoiceStreamInterval = BillingPeriodicity.TC_MONTHLY
    _invoiceStreamAutomatic = true
    _newInvoicing = true
    clearNewInvoicingAttributes()
  }

  /**
   * Resets the state back to default values
   */
  protected function clearNewInvoicingAttributes() {
    _dueDateBilling = false
    _firstDayOfMonth = 1
    _secondDayOfMonth = 15
    _dayOfWeek = DayOfWeek.TC_FRIDAY
    _firstAnchorDate = null
    _description = null
    _paymentInstrument = null
    _unappliedFundID = null
    _unappliedFundDescription = null
  }

  abstract function updateInvoiceStreamAccordingToPaymentPlan(plan : PaymentPlanData)
  protected abstract function resetInvoiceStreamsAndPaymentInstruments()

  property get PaymentDateVisible() : boolean{
    return not (DayOfWeekVisible or FirstDayOfMonthVisible)
  }

  property get DayOfWeekVisible() : boolean{
    return InvoiceStreamInterval == BillingPeriodicity.TC_EVERYWEEK
  }

  property get FirstDayOfMonthVisible() : boolean{
    return InvoiceStreamInterval == BillingPeriodicity.TC_MONTHLY or InvoiceStreamInterval == BillingPeriodicity.TC_TWICEPERMONTH
  }

  property get SecondDayOfMonthVisible() : boolean{
    return InvoiceStreamInterval == BillingPeriodicity.TC_TWICEPERMONTH
  }
}