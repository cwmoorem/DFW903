package gw.web.policy

uses gw.api.locale.DisplayKey
uses gw.api.util.MonetaryAmounts
uses gw.billing.PolicyPeriodBillingInstructionsManager
uses gw.pl.currency.MonetaryAmount
uses gw.plugin.billing.InstallmentPlanData

/**
 * Defines utility methods to help render {@link InstallmentPlanData} properties
 * for display in a user interface.
 */
@Export
class InstallmentPlanDataRenderHelper {
  var _tax : MonetaryAmount as readonly Tax
  var _totalPremium : MonetaryAmount as readonly TotalPremium

  construct(tax : MonetaryAmount, totalPremium : MonetaryAmount) {
    _tax = tax
    _totalPremium = totalPremium
  }

  private property get Currency() : Currency {
    return TotalPremium.Currency
  }

  property get HasTax() : boolean {
    return hasValue(Tax)
  }

  function renderInvoiceStreamInterval(billingMethodState : PolicyPeriodBillingInstructionsManager) : String {
    if (billingMethodState.CustomBilling) {
      if (billingMethodState.NewInvoicing
          && billingMethodState.InvoiceStreamInterval != null) {
        return billingMethodState.InvoiceStreamInterval.toString()
      } else if (billingMethodState.InvoiceStream?.Interval != null) {
        return billingMethodState.InvoiceStream.Interval.toString()
      }
    } else {
      return billingMethodState.PaymentPlanChoice?.PaymentFrequency?.toString()
    }
    return "-"
  }

  function renderInvoiceStreamDays(billingMethodState : PolicyPeriodBillingInstructionsManager) : String {
    if (billingMethodState.CustomBilling) {
      if (billingMethodState.NewInvoicing) {
        var result = ""
        if (billingMethodState.FirstDayOfMonthVisible) {
          result += billingMethodState.FirstDayOfMonth
          if (billingMethodState.SecondDayOfMonthVisible) {
            result += ", " + billingMethodState.SecondDayOfMonth
          }
        } else if (billingMethodState.DayOfWeekVisible) {
          result = billingMethodState.DayOfWeek.DisplayName
        }
        return result;
      } else if (billingMethodState.InvoiceStream?.Days != null) {
        return billingMethodState.InvoiceStream.Days
      }
    } else {
      return DisplayKey.get('Web.Policy.Payment.InvoiceStreamsLV.AccountDefault')
    }
    return "-"
  }

  function renderInvoiceStreamPaymentInstrument(billingMethodState : PolicyPeriodBillingInstructionsManager) : String {
    if (billingMethodState.CustomBilling) {
      if (billingMethodState.NewInvoicing && billingMethodState.CustomBilling) {
        if (billingMethodState.Automatic) {
          return billingMethodState.PaymentInstrument.DisplayName
        } else {
          return DisplayKey.get('Web.Policy.Payment.InvoiceStreamsLV.Manual')
        }
      } else if (billingMethodState.InvoiceStream != null) {
        return billingMethodState.InvoiceStream.PaymentInstrumentName
      }
    } else {
      return DisplayKey.get('Web.Policy.Payment.InvoiceStreamsLV.AccountDefault')
    }
    return "-"
  }

  function renderInvoiceStreamDueDate(billingMethodState : PolicyPeriodBillingInstructionsManager) : String {
    if (billingMethodState.CustomBilling) {
      if (billingMethodState.NewInvoicing && billingMethodState.CustomBilling) {
        return billingMethodState.DueDateBilling
            ? DisplayKey.get('Web.Policy.Payment.InvoiceStreamsLV.DueDate')
            : DisplayKey.get('Web.Policy.Payment.InvoiceStreamsLV.InvoiceDate')
      } else if (billingMethodState.InvoiceStream != null) {
        return billingMethodState.InvoiceStream.DueDateBilling
            ? DisplayKey.get('Web.Policy.Payment.InvoiceStreamsLV.DueDate')
            : DisplayKey.get('Web.Policy.Payment.InvoiceStreamsLV.InvoiceDate')
      }
    } else {
      return DisplayKey.get('Web.Policy.Payment.InvoiceStreamsLV.AccountDefault')
    }
    return "-"
  }

  function renderInstallmentFrequency(planData : InstallmentPlanData) : String {
    return planData == null || planData.InvoiceFrequency == null
        ? "-"
        : planData.InvoiceFrequency.toString();
  }

  function renderDownPayment(planData : InstallmentPlanData) : String {
    if (planData == null || !hasValue(planData.DownPayment) and !HasTax) {
      return "-"
    }

    var defaultOneTimeFee = (planData.DownPayment == null) ? 0bd.ofDefaultCurrency() : 0bd.ofCurrency(planData.DownPayment.Currency)
    var oneTimeFee = planData.OneTimeFee ?: defaultOneTimeFee
    return MonetaryAmounts.render(getMonetaryValue(planData.DownPayment) + getMonetaryValue(Tax) + oneTimeFee)
  }

  function renderDownPaymentDetail(planData : InstallmentPlanData) : String {
    if (planData == null) {
      return ""
    }

    final var downPayment = planData.DownPayment
    if (!hasValue(downPayment) and !HasTax) {
      return ""
    } else if (!HasTax) {
      // down payment only, no taxes...
      return DisplayKey.get('Web.Policy.Payment.InstallmentsPlansLV.PremiumDetail', MonetaryAmounts.render(downPayment)) + getOneTimeFeeDisplayKey(planData)
    } else if (!hasValue(downPayment)) {
      // no down payment, taxes only...
      return DisplayKey.get('Web.Policy.Payment.InstallmentsPlansLV.TaxDetail', MonetaryAmounts.render(Tax)) + getOneTimeFeeDisplayKey(planData)
    }
    return DisplayKey.get('Web.Policy.Payment.InstallmentsPlansLV.DownPaymentDetail', MonetaryAmounts.render(downPayment), MonetaryAmounts.render(Tax)) + getOneTimeFeeDisplayKey(planData)
  }

  private function getOneTimeFeeDisplayKey(planData : InstallmentPlanData) : String {
    return planData.OneTimeFee != null && planData.OneTimeFee.isIsNotZero()
           ? DisplayKey.get('Web.Policy.Payment.InstallmentsPlansLV.DownPaymentDetailFee', MonetaryAmounts.render(planData.OneTimeFee))
           : ""
  }

  function renderNumberOfInstallments(planData : InstallmentPlanData) : String {
    if (planData == null || planData.NumberOfInstallments == null) {
      return "0"
    }

    return planData.NumberOfInstallments.toString()
  }

  function renderInstallment(planData : InstallmentPlanData) : String {
    if (planData == null || !hasValue(planData.Installment) and !hasValue(planData.Fee)) {
      return "-"
    }
    return MonetaryAmounts.render(getMonetaryValue(planData.Installment)
        + getMonetaryValue(planData.Fee))
  }

  function renderInstallmentDetail(planData : InstallmentPlanData) : String {
    if (planData == null) {
      return ""
    }
    final var installment = planData.Installment
    if (!hasValue(installment) and !hasValue(planData.Fee)) {
      return ""
    } else if (!hasValue(planData.Fee)) {
      // installment only, no fee...
      return DisplayKey.get('Web.Policy.Payment.InstallmentsPlansLV.PremiumDetail', MonetaryAmounts.render(installment))
    } else if (!hasValue(installment)) {
      // no installment, fee only...
      return DisplayKey.get('Web.Policy.Payment.InstallmentsPlansLV.FeeDetail', MonetaryAmounts.render(planData.Fee))
    }
    return DisplayKey
        .get('Web.Policy.Payment.InstallmentsPlansLV.InstallmentDetail', MonetaryAmounts.render(installment), MonetaryAmounts.render(planData.Fee))
  }

  function renderTotal(planData : InstallmentPlanData) : String {
    return MonetaryAmounts.render(planData.Total) // includes tax...
  }

  function renderTotalDetail(planData: InstallmentPlanData) : String {
    final var totalPremiumRender = MonetaryAmounts.render(TotalPremium)
    final var fees = planData.TotalFees
    if (hasValue(fees) and HasTax) {
      return DisplayKey
          .get('Web.Policy.Payment.InstallmentsPlansLV.TotalDetail',
              totalPremiumRender, MonetaryAmounts.render(Tax),
              MonetaryAmounts.render(planData.TotalFees))
    } else if (HasTax) {
      return DisplayKey
          .get('Web.Policy.Payment.InstallmentsPlansLV.TotalWOFeesDetail',
              totalPremiumRender, MonetaryAmounts.render(Tax))
    } else if (hasValue(fees)) {
      return DisplayKey
          .get('Web.Policy.Payment.InstallmentsPlansLV.TotalWOTaxDetail',
              totalPremiumRender, MonetaryAmounts.render(planData.TotalFees))
    }
    return DisplayKey
        .get('Web.Policy.Payment.InstallmentsPlansLV.PremiumDetail',
            totalPremiumRender)
  }

  /**
   * @param the {@link MonetaryAmount} value
   * @return Whether the {@code value} is not null and not zero.
   */
  private function hasValue(value : MonetaryAmount) : boolean {
    return value != null and value.IsNotZero
  }

  /**
   * @param the {@link MonetaryAmount} value
   * @return The {@code value} if not null, or {@code 0}.
   */
  private function getMonetaryValue(value : MonetaryAmount) : MonetaryAmount {
    return value?:0bd.ofCurrency(Currency)
  }
}
