package gw.plugin.billing

uses gw.pl.currency.MonetaryAmount
uses java.lang.IllegalArgumentException
uses java.lang.Integer

@Export
class InstallmentPlanDataImpl extends AbstractPaymentPlanData implements InstallmentPlanData {
  var _name: String as Name
  var _downPayment: MonetaryAmount as DownPayment
  var _installment: MonetaryAmount as Installment
  var _oneTimeFee: MonetaryAmount as OneTimeFee
  var _tax: MonetaryAmount as Tax
  var _total: MonetaryAmount as Total
  var _invoiceFrequency: BillingPeriodicity as InvoiceFrequency

  /**
   * @return Number of installments required by this installments plan
   */
  property get NumberOfInstallments(): Integer {
    var downPayment = _downPayment ?: 0bd.ofDefaultCurrency()
    var oneTimeFee = _oneTimeFee ?: 0bd.ofCurrency(downPayment.Currency)
    var tax = _tax ?: 0bd.ofCurrency(downPayment.Currency)

    var totalDownPayment = downPayment + oneTimeFee + tax

    return BillingUtilityMethods.getNumberOfInstallments(totalDownPayment, _installment, Fee, _total)
  }

  override function doCreatePaymentPlanSummary(paymentPlanSummary: PaymentPlanSummary) {
    paymentPlanSummary.PaymentPlanType = PaymentMethod.TC_INSTALLMENTS
    paymentPlanSummary.DownPayment = _downPayment
    paymentPlanSummary.Installment = _installment
    paymentPlanSummary.Total = _total
    paymentPlanSummary.Name = _name
    if (_invoiceFrequency != null) {
      paymentPlanSummary.InvoiceFrequency = _invoiceFrequency
    }
  }

  override function doPopulateFromPaymentPlanSummary(paymentPlanSummary: PaymentPlanSummary) {
    if (paymentPlanSummary.PaymentPlanType != PaymentMethod.TC_INSTALLMENTS) {
      throw new IllegalArgumentException("Cannot populate a InstallmentPlanData from a PaymentPlanSummary that does not have PaymentPlanType of Installments")
    }

    _name = paymentPlanSummary.Name
    _downPayment = paymentPlanSummary.DownPayment
    _installment = paymentPlanSummary.Installment
    _total = paymentPlanSummary.Total
    _invoiceFrequency = paymentPlanSummary.InvoiceFrequency
  }

  override function isSameBillingPaymentPlan(otherPlan : PaymentPlanData) : boolean {
    return (otherPlan != null)
        and (otherPlan.InstallmentsPlan)
        and (otherPlan.BillingId == this.BillingId)
  }

  override function isSameBillingPaymentPlan(summary: PaymentPlanSummary): boolean {
    if(summary == null) {
      return false
    } else {
      return summary.BillingId == this.BillingId
    }
  }

  override property get InstallmentsPlan() : boolean {
    return true
  }
}