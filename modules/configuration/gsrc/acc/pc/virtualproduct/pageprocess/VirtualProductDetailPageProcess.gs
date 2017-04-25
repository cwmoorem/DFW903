package acc.pc.virtualproduct.pageprocess

uses gw.api.database.Query
uses pcf.VirtualProductMain

class VirtualProductDetailPageProcess {

  private var _virtualProduct : VirtualProduct_Ext as virtualProduct

  construct(inVirtualProduct : VirtualProduct_Ext){
    if(inVirtualProduct == null){
      _virtualProduct = createVirtualProduct()
    } else {
      _virtualProduct = inVirtualProduct
      if(_virtualProduct.VirtualProductLines.isIsEmpty()){
        this.changeProduct()
      }
    }
  }

  /**
   * Create a list of available products to assign to a virtual product
   */
  public function availableProducts() : List<gw.api.productmodel.Product> {
    return gw.api.productmodel.ProductLookup.getAll().sortBy(\ p -> p.DisplayName )
  }

  public function changeProduct(){
    for(lines in _virtualProduct.VirtualProductLines){
      lines.remove()
    }
    for(lines in gw.api.productmodel.ProductLookup.getByPublicID(_virtualProduct.ProductCode).LinePatterns){
      var virtualLine = new VirtualProductLine_Ext(_virtualProduct)
      virtualLine.LineCode = lines.PublicID
      virtualLine.LineAvailable = true
      _virtualProduct.addToVirtualProductLines(virtualLine)
    }

  }


  public function createVirtualProduct() : VirtualProduct_Ext {
    var newVirtualProduct = new VirtualProduct_Ext(gw.transaction.Transaction.getCurrent())
    var newFlavour = new VirtualProductFlavour_Ext(newVirtualProduct)
    newFlavour.VirtualProduct = newVirtualProduct
    newFlavour.Code = "base"
    newFlavour.Name = "Base"
    newFlavour.EffectiveDate = Date.CurrentDate
    newFlavour.DefaultFlavour = true
    newVirtualProduct.addToVirtualProductFlavours(newFlavour)

    return newVirtualProduct
  }

  public function addFlavour(inVirtualProduct : VirtualProduct_Ext) : VirtualProductFlavour_Ext{
    var newFlavour = new VirtualProductFlavour_Ext(inVirtualProduct)
    newFlavour.VirtualProduct = inVirtualProduct
    newFlavour.EffectiveDate = Date.CurrentDate
    newFlavour.DefaultFlavour = false
    inVirtualProduct.addToVirtualProductFlavours(newFlavour)
    return newFlavour
  }

  public function removeFlavour(inFlavour : VirtualProductFlavour_Ext){
    inFlavour.VirtualProduct.removeFromVirtualProductFlavours(inFlavour)
  }

  public function removeProduct(inVirtualProduct : VirtualProduct_Ext){
    inVirtualProduct.remove()
    gw.transaction.Transaction.Current.commit()
    VirtualProductMain.go()
  }


}