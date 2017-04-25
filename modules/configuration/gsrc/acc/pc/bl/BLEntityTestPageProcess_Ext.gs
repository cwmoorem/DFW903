package acc.pc.bl

uses acc.pc.bl.inputs.BLValueInput_Ext
uses acc.pc.bl.inputs.BLValueType_Ext
uses gw.api.database.Query

class BLEntityTestPageProcess_Ext {

  private var _blEntity            : BLEntity_Ext        as BLEntity
  private var _blCommand           : BLEntity_Ext        as BLCommand
  private var _commandString       : String              as CommandString
  private var _stringValue         : String              as StringValue
  private var _attributeName       : String              as AttributeName
  private var _results             : String              as Results
  private var _blEntityUtility_Ext : BLEntityUtility_Ext as BLEntityUtility_Ext = new BLEntityUtility_Ext()
  private var _blInput             : BLValueInput_Ext    as BLInput

  construct(){
  }

  public function reset(){
    _blCommand = null
    _blEntity = null
    _commandString = new String()
    _stringValue = new String()
    _attributeName = null
    _results = null
    _blEntityUtility_Ext = new BLEntityUtility_Ext()
  }

  public function evaluateExpression(){

    _blEntityUtility_Ext.BLEntity = _blEntity
    _blEntityUtility_Ext.BLCommand = _blCommand
    _blEntityUtility_Ext.AttributeName = _attributeName

    _blEntityUtility_Ext.buildCommand(_blInput)
    _commandString = _blEntityUtility_Ext.CommandString

  }

  public function executeExpression(){
    var retVal : String
    var query = Query.make(Policy).select().first()
    try {
      retVal = _blEntityUtility_Ext.executeCommand(query.LatestPeriod)
    } catch (e : Exception){
      retVal = e.Message
    }
    _results = retVal
  }


  public property get BLEntities() : List<BLEntity_Ext> {
    return Query.make(BLEntity_Ext).select().toList().where(\elt -> elt.BLEntityType == BLEntityType_Ext.TC_ENTITY)
  }

  public property get BLCommands() : List<BLEntity_Ext> {
    return Query.make(BLEntity_Ext).select().toList().where(\elt -> elt.BLEntityType == BLEntityType_Ext.TC_COMMAND)
  }

  public function checkRequired () {
    _blEntityUtility_Ext.checkRequired(_blCommand)
    switch (_blEntityUtility_Ext.RequiredInformation.ValueType){
      case BLValueType_Ext.String:
        _blInput = new BLValueInput_Ext<String>()
        break
      case BLValueType_Ext.Date:
        _blInput = new BLValueInput_Ext<Date>()
        break
      case BLValueType_Ext.DateTime:
        _blInput = new BLValueInput_Ext<Date>()
        break
      case BLValueType_Ext.Boolean:
        _blInput = new BLValueInput_Ext<Boolean>()
        break
      case BLValueType_Ext.Integer:
        _blInput = new BLValueInput_Ext<Integer>()
        break
    }
    if(_blInput != null) {
      _blInput.Label = "Value"
      _blInput.ValueType = _blEntityUtility_Ext.RequiredInformation.ValueType
    }
  }

}