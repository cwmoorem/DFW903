package acc.pc.schedule.importexport.import.txt
uses acc.pc.schedule.importexport.import.common.GenericFileReader
uses java.io.File
uses java.io.BufferedReader
uses gw.util.StreamUtil
uses java.io.FileInputStream
uses java.util.HashMap
uses java.lang.Integer
uses java.lang.Long
uses java.util.Date
uses gw.api.util.Logger
uses java.lang.Exception
uses java.math.BigDecimal

class TextFileReader implements GenericFileReader {
  
  var _fullFilePath : String
  var _reader : java.io.BufferedReader
  var _header : HashMap<String, Integer>
  var _currentLine : String
  var _separator : String

  construct(fullFilePath : String, separator : String) {
    _fullFilePath = fullFilePath
    _separator = separator
    initFile()
    _header = loadHeader()
  }

  /*
  *  Initialize the file 
  */
  private function initFile() {

    var file =  new File(_fullFilePath)

    if (!(file.exists() and file.canRead())) {
      throw new gw.api.util.DisplayableException("Unable to read file ${_fullFilePath}")
    }
    
    _reader = new BufferedReader( StreamUtil.getInputStreamReader( new FileInputStream( file ) ) )
    loadNextRow()
    
  }

  override function getValue(columnName : String) : String {
    return getValue(_header.get(columnName))
  }

  override function loadNextRow() : boolean {
     _currentLine = _reader.readLine()
     if( _currentLine != null ) 
       return true
     return false
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
  
  /*
  *  Get the value at the column number index 
  */
  private function getValue(columnIndex : int) : String {
    var lineArray = _currentLine.split(_separator)
    if (columnIndex + 1 > lineArray.length)
      return null
    var value = lineArray[columnIndex]
    if (value == "") 
      return null
    return value
  }


  override function getIntegerValue(columnName : String) : Integer {
    Logger.logInfo("Int @@@@@@@@@@@@@@@@ " + getValue(columnName))
    var retVal : Integer
    try{
      retVal = Integer.getInteger(getValue(columnName))
    } catch (e : Exception){
      print(e.Message)
      retVal = null
    }
    return retVal
  }

  override function getLongValue(columnName : String) : Long {
    return null //## todo: Implement me
  }

  override function getDateValue(columnName : String) : Date {
    return null //## todo: Implement me
  }

  override function getBooleanValue(columnName : String) : Boolean {
    return null //## todo: Implement me
  }


  override function getValueIndex(columnIndex : int) : String {
    return null //## todo: Implement me
  }


  override function getDecimalValue(columnName : String) : BigDecimal {
    return null //## todo: Implement me
  }


  override function getDecimalValueIndex(columnIndex : int) : BigDecimal {
    return null //## todo: Implement me
  }


  override function getDateValueIndex(columnIndex : int) : Date {
    return null //## todo: Implement me
  }

}
