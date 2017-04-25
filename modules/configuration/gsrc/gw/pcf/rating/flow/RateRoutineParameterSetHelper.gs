package gw.pcf.rating.flow

uses gw.pcf.rating.ParameterSetHelper
uses java.util.List

@Export
class RateRoutineParameterSetHelper extends ParameterSetHelper implements IRateRoutineParameterSetHelper {

  var _rateRoutine : CalcRoutineDefinition

  private construct() {}

  construct(rateRoutine : CalcRoutineDefinition) {
    _rateRoutine = rateRoutine
  }
  
  function getParamSets() : List<CalcRoutineParameterSet> {
    return getParamSets(_rateRoutine.PolicyLinePatternCode)
  }

  function getHelpStringForParamTypes() : String {
    return getHelpStringForParamTypes(_rateRoutine.ParameterSet)
  }

  override function getStringForParamTypes() : String {
    return getStringForParamTypes(_rateRoutine.ParameterSet)
  }

}
