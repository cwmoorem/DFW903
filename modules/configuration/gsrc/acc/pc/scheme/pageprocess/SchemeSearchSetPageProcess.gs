package acc.pc.scheme.pageprocess

uses java.util.ArrayList
uses java.util.ArrayList
uses gw.api.database.Query

class SchemeSearchSetPageProcess {

  private var _schemesSets : ArrayList<SchemeSearchSet_Ext> as schemesSets
  
  public construct(){
    init()
  }

  /**
   * Initalisation of the class
   */
  private function init(){
    _schemesSets = new ArrayList<SchemeSearchSet_Ext>()
    _schemesSets.addAll(Query.make(SchemeSearchSet_Ext).select().toSet())
    var bundle = gw.transaction.Transaction.getCurrent()
    _schemesSets.each(\ s -> bundle.add(s))
  }

  /**
   * Create a new scheme
   */
  public function addSchemeSearchSet() : SchemeSearchSet_Ext{
    var schemeSet = new SchemeSearchSet_Ext()
    _schemesSets.add(schemeSet)
    return schemeSet
  }
  
  /**
   * Remove the given scheme
   * @param inScheme The scheme to remove
   */
  public function removeSchemeSearchSet(inSchemeSet : SchemeSearchSet_Ext) {
    _schemesSets.remove(inSchemeSet)
    inSchemeSet.remove()
    gw.transaction.Transaction.getCurrent().commit()
  }
  
}
