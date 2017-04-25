package gw.plugin.billing.bc800

uses wsi.remote.gw.webservice.bc.bc800.entity.types.complex.PCNewProducerInfo
uses gw.api.util.CurrencyUtil

@Deprecated(:value="800 inter-app integration packages will be removed in PC10.", :version="PC 9.0.0")
enhancement PCNewProducerInfoEnhancement: PCNewProducerInfo {
    function syncNew(organization : Organization) {
      this.sync(organization)
      this.PreferredCurrency = CurrencyUtil.DefaultCurrency.Code
    }
}
