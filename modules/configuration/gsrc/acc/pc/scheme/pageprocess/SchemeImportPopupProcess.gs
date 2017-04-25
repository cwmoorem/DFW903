package acc.pc.scheme.pageprocess

uses java.io.File
uses gw.api.util.DisplayableException
uses java.lang.Exception
uses acc.pc.scheme.SchemeImporter
uses java.lang.StringBuilder
uses gw.api.util.Logger
uses java.io.IOException

class SchemeImportPopupProcess {
  private var _location               : pcf.api.Location
  private var _importFolder           : String                       as importFolder
  private var _filesToImport          : File[]                   as filesToImport
  private var _usedImportFolderPath   : String

  //Exception Messages:
  private static final var FILE_DOES_NOT_EXIST = "File does not exist anymore. On: " 
  private static final var FILE_IS_NOT_READABLE = "File is not readable. On: " 
  private static final var FILE_IS_NOT_DIRECTORY = "File is not directory. On: "
  private static final var COULD_NOT_SAVE_ERROR_FILE = "Could not save error file "
  private static final var IMPORT_FILE_EXTENSION = "xml"
  private static final var COULD_NOT_WRITE_ERROR_REPORT_ON_EXPORT_EXC_MSG_FOLOWS = "Could not write an error in error file on scheme export. Exception message follows."
// @todo - Chris
//  private static final var ERROR_SUDIRECTORY_IS_FILE = "There exists an ${ScriptParameters.SchemeImportErrorSubDirectory} file in import directory and it is not a directory"
  private static final var ERROR_SUDIRECTORY_IS_FILE = "There exists an blah blah file in import directory and it is not a directory"
  /**
   * Initializes fields
   * @param inLocation Location of pcfPage
   */
  construct( inLocation: pcf.api.Location) {
    _location = inLocation
// @todo Chris
//    _importFolder = new File(ScriptParameters.SchemeImportDirectoryDefault).CanonicalPath
    _importFolder = new File("C:/tmp/").CanonicalPath
    updateFilesList()
  }
  /**
   * Imports single file to database
   * @param file java.io.File to be imported
   */
  public function importFile(file: File): void{
    if(!file.exists()) throw new DisplayableException(FILE_DOES_NOT_EXIST+ file.Name)
    if(!file.canRead()) throw new DisplayableException(FILE_IS_NOT_READABLE+ file.Name)
    if(file.Directory) throw new DisplayableException(FILE_IS_NOT_DIRECTORY + file.Name)
    try{
      SchemeImporter.importSchemaContainerToDB(file)
    }
    catch(e: Exception){
      //Caught in higher function, logged there
      throw new DisplayableException(e.Message)
    }
  }
  
  /**
   * List .xml files in directory denoted by dirPath
   * @param dirPath Path to a directory containing files for import
   * @return java.io.File array containing every .xml file in directory
   */
  private function listFilesToImport(dirPath: String): File[]{
    if(dirPath==null) return new File[]{}
    var file = new File(dirPath)
    if(!file.exists()) return new File[]{}
    if(!file.Directory)return new File[]{}
    if(!file.canRead()) return new File[]{}
    var extension = IMPORT_FILE_EXTENSION
    return file.listFiles(\ currFile -> currFile.Extension==extension)
  }
  
  /**
   * Updates field with list of .xml files in _importFolder directory
   */
  public function updateFilesList(): void{
    _usedImportFolderPath = _importFolder
    _filesToImport = listFilesToImport(_importFolder)
  }

  function importChecked(files: File[]): void{
    var errorStringBuilder = new StringBuilder()
    for(fileToImport in files){
      try{
        importFile(fileToImport)
        var errFile = getErrorReportFile(fileToImport)
        if(errFile!=null && errFile.exists()){
          errFile.delete()
        }
      }
      catch(e: Exception){
        if(errorStringBuilder.isEmpty()){
          errorStringBuilder.append("Errors in in import file")
        }
        errorStringBuilder.append(fileToImport.Name).append(", ")
        if(!writeAnError(fileToImport.NameSansExtension, e)){
          errorStringBuilder.append(COULD_NOT_SAVE_ERROR_FILE).append(fileToImport.Name)
        }
      }
    }
    if(errorStringBuilder.isEmpty()){
       _location.commit()       
    }
    else{
      errorStringBuilder.append("Error on file post")
      throw new DisplayableException(errorStringBuilder.toString())
    }
  }
  
  /**
   * Writes an error to appropriate directory
   * @param fileName Filename of xml file with issues
   * @param importDirectory Directory in which the error directory will be placed
   * @param e Exception that popped up during import
   * @return Returns false if file operations failed, true otherwise
   */
  private function writeAnError(fileName: String, e: Exception): Boolean {
    var retVal = true
    try{
      var errorsDirectory = getErrorsDirectory()
      if(!errorsDirectory.exists()){
         errorsDirectory.mkdirs()
      }
      var errFile = new File(errorsDirectory, fileName)
      errFile.write(e.Message)
    }
    catch(ex:Exception){
      Logger.logError(COULD_NOT_WRITE_ERROR_REPORT_ON_EXPORT_EXC_MSG_FOLOWS)
      Logger.logError(ex.Message)
      retVal=false
    }
  return retVal
  }

  /**
   * Checks if corresponding error file exists 
   * @return True if exists
   */
   public function checkIfErrorFileExists(file: File): Boolean{
     var errorsDir:File
     errorsDir=null
     try{
     errorsDir = getErrorsDirectory()
     }
     catch(ioex: IOException){
       Logger.logError(ioex.Message)
     }
     if(errorsDir==null)return false
     return (new File(errorsDir, file.NameSansExtension)).exists()
   }
   
   
   /**
    * Gets corresponding errors directory
    * @return Error directory file, won't always exist
    */
   private function getErrorsDirectory(): File{
     if(_usedImportFolderPath==null){
        return null
     }
     var dir = new File(_usedImportFolderPath)
// @todo - Chris
//     var errorsDir = new File(dir, ScriptParameters.SchemeImportErrorSubDirectory)
     var errorsDir = new File(dir, "c:/tmp/error/")
     if(errorsDir.exists() and !errorsDir.Directory){
       throw new IOException(ERROR_SUDIRECTORY_IS_FILE)
     }
     return errorsDir
   }
   /**
    * Gets error report for scheme xml file
    * @param fileForImport File that error file corresponds to
    * @return Returns contents of error report file(or null if it doesn't exist)
    */
   public function getErrorReportString(fileForImport: File): String{
     var f = getErrorReportFile(fileForImport)
     if(f==null) return null
     return f.read()
   }
   /**
    * Gets error report file for scheme xml file
    * @param fileForImport File that error file corresponds to
    * @return Returns error report file(might not exist) or null(if directory doesn't exist)
    */
   private function getErrorReportFile(fileForImport: File): File{
      var errorsDir = getErrorsDirectory()
      if(!errorsDir.exists()) return null
      return (new File(errorsDir, fileForImport.NameSansExtension))
   }
}
