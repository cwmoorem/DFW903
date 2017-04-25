package acc.pc.scheme

uses java.io.File
uses java.io.IOException
uses java.io.InvalidObjectException

class SchemeExporter {

  construct() {

  }
  //EXCPTION MESSAGES
  private final static var FILE_INVALID = "File is not valid, doesn't exist, is a directory or read-only"
  private final static var SCHEME_IN_DRAFT_MODE = "Scheme is in draft mode"
  /**
   * Exports scheme to an existing file
   * @param inScheme Scheme to export
   * @param file File to export to
   */
  public static function exportSchemeToExistingFile(inScheme : Scheme_Ext, file: File) : void{
    if(!file.exists() && file.Directory && !file.canWrite() ){
      throw new IOException(FILE_INVALID)
    }
    if(inScheme.GeneralStatus== GeneralStatusType_Ext.TC_DRAFT){
      throw new InvalidObjectException(SCHEME_IN_DRAFT_MODE)
    }
    else{
      var export = new SchemeComprehensiveContainerExt(inScheme)
      export.saveToXmlFile(file)
    }
  }
  
}
