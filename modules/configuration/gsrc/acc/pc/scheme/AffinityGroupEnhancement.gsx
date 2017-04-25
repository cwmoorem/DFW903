package acc.pc.scheme

/**
 * Created by cwmoorem on 27/10/2016.
 */
enhancement AffinityGroupEnhancement: AffinityGroup {

  public function extractScheme(productCode : String) : Scheme_Ext {
    var retVal : Scheme_Ext
    retVal = this.getProducts().firstWhere(\elt -> elt.getProductCode() == productCode).Scheme_Ext
    return retVal
  }

}
