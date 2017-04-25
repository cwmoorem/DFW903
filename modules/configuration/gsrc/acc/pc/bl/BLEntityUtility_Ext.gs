package acc.pc.bl

uses acc.pc.bl.inputs.BLValueInput_Ext
uses acc.pc.bl.inputs.BLValueType_Ext

class BLEntityUtility_Ext {

  var _commandString       : String              as CommandString
  var _actionObject        : Object
  var _actionObjectName    : String
  var _attributeName       : String              as AttributeName
  var _blEntity            : BLEntity_Ext        as BLEntity
  var _blCommand           : BLEntity_Ext        as BLCommand
  var _blEntityType        : String              as BLEntityType
  var _requiredInformation : requiredInformation as RequiredInformation

  class requiredInformation{
    private var _entityRequired    : boolean          as EntityRequired
    private var _valueRequired     : boolean          as ValueRequired
    private var _dateValueRequired : boolean          as DateValueRequired
    private var _valueType         : BLValueType_Ext  as ValueType
  }

  construct(){

  }

  public function buildCommand(inValue : BLValueInput_Ext){
    var updateFlag = false
    var expandCommand = ""

    var processArray = _blCommand.EntityPath.split("\n")
    for(line in processArray.where(\elt -> elt != "@Protected")){
      if(line.indexOf("@Update") >= 0){
        updateFlag = true
        var command = new StringBuffer()
        var entity = entityString(updateFlag).replaceAll("@" + _actionObjectName, "(inActionObject as " + _actionObjectName + ")")
        command.append("var _updateItem = " + entity + "#" + _attributeName)
        command.append("\n")
        command.append("_updateItem.set(" + convertValue(inValue) +")")
        _commandString = command.toString()

      } else {
        if(updateFlag == false) {
          if (line.indexOf("@Entity") >= 0) {
            _commandString = line.replaceAll("@Value", convertValue(inValue))
                .replaceAll("@StringValue", convertValue(inValue))
                .replaceAll("@DateValue", convertValue(inValue))
                .replaceAll("@DateTimeValue", convertValue(inValue))
                .replaceAll("@BooleanValue", convertValue(inValue))
                .replaceAll("@IntegerValue", convertValue(inValue))
                .replaceAll("@Entity", entityString(updateFlag))
                .replaceAll("@" + _actionObjectName, "(inActionObject as " + _actionObjectName + ")")

          } else {
            _commandString = line.replaceAll("@Value", convertValue(inValue))
                .replaceAll("@StringValue", convertValue(inValue))
                .replaceAll("@DateValue", convertValue(inValue))
                .replaceAll("@DateTimeValue", convertValue(inValue))
                .replaceAll("@BooleanValue", convertValue(inValue))
                .replaceAll("@IntegerValue", convertValue(inValue))

          }
        }
      }
    }
  }

  public function entityString(inUpdateFlag : boolean) : String {
    var retVal = ""
    var processArray : String[]
    var actionObjectPos = -1
    if(_blEntity != null) {

      processArray = _blEntity.EntityPath.split("\n")
      for(line in processArray.where(\elt -> elt != "@Protected") index i){
        if(line.indexOf("@Type:") >= 0){
          _blEntityType = line.substring(line.indexOf(":") + 1)
        } else {
          actionObjectPos = line.indexOf(".")
          if(actionObjectPos >= 0){
            _actionObjectName = line.substring(0,actionObjectPos).replaceAll("@","")
          }
          if(inUpdateFlag != true) {
            retVal = retVal + (_attributeName != null ? line + "." + _attributeName : line)
          } else {
            retVal = retVal + line
          }
          if(i < (processArray.Count - 1)){
            retVal = retVal + "\n"
          }
        }
      }
    }
    return retVal
  }

  public function executeCommand<T>(inActionObject : T) : String {
    var retVal : Object
    try {

    if(_actionObjectName != null){
      if(typeof inActionObject == Type.forName("entity."+_actionObjectName)) {
        retVal = eval(_commandString)
      }
    } else {
      retVal = eval(_commandString)
    }
    if(retVal == null){
      return null
    }
    } catch (e : Exception){
      retVal = e.Message
    }
    return retVal.toString()
  }

  private function convertValue(inValue : BLValueInput_Ext) : String {
    var retVal : String
    switch (inValue.ValueType){
      case BLValueType_Ext.Date:
        retVal = "new java.util.Date(" + inValue.DateValue.getTime() + ")"
        break;
      case BLValueType_Ext.DateTime:
        retVal = "new java.util.Date(" + inValue.DateTimeValue.getTime() + ")"
        break;
      case BLValueType_Ext.Boolean:
        retVal = inValue.BooleanValue.toString()
        break;
      case BLValueType_Ext.Integer:
        retVal = inValue.IntegerValue.toString()
        break;
      case BLValueType_Ext.String:
        if(inValue.StringValue.indexOf('"') >= 0) {
          retVal = inValue.StringValue
        } else {
          retVal = '"' + inValue.StringValue + '"'
        }
        break
      default:
        retVal = ""
    }
    return retVal
  }

  public function checkRequired(inCommand : BLEntity_Ext){
    _requiredInformation = new requiredInformation()

    if(inCommand.EntityPath.indexOf("@DateValue") >= 0){
      _requiredInformation.ValueType = BLValueType_Ext.Date
    }

    if(inCommand.EntityPath.indexOf("@DateTimeValue") >= 0){
      _requiredInformation.ValueType = BLValueType_Ext.DateTime
    }

    if(inCommand.EntityPath.indexOf("@Value") >= 0){
      _requiredInformation.ValueType = BLValueType_Ext.String
    }

    if(inCommand.EntityPath.indexOf("@StringValue") >= 0){
      _requiredInformation.ValueType = BLValueType_Ext.String
    }

    if(inCommand.EntityPath.indexOf("@BooleanValue") >= 0){
      _requiredInformation.ValueType = BLValueType_Ext.Boolean
    }

    if(inCommand.EntityPath.indexOf("@IntegerValue") >= 0){
      _requiredInformation.ValueType = BLValueType_Ext.Integer
    }

    _requiredInformation.EntityRequired    = (inCommand.EntityPath.indexOf("@Entity") >= 0 ? true : false)

  }

}