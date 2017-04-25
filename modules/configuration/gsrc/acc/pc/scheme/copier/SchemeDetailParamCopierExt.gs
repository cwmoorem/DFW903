package acc.pc.scheme.copier

uses gw.api.copy.Copier


@Export
class SchemeDetailParamCopierExt extends Copier<SchemeDetailParam_Ext> {

  var _schemeDetailParam : SchemeDetailParam_Ext as readonly Source

  construct(schemeCondition : SchemeDetailParam_Ext) {
    _schemeDetailParam = schemeCondition
  }

  override function copy(target : SchemeDetailParam_Ext) {
    target.SchemeConditionParam = _schemeDetailParam.SchemeConditionParam
    target.Value = _schemeDetailParam.Value
  }

}