package acc.pc.scheme.pageprocess

uses java.util.regex.Pattern
uses com.guidewire.pl.system.database.metadata.TableMetadata
uses java.util.ArrayList

class SchemeConditionDetailPageProcess {
    
  private var _schemeCondition     : SchemeCondition_Ext          as schemeCondition
  private var _isConditionEditable : boolean                      as isConditionEditable  = true
  private var _location            : pcf.api.Location
  private var _tableWrappers       : List<tableWrapper>           as tableWrappers

  class tableWrapper {
    private var _tableName  : String as TableName
    private var _entityName : String as EntityName
    private var _metaData   : TableMetadata as MetaData
  }
  
  construct(inSchemeCondition : SchemeCondition_Ext, inLocation : pcf.api.Location) {
    loadTables()
    if(inSchemeCondition == null){
      _schemeCondition = new SchemeCondition_Ext()
      _schemeCondition.Condition = "/** All condition must start with (VALUE as ROOT)\n    VALUE and ROOT will be substituted at runtime */\n(VALUE as ROOT)"
    } else {
      _schemeCondition = inSchemeCondition
    }
    _location = inLocation
  }
  
  private function updateParam(parameters : List<String>)
  { 
    for(newParam in parameters) {
      var paramExist  = false
      if(!_schemeCondition.SchemeConditionParams.hasMatch( \ elt1 -> elt1.Parameter == newParam)){
        var schemeConditionParam = new SchemeConditionParam_Ext()
        schemeConditionParam.Parameter = newParam
        this._schemeCondition.addToSchemeConditionParams(schemeConditionParam)
      }
    }
    
    for(param in _schemeCondition.SchemeConditionParams) {
      if(!parameters.contains(param.Parameter)) {
         _schemeCondition.removeFromSchemeConditionParams(param)
      }        
    }
  }
  
  public function parseCondition()
  {
    _isConditionEditable = false
    var pattern = Pattern.compile("#[^#]+#")
    var parameters : List<String> = {}
    var matcher = pattern.matcher(_schemeCondition.Condition)
    while (matcher.find()) {
      var param = matcher.group().replace("#","")
      if(!parameters.contains(param)) {
        parameters.add(param)
      }
    }
    updateParam(parameters)
    gw.api.web.PebblesUtil.invalidateIterators(_location,SchemeConditionParam_Ext)
  }
  
   /**
   * Create a list of available products to assign to a scheme condition
   */  
  public function availableProducts() : List<gw.api.productmodel.Product> {
   return gw.api.productmodel.ProductLookup.getAll().sortBy(\ p -> p.DisplayName )
  }
  
  /**
   * Function called before commiting
   * Normalizes line endings in multi line fields
   * 
   */
  public function beforeCommit(){
    //Normalize line endings to LF
     if(_schemeCondition.Condition!=null) _schemeCondition.Condition = _schemeCondition.Condition.replaceAll("\\r", "")
     if(_schemeCondition.Description!=null) _schemeCondition.Description = _schemeCondition.Description.replaceAll("\\r", "")
    return
  }

  private function loadTables(){
    _tableWrappers = new ArrayList<tableWrapper>()
    var tableInfos = new gw.api.tools.DatabaseInfo().TableInfos
    for(tableInfo in tableInfos){
      var metaData = tableInfo.DBTable.TableMetadata
      if(metaData.EntityName != null){
        var wrapper = new tableWrapper(){:EntityName = metaData.EntityName, :TableName = metaData.TableName, :MetaData = metaData}
        _tableWrappers.add(wrapper)
      }
    }
  }

}
