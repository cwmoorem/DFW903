package acc.pc.bl.inputs

/**
 * Created by cwmoorem on 07/02/2017.
 */
class AbstractBLValueInput_Ext<T> {

  private var _stringValue   : String               as StringValue
  private var _dateValue     : Date                 as DateValue
  private var _dateTimeValue : Date                 as DateTimeValue
  private var _booleanValue  : Boolean              as BooleanValue
  private var _integerValue  : Integer              as IntegerValue
  private var _label         : String               as Label
  private var _valueType     : BLValueType_Ext      as ValueType

  public property set InputValue(inValue : T){
    switch (_valueType){
      case BLValueType_Ext.String:
        _stringValue = inValue as String
        break
      case BLValueType_Ext.Date:
        _dateValue = inValue as Date
        break
      case BLValueType_Ext.Boolean:
        _booleanValue = inValue as Boolean
        break
      case BLValueType_Ext.Integer:
        _integerValue = inValue as Integer
        break
      case BLValueType_Ext.DateTime:
        _dateTimeValue = inValue as Date
        break
    }
  }

  public property get InputValue() : T {
    switch (_valueType){
      case BLValueType_Ext.String:
        return _stringValue as T
      case BLValueType_Ext.Date:
        return _dateTimeValue as T
      case BLValueType_Ext.DateTime:
        return _dateValue as T
      case BLValueType_Ext.Boolean:
        return _booleanValue as T
      case BLValueType_Ext.Integer:
        return _integerValue as T
    }
    return null
  }

  public property get valueAsString() : String {
    switch (_valueType){
      case BLValueType_Ext.String:
        return _stringValue
      case BLValueType_Ext.Date:
        return _dateTimeValue.toString()
      case BLValueType_Ext.DateTime:
        return _dateValue.toString()
      case BLValueType_Ext.Boolean:
        return _booleanValue.toString()
      case BLValueType_Ext.Integer:
        return _integerValue.toString()
    }
    return null
  }

}