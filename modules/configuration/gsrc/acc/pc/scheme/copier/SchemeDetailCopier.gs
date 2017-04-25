package acc.pc.scheme.copier

uses gw.api.copy.Copier


@Export
class SchemeDetailCopier extends Copier<SchemeDetail_Ext> {

  var _schemeDetail : SchemeDetail_Ext as readonly Source

  construct(schemeDetail : SchemeDetail_Ext) {
    _schemeDetail = schemeDetail
  }
  
  override function copy(target : SchemeDetail_Ext) {
    target.SchemeSourceType = _schemeDetail.SchemeSourceType
    target.Comparator = _schemeDetail.Comparator
    target.ParentCode = _schemeDetail.ParentCode
    target.SchemeActionType = _schemeDetail.SchemeActionType
    target.SchemeSourceType = _schemeDetail.SchemeSourceType
    target.SchemeValueType = _schemeDetail.SchemeValueType
    target.Value = _schemeDetail.Value
    target.SchemeValidationType = _schemeDetail.SchemeValidationType
    target.Condition = _schemeDetail.Condition
    target.SchemeCondition = _schemeDetail.SchemeCondition
    for(schemeDetailParam in _schemeDetail.SchemeDetailParams) {
      var param = new SchemeDetailParam_Ext()
      new SchemeDetailParamCopierExt(schemeDetailParam).copy(param)
      target.addToSchemeDetailParams(param)
    }
  }

}