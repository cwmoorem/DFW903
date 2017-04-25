package acc.pc.scheme.copier

uses gw.api.copy.Copier


@Export
class SchemeCopier extends Copier<Scheme_Ext> {

  var _scheme : Scheme_Ext as readonly Source

  construct(scheme : Scheme_Ext) {
    _scheme = scheme
  }
  
  override function copy(target : Scheme_Ext) {
    target.Code = _scheme.Code
    target.Name = _scheme.Name
    target.EndDate = _scheme.EndDate
    target.ProductCode = _scheme.ProductCode
    target.RenewalAvailable = _scheme.RenewalAvailable
    target.StartDate = _scheme.StartDate
    target.Description = _scheme.Description
    for(detail in _scheme.Details) {
      var newDetail = new SchemeDetail_Ext()
      new SchemeDetailCopier (detail).copy(newDetail)
      target.addToDetails(newDetail)
    }
  }

}