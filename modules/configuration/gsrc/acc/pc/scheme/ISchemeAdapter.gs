package acc.pc.scheme

interface ISchemeAdapter {
  
  public property set ConditionValue(inValue: Object)
  public property get ConditionValue()                   : Object
  public property get PolicyPeriod()                      : PolicyPeriod
  public property set PolicyPeriod(inValue: PolicyPeriod)

}
