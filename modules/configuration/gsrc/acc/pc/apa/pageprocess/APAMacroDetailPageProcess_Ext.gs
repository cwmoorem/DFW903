package acc.pc.apa.pageprocess

uses gw.api.database.Query
uses typekey.*

class APAMacroDetailPageProcess_Ext {

  private var _apaMacro    : APAMacro_Ext   as APAMacro
  private var _allMacros   : APAMacro_Ext[] as AllMacros

  construct(inMacro : APAMacro_Ext){
    if(inMacro == null){
      _apaMacro = new APAMacro_Ext()
    } else {
      _apaMacro = inMacro
    }
    loadAllMacros()
  }

  public function createAndAdd() : APAMacroDetail_Ext{
    var newDetail = new APAMacroDetail_Ext(_apaMacro)
    if(_apaMacro.APAMacroDetails.isIsEmpty()){
      newDetail.DetailOrder = 10
    } else {
      newDetail.DetailOrder = _apaMacro.APAMacroDetails*.DetailOrder.max() + 10
    }
    _apaMacro.addToAPAMacroDetails(newDetail)
    return newDetail
  }

  public function remove(inDetail : APAMacroDetail_Ext) {
    _apaMacro.removeFromAPAMacroDetails(inDetail)
    inDetail.remove()
  }

  public function removeMacro(){
    _apaMacro.remove()
    gw.transaction.Transaction.Current.commit()
    pcf.APAMain_Ext.go()
  }

  public function checkInputs(){
    for(inputkey in typekey.APAMacroInput_Ext.AllTypeKeys){
      if(!_apaMacro.APAMacroInputs.hasMatch(\elt1 -> elt1.APAMacroInput == inputkey)){
        var newInput = new APAMacroInput_Ext(_apaMacro)
        newInput.RequiredInput = false
        newInput.APAMacroInput = inputkey
        _apaMacro.addToAPAMacroInputs(newInput)
      }
    }
  }

  public function resetIncludedMacro(inDetail : APAMacroDetail_Ext){
    if(inDetail.APAActionType != APAActionType_Ext.TC_INCLUDEMACRO){
      inDetail.IncludeMacro = null
    }
  }

  private function loadAllMacros(){
    var retVal = new ArrayList<APAMacro_Ext>()
    var query = Query.make(APAMacro_Ext).select()
    retVal.addAll(query.toCollection())
    retVal.remove(_apaMacro)
    _allMacros = retVal.toTypedArray()
  }

}