package gw.webservice.pc.pc800.policy

uses gw.xml.ws.annotation.WsiExportable
uses gw.pl.currency.MonetaryAmount
uses java.math.BigDecimal

@Export
@WsiExportable( "http://guidewire.com/pc/ws/gw/webservice/pc/pc800/policy/PolicyEarnedPremiumInfo" )
@Deprecated(:value="800 inter-app integration packages will be removed in PC10.", :version="PC 9.0.0")
final class PolicyEarnedPremiumInfo {
  
  var _line : String as LOB
  var _earnedPremium : BigDecimal as EarnedPremium
  var _premiumCurrency : Currency as PremiumCurrency

  construct() {
  }
  
  private construct(line : String, earned : MonetaryAmount ) {
    _line = line
    _earnedPremium = earned.Amount
    _premiumCurrency = earned.Currency
  }
}
