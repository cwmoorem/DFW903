package acc.pc.schedule.importexport.import

uses acc.pc.schedule.importexport.import.common.GenericFileReader
uses acc.pc.schedule.importexport.import.xlsx.ExcelFileReader
uses acc.pc.schedule.importexport.import.txt.TextFileReader
uses acc.pc.schedule.importexport.import.xml.XmlFileReader
uses acc.pc.schedule.importexport.import.common.FileDictionary

class ScheduleImportFromFile {
  
  
  construct() {

  }
  
  /*
  *  Load the selected file
  */
  public static function load(fullFilePath : String) : GenericFileReader{
    
    var dotIndex = fullFilePath.lastIndexOf(".")
    
    if (dotIndex <= 0) 
      throw new gw.api.util.DisplayableException("Files without extension are not supported")  
    
    //get file extension
    var extension = fullFilePath.substring(dotIndex + 1, fullFilePath.length)
    var file : GenericFileReader
    
    switch( extension ) 
    {  
      case "xlsx" :    
      file = new ExcelFileReader(fullFilePath)
      break
      case "txt" :    
      file = new TextFileReader(fullFilePath, "~")
      break
      case "csv" :    
      file = new TextFileReader(fullFilePath, ",")
      break
      case "xml" :    
      file = new XmlFileReader(fullFilePath)
      break
      default :    
      throw new gw.api.util.DisplayableException("Not supported file extension: " + extension)
    }
  
    return file
  }
  
    

}
