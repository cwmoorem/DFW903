package acc.pc.apa.pageprocess

uses gw.api.database.IQueryBeanResult
uses gw.api.database.Query

class APAMainPageProcess_Ext {

  private var _filterList : ArrayList<APAFilter>           as filterList
  private var _filter     : APAFilter                      as filter

  class APAFilter {
    private var _code : String as Code
    private var _name : String as Name
  }

  construct(){
    init()
  }

  private function init(){
    _filterList = new ArrayList<APAFilter>()
    APAMacroType_Ext.AllTypeKeys.each(\elt -> {
      _filterList.add(new APAFilter(){:Code = elt.Code, :Name = elt.DisplayName})
    })
    _filterList.add(new APAFilter(){:Code = "all", :Name = "All"})
    _filter = _filterList.firstWhere(\elt -> elt.Code == APAMacroType_Ext.TC_ONLINE.Code)
  }

  public function filteredAPA() : APAMacro_Ext[] {
    if(_filter.Code == "all"){
      return extractAPAMacros().toTypedArray()
    } else {
      return extractAPAMacros().where(\elt -> elt.APAMcroType.Code == _filter.Code).toTypedArray()
    }
  }

  public function extractAPAMacros() : IQueryBeanResult<APAMacro_Ext> {
    var query = Query.make(APAMacro_Ext)
        .select()
    return query
  }

}