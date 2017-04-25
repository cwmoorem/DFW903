package gw.plugin.billing.bc800

uses gw.plugin.billing.BillingAccountSearchCriteria
uses gw.plugin.billing.BillingAccountSearchResult
uses wsi.remote.gw.webservice.bc.bc800.billingapi.types.complex.BCAccountSearchResult

@Export
@Deprecated(:value="800 inter-app integration packages will be removed in PC10.", :version="PC 9.0.0")
class BCBillingAccountSearchResult implements BillingAccountSearchResult {
  var _soapObject : BCAccountSearchResult
  var _isListBill : Boolean = null

  construct(soapObject : BCAccountSearchResult) {
    _soapObject = soapObject
  }

  override property get AccountNumber() : String {
    return _soapObject.AccountNumber
  }

  override property get AccountName() : String {
    return _soapObject.AccountName
  }

  override property get AccountNameKanji() : String {
    return _soapObject.AccountNameKanji
  }

  override property get PrimaryPayer() : String {
    return _soapObject.PrimaryPayer
  }

  override function isListBill(currency : Currency) : boolean {
    if (_isListBill == null) {
      var search = new BillingAccountSearchCriteria()
      search.AccountNumber = this.AccountNumber
      search.ListBill = true
      search.Currency = currency
      var searchResults = search.doSearch()
      _isListBill = searchResults != null and !searchResults.IsEmpty
    }
    return _isListBill
  }

  override property get Currency() : Currency {
    throw new java.lang.UnsupportedOperationException("The Currency field is not supported with BC8.")
  }
}
