package acc.pc.bl

uses gw.api.database.IQueryBeanResult
uses gw.api.database.Query
uses pcf.BLEntityDetail_Ext

/**
 * Created by cwmoorem on 25/01/2017.
 */
class BLMainPageProcess_Ext {

  private var _filterList : ArrayList<BLFilter>           as filterList
  private var _filter     : BLFilter                      as filter

  class BLFilter {
    private var _code : String as Code
    private var _name : String as Name
  }

  construct(){
    init()
  }

  private function init(){
    _filterList = new ArrayList<BLFilter>()
    BLEntityType_Ext.AllTypeKeys.each(\elt -> {
      _filterList.add(new BLFilter(){:Code = elt.Code, :Name = elt.DisplayName})
    })
    _filterList.add(new BLFilter(){:Code = "all", :Name = "All"})
    _filter = _filterList.firstWhere(\elt -> elt.Code == BLEntityType_Ext.TC_ENTITY.Code)
  }

  public function filteredBL() : BLEntity_Ext[] {
    if(_filter.Code == "all"){
      return extractBLEntities().toTypedArray()
    } else {
      return extractBLEntities().where(\elt -> elt.BLEntityType.Code == _filter.Code).toTypedArray()
    }
  }

  public function extractBLEntities() : IQueryBeanResult<BLEntity_Ext> {
    var query = Query.make(BLEntity_Ext)
        .select()
    return query
  }

  public function removeBLEntity(inEntity : BLEntity_Ext){
    inEntity.remove()
  }

  public function clone(inDetail : BLEntity_Ext){
    BLEntityDetail_Ext.go(inDetail, true)
  }

}