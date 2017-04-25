package gw.api.util

uses gw.currency.fxrate.FXRate
uses gw.pl.currency.MonetaryAmount

enhancement FXRateUtilEnhancement : FXRateUtil {

  @Deprecated("Deprecated in PC 9.0; this method is no longer in use.  Use FXRateUtil.convertAmount directly from now on.", "PC 9.0")
  static function convertAndScale(amount : MonetaryAmount, rate : FXRate) : MonetaryAmount {
    if (amount == null) {
      return null
    } else if (rate == null) { //coverage and settlement currency match
      return amount
    }
    return MonetaryAmounts.roundToCurrencyScale(FXRateUtil.convertAmount(amount, rate))
  }
}