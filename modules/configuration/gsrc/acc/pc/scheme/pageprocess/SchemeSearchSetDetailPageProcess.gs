package acc.pc.scheme.pageprocess

uses java.util.ArrayList
uses java.util.ArrayList
uses gw.api.database.Query

class SchemeSearchSetDetailPageProcess {
  
  private var _location             : pcf.api.Location
  private var _schemeSet            : SchemeSearchSet_Ext                 as schemeSet
  private var _sourceSchemeSet      : SchemeSearchSet_Ext                 as isourceSchemeSet
  private var _searchKeys           : ArrayList<SchemeSearchKey_Ext>      as searchKeys
  
  construct(inSchemeSet : SchemeSearchSet_Ext, inLocation : pcf.api.Location) {
    init(inSchemeSet, inLocation)
  }
  
  /**
   * Initalisation code
   */
  private function init(inSchemeSet : SchemeSearchSet_Ext, inLocation : pcf.api.Location) {
    _sourceSchemeSet = inSchemeSet
    _location = inLocation
    if(inSchemeSet == null){
      _schemeSet = new SchemeSearchSet_Ext()
    } else {
      _schemeSet = inSchemeSet
    }
    _searchKeys = new ArrayList<SchemeSearchKey_Ext>()
    var query = Query.make(SchemeSearchKey_Ext).select().toList()
    _searchKeys.addAll(query)
  }
  
  /**
   * Function to add new detail row to the scheme set
   * @paramm scheme Scheme to add the detail to
   */
  public function addDetail() : SchemeSearchSetItem_Ext{
    var schemeSetDetail = new SchemeSearchSetItem_Ext(schemeSet)
    schemeSetDetail.SchemeSearchSet = schemeSet
    schemeSet.addToSchemeSearchSetItems(schemeSetDetail)
    return schemeSetDetail
  }
  
  public function removeDetail(inSetDetail : SchemeSearchSetItem_Ext){
    _schemeSet.removeFromSchemeSearchSetItems(inSetDetail)
  }
  
  /**
   * Remove the current scheme
   */
  public function removeSchemeSearchSet(){
    _schemeSet.remove()
    gw.transaction.Transaction.getCurrent().commit()
  }
  
  /**
   * Function called before commit
   * Normalize line endings to LF
   */
  public function beforeCommit()
  {
    if(_schemeSet.Description!=null) _schemeSet.Description = _schemeSet.Description.replaceAll("\\r", "")
  }

}
