package gw.api.util

uses java.math.BigDecimal
uses gw.api.util.CurrencyUtil
uses java.math.RoundingMode
uses gw.api.financials.CurrencyAmount

enhancement CurrencyUtilEnhancement : CurrencyUtil {
  /**
   * This method returns a CurrencyAmount with the given value in the default Currency for the system.  It
   * has been deprecated as any calling code should really be Currency aware and provide the Currency for rounding
  */
  @Deprecated("PC9.0.0. Use CurrencyUtil.roundToCurrencyScale(BigDecimal, Currency, Mode) instead", "PC9.0.0")
  static function roundToCurrencyScaleNullSafe(value : BigDecimal) : CurrencyAmount {
    if (value == null) {
      return null
    }
    return CurrencyUtil.roundToCurrencyScale(value, CurrencyUtil.getDefaultCurrency(),CurrencyUtil.getRoundingMode())
  }
}
