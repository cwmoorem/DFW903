package acc.pc.virtualproduct.util

uses gw.api.database.Query
uses gw.api.database.Relop

class VirtualProductUtil_Ext {

  /**
   * Extract the virtual products for a given product code and date
   * @param inProduct
   * @param inDate
   * @return
   */
  public static function extractVirtualProducts(inProduct : String, inDate : Date) : List<VirtualProduct_Ext>{
    var retVal = new ArrayList<VirtualProduct_Ext>()
    var query = Query.make(VirtualProduct_Ext)
                     .compare("ProductCode", Relop.Equals, inProduct)
                     .select()
                     .toList()
    query.where(\elt -> elt.EffectiveDate.beforeOrEqual(inDate))
         .where(\elt -> (elt.ExpirationDate.afterOrEqual(inDate) or elt.EffectiveDate == null))
         .toSet()

    retVal.addAll(query)
    return retVal
  }

  /**
   * Extract the various flavours of the virtual product for the given virtual product and date
   * @param inVirtualProduct
   * @param inDate
   * @return
   */
  public static function extractFlavours(inVirtualProduct : VirtualProduct_Ext, inDate : Date) : List<VirtualProductFlavour_Ext> {
    var retVal = inVirtualProduct.VirtualProductFlavours
    retVal = retVal.where(\elt -> elt.EffectiveDate.beforeOrEqual(inDate))
                   .where(\elt -> (elt.ExpirationDate.afterOrEqual(inDate) or elt.EffectiveDate == null))
    return retVal.toList()
  }

}