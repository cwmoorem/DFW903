package acc.pc.scheme

class SchemeDetailAdapter implements ISchemeDetailAdapter{
  
  var _value  : Object
  var _detail : SchemeDetail_Ext

  construct(inDetail : SchemeDetail_Ext) {
    _detail = inDetail
  }

  override property set ConditionValue (inValue : Object) {
    _value = inValue
  }
  
  override property get ConditionValue () : Object {
    return _value
  }

}
