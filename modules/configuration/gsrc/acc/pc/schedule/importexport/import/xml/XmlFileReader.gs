package acc.pc.schedule.importexport.import.xml
uses acc.pc.schedule.importexport.import.common.GenericFileReader
uses gw.xml.XmlElement
uses java.lang.Integer
uses java.lang.Long
uses java.util.Date
uses java.math.BigDecimal

class XmlFileReader implements GenericFileReader {
  
  var _fullFilePath : String
  var _file : XmlElement
  var _currentRow = -1 // since the xml file doesn't have an header the first row is 0 
  var _numSubmissions : Integer  

  construct(fullFilePath : String) {
    _fullFilePath = fullFilePath
    var file = new java.io.File(fullFilePath)
    _file = XmlElement.parse(file) 
    _numSubmissions = _file.$Children.Count
  }


  override function getValue(columnName : String) : String {
    var column = _file.$Children.get(_currentRow)
    if (column == null) 
      return null
    var translationValue = column.getChild(columnName).$Text
    if (translationValue == "")
      return null
    return translationValue
  }

  override function loadNextRow() : boolean {
    if (_currentRow + 1 < _numSubmissions) {
      _currentRow++
      return true 
    }
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


  override function getIntegerValue(columnName : String) : Integer {
    return null //## todo: Implement me
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
