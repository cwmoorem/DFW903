package acc.pc.job

class AvailableProduct {
  
  private var _productCode      : String                as productCode
  private var _productSelection : ProductSelection      as productSelection
  private var _variation        : VirtualProduct_Ext    as variation
  private var _order            : int                   as order

  construct() {
  }
  
  public property get ProductName () : String {
    var retVal : String
    if(_variation != null){
      retVal = _variation.Name
    } else {
      retVal = _productSelection.Product.DisplayName
    }
    return retVal
  }  
}
