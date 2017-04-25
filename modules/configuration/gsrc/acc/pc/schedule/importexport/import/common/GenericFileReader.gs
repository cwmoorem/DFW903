package acc.pc.schedule.importexport.import.common
uses java.util.Date
uses java.lang.Integer
uses java.lang.Long
uses java.math.BigDecimal

interface GenericFileReader {
  
  /*
  *  Given the column (tag) name, returns the value of the current row 
  */
  public function getValue(columnName : String) : String
  public function getValueIndex(columnIndex : int) : String   
  /*
  *  Jump to the next row (submission) - return true if a submission exists, false if we reach the end of the data 
  */
  public function loadNextRow() : boolean
  
  /*
  *  Return the name of the file without the full path. Used to retrieve the Translator file
  */
  public function getName() : String

  /*
  *  Return the path of the file without name. Used to retrieve the Translator file
  */
  public function getPath() : String

  /*
  *  Return the full name of the file including the full path. Used to retrieve the Translator file
  */
  public function getFullName() : String
  
  public function getIntegerValue(columnName : String) : Integer
  
  public function getLongValue(columnName : String) : Long
  
  public function getDecimalValue(columnName : String) : BigDecimal
  
  public function getDecimalValueIndex(columnIndex : int) : BigDecimal
  
  public function getDateValue(columnName : String) : Date
  
  public function getDateValueIndex(columnIndex : int) : Date
  
  public function getBooleanValue(columnName : String) : Boolean

}
