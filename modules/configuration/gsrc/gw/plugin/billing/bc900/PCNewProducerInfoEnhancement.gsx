package gw.plugin.billing.bc900

uses wsi.remote.gw.webservice.bc.bc900.entity.types.complex.PCNewProducerInfo
uses gw.api.util.CurrencyUtil

enhancement PCNewProducerInfoEnhancement: PCNewProducerInfo {
    function syncNew(organization : Organization) {
      this.sync(organization)
      this.PreferredCurrency = CurrencyUtil.DefaultCurrency.Code
    }
}
