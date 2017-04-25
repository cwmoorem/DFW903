package gw.plugin.billing

uses gw.api.locale.DisplayKey
uses gw.api.system.PCLoggerCategory
uses gw.pl.currency.MonetaryAmount

uses java.lang.SuppressWarnings
uses java.math.RoundingMode

@Export
abstract class BillingUtilityMethods {

  static function getNumberOfInstallments(downPayment: MonetaryAmount, installment: MonetaryAmount, installmentFee: MonetaryAmount, total: MonetaryAmount): int {
    if (total == null or downPayment == null or installment == null or installment.IsZero) {
      return 0
    }

    var installmentWithFee = installmentFee == null ? installment : installment.add(installmentFee)

    return total.subtract(downPayment).divide(installmentWithFee, RoundingMode.CEILING).intValue()
  }

  static function getNumberOfPayments(downPayment: MonetaryAmount, installment: MonetaryAmount, installmentFee: MonetaryAmount, total: MonetaryAmount): int {
    if (total == null or downPayment == null or installment == null or installment.IsZero) {
      return 1
    }

    var numberOfInstallments = getNumberOfInstallments(downPayment, installment, installmentFee, total)

    return (downPayment.Amount > 0) ? numberOfInstallments + 1 : numberOfInstallments
  }

  @SuppressWarnings({"all"})
  public static function convertPaymentMethodToAccountPaymentMethod(paymentMethodValue : String) : AccountPaymentMethod {
    var accountPaymentMethod = AccountPaymentMethod.get(paymentMethodValue)

    if (accountPaymentMethod == null or accountPaymentMethod.Retired) {
      PCLoggerCategory.BILLING_SYSTEM_PLUGIN.error(DisplayKey.get("BillingSystemPlugin.Error.MismatchedPaymentMethod", paymentMethodValue))
      accountPaymentMethod = AccountPaymentMethod.TC_UNSUPPORTED
    }

    return accountPaymentMethod
  }
}
