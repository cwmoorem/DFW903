package gw.plugin.billing.bc800
uses wsi.remote.gw.webservice.bc.bc800.billingapi.types.complex.PCUnappliedInfo
uses gw.plugin.billing.BillingUnappliedFundInfo

@Export
@Deprecated(:value="800 inter-app integration packages will be removed in PC10.", :version="PC 9.0.0")
class BCUnappliedFundWrapper implements BillingUnappliedFundInfo {
  var _soapObject : PCUnappliedInfo

  construct(soapObject: PCUnappliedInfo) {
    _soapObject = soapObject
  }

  override property get Description() : String {
    return _soapObject.Description
  }

  override property get PublicID() : String {
    return _soapObject.PublicID
  }
}