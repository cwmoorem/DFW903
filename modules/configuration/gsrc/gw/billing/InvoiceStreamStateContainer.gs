package gw.billing

uses gw.plugin.billing.BillingInvoiceStreamInfo
uses gw.plugin.billing.BillingPaymentInstrument
uses gw.plugin.billing.PaymentPlanData

/**
 * This class is a helper class for the Invoice Stream section of the billing payment page. It provides states and
 * methods that facilitate rendering of the page.
 */
@Export
interface InvoiceStreamStateContainer {

  property get CustomBilling() : boolean
  property set CustomBilling(isCustom : boolean)

  property get NewInvoicing() : boolean
  property set NewInvoicing(val : boolean)

  property get Automatic() : boolean
  property set Automatic(isAutomatic : boolean)

  property get InvoiceStreamCode() : String
  property set InvoiceStreamCode(code : String)

  property get InvoiceStream() : BillingInvoiceStreamInfo

  property get InvoiceStreams() : BillingInvoiceStreamInfo[]

  property get InvoiceStreamInterval() : BillingPeriodicity
  property set InvoiceStreamInterval(interval : BillingPeriodicity)

  property get PaymentInstrument() : BillingPaymentInstrument
  property set PaymentInstrument(instrument : BillingPaymentInstrument)

  property get PaymentInstruments() : BillingPaymentInstrument[]
  property set PaymentInstruments(instruments : BillingPaymentInstrument[])

  property get DueDateBilling() : boolean
  property set DueDateBilling(isDueDateBilling : boolean)
  property get FirstDayOfMonth() : int
  property set FirstDayOfMonth(day : int)
  property get SecondDayOfMonth() : int
  property set SecondDayOfMonth(day : int)
  property get DayOfWeek() : DayOfWeek
  property set DayOfWeek(day : DayOfWeek)
  property get FirstAnchorDate() : Date
  property set FirstAnchorDate(date : Date)
  property get Description() : String
  property set Description(description : String)

  property get AccountUnapplied() : boolean
  property set AccountUnapplied(isUnaplied : boolean)

  property get UnappliedFundID() : String
  property set UnappliedFundID(description : String)

  property get UnappliedFundDescription() : String
  property set UnappliedFundDescription(description : String)

  /**
   * Update the invoice stream for this policy period based on its selected payment plan.
   *
   * @param plan
   */
  function updateInvoiceStreamAccordingToPaymentPlan(plan : PaymentPlanData)

  property get PaymentDateVisible() : boolean
  property get DayOfWeekVisible() : boolean
  property get FirstDayOfMonthVisible() : boolean
  property get SecondDayOfMonthVisible() : boolean

  /**
   * Sets the invoice stream state back to default values
   * These defaults need to be kept in sync with the defaults in the {@link BillingInvoiceStream} entity
   */
  function clearInvoiceStreamState()
}