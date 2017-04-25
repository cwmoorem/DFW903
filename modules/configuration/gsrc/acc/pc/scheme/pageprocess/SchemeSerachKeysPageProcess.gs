package acc.pc.scheme.pageprocess

uses gw.api.database.Query
uses java.util.ArrayList

class SchemeSerachKeysPageProcess {
  
  private var _searchKeys : List<SchemeSearchKey_Ext> as searchKeys
  

  construct() {
    init()
  }
  
  private function init(){
    var query = Query.make(SchemeSearchKey_Ext).select()
    var bundle = gw.transaction.Transaction.getCurrent()
    searchKeys = new ArrayList<SchemeSearchKey_Ext>()
    for(searchKey in query){
      bundle.add(searchKey)
      searchKeys.add(searchKey)
    }
  }
  
  public function addKey() : SchemeSearchKey_Ext {
    var retVal = new SchemeSearchKey_Ext(gw.transaction.Transaction.getCurrent())
    _searchKeys.add(retVal)
    return retVal
  }
  
  public function removeKey(inKey : SchemeSearchKey_Ext){
    _searchKeys.removeWhere(\ s -> s === inKey)
    inKey.remove()
  }
  
  public function validateKeys(){
    for(key in _searchKeys){
// @todo - Chris
//      XPathResultCxExt.getXPathValidator((Type.forName(key.RootEntity)), key.XPathExt)
    }
  }
}
