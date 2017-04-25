package acc.pc.scheme.pageprocess

uses java.util.ArrayList
uses java.util.ArrayList
uses gw.api.database.Query
uses gw.entity.IEntityPropertyInfo

class SchemeConditionPageProcess {
  
  private var _schemeConditions : ArrayList<SchemeCondition_Ext> as schemeConditions
  
  public construct(){
    init()
  }

  /**
   * Initalisation of the class
   */
  private function init(){
    _schemeConditions = new ArrayList<SchemeCondition_Ext>()
    _schemeConditions.addAll(Query.make(SchemeCondition_Ext).select().orderBy(SchemeCondition_Ext#Name.PropertyInfo as IEntityPropertyInfo).toList())
    var bundle = gw.transaction.Transaction.getCurrent()
    _schemeConditions.each(\ s -> bundle.add(s))
  }
  
  /**
   * Remove the given scheme condition
   * @param inSchemeCondition The scheme condition to remove
   */
  public function removeSchemeCondition(inSchemeCondition : SchemeCondition_Ext) {
    _schemeConditions.remove(inSchemeCondition)
    inSchemeCondition.remove()
    gw.transaction.Transaction.getCurrent().commit()
  }

}
