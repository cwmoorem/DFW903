package gw.plugin.billing.bc800

uses wsi.remote.gw.webservice.bc.bc800.entity.types.complex.CommissionPlanInfo

@Deprecated(:value="800 inter-app integration packages will be removed in PC10.", :version="PC 9.0.0")
enhancement CommissionPlanSummaryEnhancement : gw.plugin.billing.CommissionPlanSummary {
  function sync(plan : CommissionPlanInfo) {
    this.syncCurrency(plan)
    this.AllowedTiers = new Tier[plan.AllowedTiers.Count]
    for (tier in plan.AllowedTiers index i) {
      this.AllowedTiers[i] = typekey.Tier.get(tier)
    }
  }
}
