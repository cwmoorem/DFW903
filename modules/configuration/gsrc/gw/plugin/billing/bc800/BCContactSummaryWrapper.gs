package gw.plugin.billing.bc800

uses gw.plugin.billing.BillingContactInfo
uses wsi.remote.gw.webservice.bc.bc800.billingsummaryapi.anonymous.elements.BCPCAccountBillingSummary_PrimaryPayer

@Export
@Deprecated(:value="800 inter-app integration packages will be removed in PC10.", :version="PC 9.0.0")
class BCContactSummaryWrapper implements BillingContactInfo{
  
  var _soapObject : BCPCAccountBillingSummary_PrimaryPayer
  construct(summary : BCPCAccountBillingSummary_PrimaryPayer) {
    _soapObject = summary
  }

  override property get Name() : String {
    return _soapObject.Name
  }

  override property get Address() : String {
    return _soapObject.Address
  }

  override property get Phone() : String {
    return _soapObject.Phone
  }

}
