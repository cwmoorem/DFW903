package acc.pc.scheme

uses gw.api.productmodel.Product

enhancement SchemeConditionExtEnhancement : SchemeCondition_Ext {

  public property get schemeProduct() : Product {
    return gw.api.productmodel.ProductLookup.getByCode(this.ProductCode)
  }

  public property set schemeProduct(inProduct : Product) {
    this.ProductCode = inProduct.Code
  }

}
