package acc.pc.apa.pageprocess

uses acc.pc.apa.APAMacroParameters_Ext
uses gw.api.database.Query
uses gw.api.productmodel.Product
uses typekey.*


class APATestPageProcess_Ext {

  private var _apaMacro        : APAMacro_Ext               as APAMacro
  private var _macroParameters : APAMacroParameters_Ext     as MacroParameters

  construct(){
    _macroParameters = new APAMacroParameters_Ext()
  }

  public function extractAPAMacros() : APAMacro_Ext[] {
    var query = Query.make(APAMacro_Ext)
        .select()
    return query.toTypedArray()
  }

  public function productCodes() : Product[]{
    return gw.api.productmodel.ProductLookup.getAll().toTypedArray()
  }

  public function isVisible(inType : typekey.APAMacroInput_Ext) : boolean {
    var retVal = false
    if(_apaMacro != null) {
      if (_apaMacro.APAMacroInputs.hasMatch(\elt1 -> (elt1.APAMacroInput == inType) and (elt1.RequiredInput == true))) {
        retVal = true
      }
    }
    return retVal
  }



}