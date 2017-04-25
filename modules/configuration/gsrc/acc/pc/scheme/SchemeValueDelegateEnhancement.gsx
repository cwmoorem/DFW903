package acc.pc.scheme

uses java.math.BigDecimal
uses java.lang.Integer
uses java.lang.Long
uses java.util.Date

uses gw.entity.ITypeList
uses gw.entity.TypeKey
uses gw.lang.reflect.TypeSystem

uses java.util.ArrayList

enhancement SchemeValueDelegateEnhancement: SchemeValueDelegate_Ext {
  
  public property set Value(value : Object) {
    var valueFieldsName : String[] = {"BooleanValue", "DateValue", "DecimalValue", "IntegerValue", "LongValue", "MoneyValue", "StringValue"}
    
    for(valueField in valueFieldsName) {
      this[valueField] = null
    }
    
    var type : SchemeValueType_Ext = null
    if(this typeis SchemeDetail_Ext) {
      type = this.SchemeValueType
    } else if(this typeis SchemeDetailParam_Ext) {
      type = this.SchemeConditionParam.ParamValueType
    }
    
    switch(type) {
      case SchemeValueType_Ext.TC_BOOLEAN:
          this.BooleanValue = value as Boolean
          break
      case SchemeValueType_Ext.TC_DATE:
          this.DateValue = value as Date
          break
      case SchemeValueType_Ext.TC_DECIMAL:
          this.DecimalValue = value as BigDecimal
          break
      case SchemeValueType_Ext.TC_INTEGER:
          this.IntegerValue = value as Integer
          break
      case SchemeValueType_Ext.TC_LONG:
          this.LongValue = value as Long
          break
      case SchemeValueType_Ext.TC_MONEY:
          this.MoneyValue = value as BigDecimal
          break
      case SchemeValueType_Ext.TC_STRING:
          this.StringValue = value as String
          break
      case SchemeValueType_Ext.TC_TYPEKEY:
          this.StringValue = value as String
          break
    }        
  }
  
  public property get Value() : Object {
    
    var type : SchemeValueType_Ext = null
    if(this typeis SchemeDetail_Ext) {
      type = this.SchemeValueType
    } else if(this typeis SchemeDetailParam_Ext) {
      type = this.SchemeConditionParam.ParamValueType
    }
    
    switch(type) {
      case SchemeValueType_Ext.TC_BOOLEAN:
          return this.BooleanValue
      case SchemeValueType_Ext.TC_DATE:
          return this.DateValue
      case SchemeValueType_Ext.TC_DECIMAL:
          return this.DecimalValue
      case SchemeValueType_Ext.TC_INTEGER:
          return this.IntegerValue
      case SchemeValueType_Ext.TC_LONG:
          return this.LongValue
      case SchemeValueType_Ext.TC_MONEY:
          return this.MoneyValue
      case SchemeValueType_Ext.TC_STRING:
          return this.StringValue
      case SchemeValueType_Ext.TC_TYPEKEY:
          return this.StringValue
      default: return null
    }
  }

  public function retrieveTypeCodesFromTypeList() : ArrayList<TypeKey> {
    var retVal = new ArrayList<TypeKey>()
    if(this typeis SchemeDetail_Ext){
      try{
        var entityName = this.ParentCode.toString().replaceFirst("entity.","")
        var typeListName = (Type.forName("entity." + entityName).TypeInfo.Properties.firstWhere(\elt -> elt.Name == this.Comparator).Type)
        var typeList = TypeSystem.getByFullName(typeListName.getName()) as ITypeList
        retVal.addAll(typeList.getTypeKeys(false))
      } catch (e : Exception){

      }
    }
    return retVal
  }
}
