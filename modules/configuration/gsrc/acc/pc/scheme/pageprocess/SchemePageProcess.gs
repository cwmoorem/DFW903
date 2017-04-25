package acc.pc.scheme.pageprocess

uses java.util.ArrayList
uses gw.api.database.Query

class SchemePageProcess {

  private var _schemes    : ArrayList<Scheme_Ext>             as schemes
  private var _filter     : SchemeFilter                      as filter
  private var _filterList : ArrayList<SchemeFilter>           as filterList

  /**
   * Internal class to store the possible filter values to display in the PCF
   */
  class SchemeFilter {
    private var _code : String as Code
    private var _name : String as Name
  }
  
  public construct() {
    init()
  }

  /**
   * Initalisation of the class
   */
  private function init(){
    _schemes = new ArrayList<Scheme_Ext>()
    _schemes.addAll(Query.make(Scheme_Ext).select().toSet())
    var bundle = gw.transaction.Transaction.getCurrent()
    _schemes.each(\ s -> bundle.add(s))

    _filterList = new ArrayList<SchemeFilter>()
    SchemeType_Ext.AllTypeKeys.each(\elt -> {
      _filterList.add(new SchemeFilter(){:Code = elt.Code, :Name = elt.DisplayName})
    })
    _filterList.add(new SchemeFilter(){:Code = "all", :Name = "All"})
    _filter = _filterList.firstWhere(\elt -> elt.Code == SchemeType_Ext.TC_PUBLIC.Code)
  }

  /**
   * Extract the schemes that correspond to the set filter
   * @return Array of Schemes
   */
  public function filteredSchemes() : Scheme_Ext[] {
    if(_filter.Code == "all"){
      return _schemes.toTypedArray()
    } else {
      return _schemes.where(\elt -> elt.SchemeType.Code == _filter.Code).toTypedArray()
    }
  }

  /**
   * Create a new scheme
   */
  public function addScheme() : Scheme_Ext{
    var scheme = new Scheme_Ext()
    _schemes.add(scheme)
    return scheme
  }
  
  /**
   * Remove the given scheme
   * @param inScheme The scheme to remove
   */
  public function removeScheme(inScheme : Scheme_Ext) {
    _schemes.remove(inScheme)
    inScheme.remove()
    gw.transaction.Transaction.getCurrent().commit()
  }
  
  /**
   * Clone the provided scheme to create a copy
   * @param inScheme The scheme to copy
   */
  public function cloneScheme(inScheme : Scheme_Ext){
    pcf.SchemeDetail.push(inScheme, true)
  }
  
  /**
   * Convert scheme to xml and output to popup
   * @param inScheme The scheme to convert
   */
   public function exportScheme(inSchemes: Scheme_Ext[]){
     pcf.SchemeExportPopup.push(inSchemes)
  }

  public function importScheme(){
    
  }
  
}