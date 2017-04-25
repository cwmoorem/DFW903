package acc.pc.schedule.importexport.import.common
uses gw.xml.XmlElement
uses java.io.File

/*
*  This class represents the XML file that translate from PolicyCenter DataModel ColumnName to file ColumnName 
*/
class FileDictionary {
  
  private var _fileDictionary : XmlElement

  construct(fileToLoad : GenericFileReader) {
    //retrieve the file dictionary path and name 
    var _fileDictionaryName = getFileDictionaryName(fileToLoad)
    _fileDictionary = loadFileDictionary(_fileDictionaryName)
    if(_fileDictionary == null)
      throw new gw.api.util.DisplayableException("Unable to find a translator file for: " + fileToLoad.getName())
    
  }
  
  /*
  *  This method search for the file translator for the file to import. If not found raise an exception. 
  */
  private function loadFileDictionary(fileToLoad : String) : XmlElement {
    var file = new java.io.File(fileToLoad)
    var xmlRoot = XmlElement.parse(file) 
    return  xmlRoot
  }

  /*
  *  This method return the name of the file dictionary based on the name of the file to load. 
  *  For the POC, the file dictionary has the same path/name but with _dictionary.xml at the end 
  *  For real usage... you can do what you want 
  */
  private function getFileDictionaryName(fileToLoad : GenericFileReader) : String {
    var fileName = fileToLoad.getName()
    var dotIndex = fileName.lastIndexOf(".") 
    var name = fileToLoad.getPath()+fileName.substring(0, dotIndex )+"_dictionary.xml"
    return  name
  }
  
  /*
  * Given the name of the entity and the column to import, it returns the name of the column in the file 
  */
  public function getColumnTranslation(entityName : String, columnName : String) : String {

    var column = _fileDictionary.$Children.where(\ e -> e.$QName.LocalPart == "column").
                 firstWhere(\ c -> c.$Children.hasMatch(\ x -> x.$QName.LocalPart == "entity" and x.$Text == entityName+"."+columnName))
    if (column == null) 
      throw new gw.api.util.DisplayableException("Unable to find " + entityName + "." + columnName + " in translation file")
    var translationValue = column.getChild("translation").$Text
    return translationValue
  }
}
