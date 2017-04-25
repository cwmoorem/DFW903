package gw.financials
uses java.util.Set

enhancement CostSetEnhancement<T extends Cost> : Set<T>
{
  property get Premiums() : Set<T>
  {
    return this.where( \ c -> c.RateAmountType != TC_TAXSURCHARGE ).toSet()
  }
  
  property get TaxSurcharges() : Set<T>
  {
    return this.where( \ c -> c.RateAmountType == TC_TAXSURCHARGE ).toSet()
  }

}
