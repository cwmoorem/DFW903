package acc.pc.scheme.pageprocess

uses java.io.File
uses gw.api.util.DisplayableException
uses gw.api.util.Logger
uses java.lang.StringBuilder
uses java.lang.Exception
uses java.util.Date
uses acc.pc.scheme.SchemeExporter

class SchemeExportPopupProcess {

  private var _schemesExported        : Scheme_Ext[]                  as schemesExported
  private var _exportFolder           : String                        as exportFolder
  private var _location               : pcf.api.Location

  //EXCEPTION MESSAGES:
  private static final var EXPORT_DIRECTORY_AS_FILE = "There was a file(not a directory) with exactly the same name as export directory, on scheme export"
  private static final var EXTENSION_WITH_DOT = ".xml"
  private static final var MESSAGE_FILENAME_INFIX = " - on "
  private static final var FILE_ALREADY_EXISTS = "File could not be saved, already exist: "
  private static final var COULD_NOT_CREATE_EXPORT_DIRECTORY = "Could not create export directory. Path:"
  
  /**
   * Initializes fields
   * @param inSchemesExported Schemes to export
   * @param inExportFolder Folder to export to
   * @param inLocation Current location
   */
  construct(inSchemesExported : Scheme_Ext[], inLocation: pcf.api.Location) {
    _schemesExported = inSchemesExported
    _location = inLocation
    _exportFolder = new File(ScriptParameters.SchemeExportDirectoryDefault).CanonicalPath
  }
  
  /**
   * Exports all the _schemesExported in to the _exportFolder if possible
   */
  public function export(): void{
    if(_exportFolder==null) throw new DisplayableException("Path is empty")
    var file = new File(_exportFolder)
    if(file.exists())
    {
      if(file.Directory){
        exportToDirectory(file)
      }
      else{
        Logger.logError(EXPORT_DIRECTORY_AS_FILE)
        throw new DisplayableException("Directory export error")
      }
    }
    else{
      if(file.mkdirs()){
        exportToDirectory(file)
      }
      else{
        Logger.logError("${COULD_NOT_CREATE_EXPORT_DIRECTORY}  ${_exportFolder}")
        throw new DisplayableException("Could not create directory")
      }
    }
  }
  
  /**
   * Exports all the _schemesExported to directory denoted by parameter
   * @param dir directory to export to
   */
  private function exportToDirectory(dir: File): void{
    var errorStringBuilder = new StringBuilder()
    for(scheme in _schemesExported){
      var filename = "${getSchemeFileName(scheme)}${EXTENSION_WITH_DOT}"
      var schemeFile = new File(dir, filename)
      if(schemeFile.exists()){
        errorStringBuilder.append(FILE_ALREADY_EXISTS).append(filename)
      }
      else{
        schemeFile.createNewFile()
        try{
          schemeFile.setWritable(true)
          SchemeExporter.exportSchemeToExistingFile(scheme, schemeFile)
        }
        catch(ex: Exception){
          schemeFile.delete()
          errorStringBuilder.append(ex.Message).append(MESSAGE_FILENAME_INFIX).append(scheme.Name)
        }
      }
    }
    if(!errorStringBuilder.isEmpty()){
      var exc=new DisplayableException(errorStringBuilder.toString())
      throw exc
    }
    else{
      _location.commit()
    }
  }
/**
 * @param scheme Scheme to generate filename for
 * @return String filename
 */
  private function getSchemeFileName(scheme: Scheme_Ext): String{
    return "${scheme.Code}_${Date.CurrentDate.Time}"
  }

}
