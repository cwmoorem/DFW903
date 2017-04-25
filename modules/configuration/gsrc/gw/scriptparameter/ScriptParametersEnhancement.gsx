package gw.scriptparameter

enhancement ScriptParametersEnhancement: ScriptParameters {

  public static property get EnableDisplayBasicSearchTab(): Boolean {
    return ScriptParameters.getParameterValue("EnableDisplayBasicSearchTab") as Boolean;
  }

  public static property get OnlyVirtualProducts(): Boolean {
    return ScriptParameters.getParameterValue("OnlyVirtualProducts") as Boolean;
  }

  public static property get SchemeExportDirectoryDefault() : String {
    return ScriptParameters.getParameterValue("SchemeExportDirectoryDefault") as String
  }

  public static property get SchemeImportDirectoryDefault() : String {
    return ScriptParameters.getParameterValue("SchemeImportDirectoryDefault") as String
  }

}
