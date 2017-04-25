package acc.pc.schedule.util
uses java.util.Date
uses java.text.SimpleDateFormat
uses java.lang.Exception
uses java.lang.Integer
uses java.math.BigDecimal

class ScheduleParseXML_Ext {

  construct() {

  }
  
  public static function parseDate(inDate : String) : Date {
    var dateOut : Date
    try {
      dateOut  = (new SimpleDateFormat("yyyy-MM-dd").parse(inDate))
    } catch (e : Exception){
      dateOut = null
    } 
    return dateOut   
  }
  
  public static  function parseInteger(inInteger : String) : Integer {
    var IntegerOut : Integer
    try {
      IntegerOut  = Integer.parseInt(inInteger)
    } catch (e : Exception){
      IntegerOut = null
    } 
    return IntegerOut   
  } 
  
  public static function parseMoney(inMoney : String) : BigDecimal {
    var MoneyOut : BigDecimal
    try {
      MoneyOut  = (new BigDecimal(inMoney))
    } catch (e : Exception){
      MoneyOut = null
    } 
    return MoneyOut   
  }
  
  public static function parseDecimal(inDecimal : String) : BigDecimal {
    var DecimalOut : BigDecimal
    try {
      DecimalOut  = (new BigDecimal(inDecimal))
    } catch (e : Exception){
      DecimalOut = null
    } 
    return DecimalOut   
  }    

}
