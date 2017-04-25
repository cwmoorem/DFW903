package acc.pc.scheme

enhancement SchemeDetailParamEnhancement : SchemeDetailParam_Ext {

  public property get ParamValueForCode() : String {
    switch(this.SchemeConditionParam.ParamValueType) {
      case SchemeValueType_Ext.TC_BOOLEAN:
          return this.BooleanValue.toString()
      case SchemeValueType_Ext.TC_DATE:
          return "new Date(\""+this.DateValue.MonthOfYear+"/"+this.DateValue.DayOfMonth+"/"+this.DateValue.YearOfDate+"\")"
      case SchemeValueType_Ext.TC_DECIMAL:
          return "new BigDecimal("+this.DecimalValue.toString()+")"
      case SchemeValueType_Ext.TC_INTEGER:
          return this.IntegerValue.toString()
      case SchemeValueType_Ext.TC_LONG:
          return "new Long("+this.LongValue.toString()+")"
      case SchemeValueType_Ext.TC_MONEY:
          return "new BigDecimal(${this.MoneyValue.toString()})"
      case SchemeValueType_Ext.TC_STRING:
          return "\""+this.StringValue+"\""
      case SchemeValueType_Ext.TC_OTHER:
          return this.StringValue
      default: return null
    } 
  }

}
