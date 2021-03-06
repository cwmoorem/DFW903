package gw.lob.cp.rating

uses gw.financials.PolicyPeriodFXRateCache
uses gw.pl.persistence.core.Key
uses java.util.Date

@Export
class CPBuildingCovBroadCostData extends CPBuildingCovCostData<CPBuildingCovBroadCost> {

  construct(effDate : Date, expDate : Date, covID : Key, stateArg : Jurisdiction) {
    super(effDate, expDate, covID, stateArg)
  }

  construct(effDate : Date, expDate : Date, c : Currency, rateCache : PolicyPeriodFXRateCache, covID : Key, stateArg : Jurisdiction) {
    super(effDate, expDate, c, rateCache, covID, stateArg)
  }

  construct(cost : CPBuildingCovBroadCost) {
    super(cost)
  }

  construct(cost : CPBuildingCovBroadCost, rateCache : PolicyPeriodFXRateCache) {
    super(cost, rateCache)
  }

  override function setSpecificFieldsOnCost(line : CommercialPropertyLine, cost : CPBuildingCovBroadCost) {
    super.setSpecificFieldsOnCost(line, cost)
  }
  
  override function toString() : String {
    return super.toString() + " Coverage : Broad"  // no need for i18n
  }
  
}
