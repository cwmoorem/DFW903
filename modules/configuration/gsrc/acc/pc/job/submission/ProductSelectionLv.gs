package acc.pc.job.submission

uses acc.pc.job.AvailableProduct
uses java.util.ArrayList
uses gw.api.database.Query

class ProductSelectionLv {

  private var _ProducerSelection : ProducerSelection as ProducerSelection

  construct(inProducerSelection : ProducerSelection){
    _ProducerSelection = inProducerSelection
  }

  public function availableProductOffers(productOffers : ProductSelection[]) : AvailableProduct[] {

    var availableProducts = new ArrayList<AvailableProduct>()
    var queryProducts = Query.make(VirtualProduct_Ext).select()
    for(product in productOffers){
      for(qProduct in queryProducts.where(\elt -> elt.ProductCode == product.ProductCode)){
        if(qProduct.VirtualProductType == VirtualProductType_Ext.TC_OPEN or
            (qProduct.VirtualProductType == VirtualProductType_Ext.TC_CLOSED and qProduct.Organization == User.util.CurrentUser.Organization)) {
          if(qProduct.EffectiveDate.beforeOrEqual(_ProducerSelection.getDefaultPPEffDate()) and
              (qProduct.ExpirationDate == null or qProduct.ExpirationDate.afterOrEqual(_ProducerSelection.getDefaultPPEffDate()))) {
            var availableProduct = new AvailableProduct()
            availableProduct.productCode = product.ProductCode
            availableProduct.productSelection = product
            availableProduct.variation = qProduct
            availableProduct.order = 999
            availableProducts.add(availableProduct)
          }
        }
      }
      if(ScriptParameters.OnlyVirtualProducts == false) {
        var availableProduct = new AvailableProduct()
        availableProduct.productCode = product.ProductCode
        availableProduct.productSelection = product
        availableProduct.order = 1
        availableProducts.add(availableProduct)
      }
    }
    return availableProducts.toTypedArray()
  }

}