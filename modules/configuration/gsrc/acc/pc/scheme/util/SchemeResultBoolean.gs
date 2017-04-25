package acc.pc.scheme.util

class SchemeResultBoolean {

  private var _schemeResult : Boolean as SchemeResult
  private var _actualResult : Boolean as ActualResult

  construct(inSchemeResult : Boolean, inActualResult : Boolean){
    if(inSchemeResult != null){
      _schemeResult = inSchemeResult
    } else {
      _actualResult = inActualResult
    }
  }

}