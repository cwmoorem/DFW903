package acc.pc.scheme.server

uses com.guidewire.pl.system.database.metadata.TableMetadata

class SchemeTableWrapper {

  private var _tableName  : String        as TableName
  private var _entityName : String        as EntityName
  private var _metaData   : TableMetadata as MetaData
  private var _subtype    : boolean       as Subtype
  private var _columns    : List<String>  as Columns

  construct(){

  }

}