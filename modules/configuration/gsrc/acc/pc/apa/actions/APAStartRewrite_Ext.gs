package acc.pc.apa.actions

uses acc.pc.apa.APAAction_Ext
uses gw.api.database.Query
uses gw.api.database.Relop
uses gw.job.RewriteProcess


class APAStartRewrite_Ext extends APAAction_Ext {

  construct(){
    super()
  }

  override function run() {
    setup()
    MacroParameters.ExpirationDate = computeTermEnd(MacroParameters.RewriteType, MacroParameters.PolicyPeriod)
    MacroParameters.Rewrite = new Rewrite() {:RewriteType = MacroParameters.RewriteType}
    MacroParameters.Rewrite.startJob(MacroParameters.Policy, MacroParameters.TransactionEffectiveDate, MacroParameters.ExpirationDate)
    MacroParameters.RewriteProcess = new RewriteProcess(MacroParameters.Rewrite.LatestPeriod)
    MacroParameters.PolicyPeriod = MacroParameters.Job.LatestPeriod
    MacroParameters.Bundle.add(MacroParameters.Job.LatestPeriod)
  }

  private function computeTermEnd(rewriteType: typekey.RewriteType, inForcePeriod : PolicyPeriod): Date {
    if (rewriteType == TC_REWRITENEWTERM) {
      var plugin = gw.plugin.Plugins.get(gw.plugin.policyperiod.IPolicyTermPlugin)
      return plugin.calculatePeriodEnd(inForcePeriod.CancellationDate, inForcePeriod.Policy.Product.DefaultTermType, inForcePeriod)
    } else {
      return inForcePeriod.PeriodEnd
    }
  }

  private function setup(){
    if(MacroParameters.PolicyPeriod == null and MacroParameters.PolicyNumber != null){
      var query = Query.make(PolicyPeriod).compare("PolicyNumber", Relop.Equals, MacroParameters.PolicyNumber).select().first()
      MacroParameters.PolicyPeriod = query.Policy.LatestBoundPeriod
    }
    MacroParameters.Policy = MacroParameters.PolicyPeriod.Policy
    if(MacroParameters.RewriteType == null){
      MacroParameters.RewriteType = RewriteType.TC_REWRITEFULLTERM
      MacroParameters.TransactionEffectiveDate = MacroParameters.PolicyPeriod.getPolicyStartDate()
    }
  }


}