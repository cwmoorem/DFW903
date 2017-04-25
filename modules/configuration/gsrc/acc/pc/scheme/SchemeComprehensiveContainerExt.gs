package acc.pc.scheme

uses java.io.File

class SchemeComprehensiveContainerExt {

  var _scheme : Scheme_Ext
  construct(inScheme: Scheme_Ext) {
    _scheme=inScheme
  }
  property get Scheme() : Scheme_Ext{
    return _scheme
  }
  /**
   * Saves object to xml file
   * @param file File to save xml to
   */
  public function saveToXmlFile(file: File): void{
    var xmlModel = new acc.pc.scheme.model.schemecomprehensivecontainerextmodel.SchemeComprehensiveContainerExt(this)
    file.writeBytes(xmlModel.bytes())
  }
  /**
   * Returns xml string desciribing this object
   * @return String containing xml data
   */
  public function convertToXml(): String{
    var xmlModel = new acc.pc.scheme.model.schemecomprehensivecontainerextmodel.SchemeComprehensiveContainerExt(this)
    return xmlModel.asUTFString()
  }
  
}
