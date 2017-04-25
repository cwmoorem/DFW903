package acc.pc.scheme

class SchemeAdapter implements ISchemeAdapter{
  
  var _value  : Object
  var _scheme : Scheme_Ext
  var _period : PolicyPeriod

  construct(inScheme : Scheme_Ext) {
    _scheme = inScheme
  }

  override property set ConditionValue (inValue : Object) {
    _value = inValue
  }
  
  override property get ConditionValue () : Object {
    return _value
  }

  override property get PolicyPeriod() : PolicyPeriod {
    return _period
  }

  override property set PolicyPeriod(inValue : PolicyPeriod) {
    _period = inValue
  }

}
