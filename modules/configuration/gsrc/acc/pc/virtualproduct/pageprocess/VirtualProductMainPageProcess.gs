package acc.pc.virtualproduct.pageprocess

uses gw.api.database.IQueryBeanResult
uses gw.api.database.Query
uses gw.api.database.Relop

class VirtualProductMainPageProcess {


  construct(){


  }

  public function extractVirtualProducts() : IQueryBeanResult<VirtualProduct_Ext> {
    var query = Query.make(VirtualProduct_Ext)
                     .select()
    return query
  }

  public function removeProduct(inProduct : VirtualProduct_Ext){
    inProduct.remove()
  }


}