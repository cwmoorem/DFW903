package acc.pc.schedule.importexport.import.xlsx
uses acc.pc.schedule.importexport.import.common.GenericFileReader
uses java.io.File
uses java.io.FileInputStream
uses org.apache.poi.xssf.usermodel.XSSFWorkbook
uses org.apache.poi.xssf.usermodel.XSSFSheet
uses org.apache.poi.xssf.usermodel.XSSFCell
uses java.math.BigDecimal
uses org.apache.poi.ss.usermodel.FormulaEvaluator
uses java.lang.Double
uses java.lang.Integer
uses java.util.HashMap
uses java.lang.Long
uses java.util.Date
uses java.lang.Exception
uses java.text.SimpleDateFormat

/*
*  This class represent an excel file to import. It only consider one sheet, where the first row is the header and the first column is a counter (rowNum).
*  The counter cannot be null as per datawarehousing best practices. 
*/
class ExcelFileReader implements GenericFileReader {
  
  var _fullFilePath : String
  var _workbook : XSSFWorkbook as Workbook
  var _currentRowNumber : int as CurrentRowNumber
  var _currentSheet : XSSFSheet as CurrentSheet
  var _currentSheetNumber : int as CurrentSheetNumber
  var _evaluator : FormulaEvaluator
  var _header : HashMap<String, Integer>

  construct(fullFilePath : String) {
    _fullFilePath = fullFilePath
    initWorkbook()
    _header = loadHeader()
  }
  
  /*
  *  Initialize the workbook 
  */
  private function initWorkbook() {

    var file =  new File(_fullFilePath)

    if (!(file.exists() and file.canRead())) {
      throw new gw.api.util.DisplayableException("Unable to read file ${_fullFilePath}")
    }

    Workbook = new XSSFWorkbook(new FileInputStream(file))

    CurrentSheetNumber = 0
    CurrentRowNumber = 0
    CurrentSheet = Workbook.getSheetAt(CurrentSheetNumber)

  }

  override function getValue(columnName : String) : String {
    return getValue(_header.get(columnName))
  }
  
  override function getValueIndex(columnIndex : int) : String {
    return getValue(columnIndex)
  }
  
  /*
  *  Get the value at the column number index 
  */
  private function getValue(columnIndex : int) : String {
    if (CurrentSheet==null) return null

    if (CurrentSheet.LastRowNum >= CurrentRowNumber and CurrentSheet.FirstRowNum <= CurrentRowNumber) {
      var row = CurrentSheet.getRow(CurrentRowNumber)
      if (row != null and row.FirstCellNum <= columnIndex and row.LastCellNum>=columnIndex) {
        var cell = row.getCell(columnIndex)
        if (cell != null) {
          return getCellValueAsString(cell)
        }
      }
    }

    return null
  }
  
  /*
  *  Return the cell value as a string  
  */ 
  private function getCellValueAsString(cell : XSSFCell) : String {
    switch (cell.CellType) {
    //switch (_evaluator.evaluateFormulaCell(cell)) {
      case XSSFCell.CELL_TYPE_STRING:
          return cell.StringCellValue
      case XSSFCell.CELL_TYPE_BLANK:
          return null
      case XSSFCell.CELL_TYPE_NUMERIC:
          return new BigDecimal(cell.NumericCellValue).toString()
      case XSSFCell.CELL_TYPE_FORMULA:
          _evaluator.clearAllCachedResultValues()
          _evaluator.evaluateFormulaCell(cell)
          if (cell.CachedFormulaResultType == XSSFCell.CELL_TYPE_NUMERIC){
            return Double.toString(cell.NumericCellValue)
          }
          else return cell.StringCellValue
      case XSSFCell.CELL_TYPE_BOOLEAN:
          if (cell.BooleanCellValue) return "Y"
          else return "N"
        default:
      return null
    }
  }

  override function loadNextRow() : boolean {
    CurrentRowNumber = CurrentRowNumber + 1
    if (getValue(0) != null) 
      return true
    return false
  }
  
  /*
  *  Return first row (the header) as an HashMap<ColumnName, ColumnPosition> 
  */
  private function loadHeader() : HashMap<String, Integer> {
    var header = new HashMap<String, Integer>()
    var column = 0
    var value = getValue(column)
    while (value != null) {
      header.put(value, column)
      column++
      value = getValue(column)
    }
    return header
  }

  override function getName() : String {
    var slashIndex = _fullFilePath.lastIndexOf("\\")
    return _fullFilePath.substring(slashIndex + 1, _fullFilePath.length)
  }

  override function getFullName() : String {
    return _fullFilePath
  }

  override function getPath() : String {
    var slashIndex = _fullFilePath.lastIndexOf("\\")
    return _fullFilePath.substring(0, slashIndex +1  )
  }


  override function getIntegerValue(columnName : String) : Integer {
    var retVal : Integer
    try{
      retVal = new Integer(getValue(columnName))
    } catch (e : Exception){
      retVal = null
    }
    return retVal
  }

  override function getLongValue(columnName : String) : Long {
    var retVal : Long
    try{
      retVal = new Long(getValue(columnName))
    } catch (e : Exception){
      retVal = null
    }
    return retVal
  }

  override function getDateValue(columnName : String) : Date {
    var retVal : Date
     try {
      retVal = (new SimpleDateFormat("yyyy-MM-dd").parse(getValue(columnName)))
    } catch (e : Exception){
      retVal = null
    }
    return retVal
  }

  override function getBooleanValue(columnName : String) : Boolean {
    var retVal : Boolean
    try{
      retVal = new Boolean(getValue(columnName))
    } catch (e : Exception){
      retVal = null
    }
    return retVal
  }


  override function getDecimalValue(columnName : String) : BigDecimal {
    var retVal : BigDecimal
    try{
      retVal = new BigDecimal(getValue(columnName))
    } catch (e : Exception){
      retVal = null
    }
    return retVal
  }


  override function getDecimalValueIndex(columnIndex : int) : BigDecimal {
    var retVal : BigDecimal
    try{
      retVal = new BigDecimal(getValueIndex(columnIndex))
    } catch (e : Exception){
      retVal = null
    }
    return retVal
  }


  override function getDateValueIndex(columnIndex : int) : Date {
    var retVal : Date
     try {
      retVal = (new SimpleDateFormat("yyyy-MM-dd").parse(getValueIndex(columnIndex)))
    } catch (e : Exception){
      retVal = null
    }
    return retVal
  }

}
