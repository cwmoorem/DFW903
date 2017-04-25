package acc.pc.virtualproduct.enhancement

uses gw.api.productmodel.Product

/**
 * Created by cwmoorem on 19/12/2016.
 */
enhancement VirtualProductEnhancement: VirtualProduct_Ext {

  public property get virtualProductProduct() : Product {
    return gw.api.productmodel.ProductLookup.getByPublicID(this.ProductCode)
  }

  public property set virtualProductProduct(inProduct : Product) {
    this.ProductCode = inProduct.PublicID
  }

}
