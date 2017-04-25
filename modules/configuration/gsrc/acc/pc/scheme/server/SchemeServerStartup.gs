package acc.pc.scheme.server

uses java.util.ArrayList

class SchemeServerStartup {

  private var _schemeTables : List<SchemeTableWrapper>        as schemeTables

  private static var _instance : SchemeServerStartup = null

  private construct() {
    init()
  }

  public static property get Instance() : SchemeServerStartup {
    if(_instance == null) {
      _instance = new SchemeServerStartup()
    }
    return _instance
  }

  private function init(){
    loadTables()
  }

  public static function Startup(){
    var startup = SchemeServerStartup.Instance
  }

  private function loadTables(){
    _schemeTables = new ArrayList<SchemeTableWrapper>()
    var tableInfos = new gw.api.tools.DatabaseInfo().TableInfos
    for(tableInfo in tableInfos){
      var metaData = tableInfo.DBTable.TableMetadata
      if(metaData.EntityName != null){
        var wrapper = new SchemeTableWrapper(){:EntityName = metaData.EntityName, :TableName = metaData.TableName, :MetaData = metaData, :Subtype = false}
        var colArray = new ArrayList<String>()
        for(col in metaData.Columns){
          colArray.add(col.ColumnName)
        }
        wrapper.Columns = colArray
        _schemeTables.add(wrapper)
      }
      var subData = tableInfo.DBTable.ContainedSubTables
      if(subData != null) {
        subData.each(\elt -> {
          var wrapper = new SchemeTableWrapper(){:EntityName = elt.SubTypeName, :TableName = elt.SubTypeName, :MetaData = null, :Subtype = true}
          var colArray = new ArrayList<String>()
          for (col in elt.ApplicableSourceColumns) {
            colArray.add(col.Name)
          }
          wrapper.Columns = colArray
          _schemeTables.add(wrapper)
        })
      }
    }
  }

}