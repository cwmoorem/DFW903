package acc.pc.apa.actions

uses acc.pc.apa.APAAction_Ext
uses gw.api.database.Query
uses gw.api.database.Relop
uses gw.job.ReinstatementProcess
uses gw.job.RenewalProcess

/**
 * Created by cwmoorem on 07/02/2017.
 */
class APAStartRenewal_Ext extends APAAction_Ext {

  construct(){
    super()
  }

  override function run() {
    setup()
    MacroParameters.Renewal = new Renewal()
    MacroParameters.Renewal.startJob(MacroParameters.Policy)
    MacroParameters.RenewalProcess = new RenewalProcess(MacroParameters.Renewal.LatestPeriod)
    MacroParameters.PolicyPeriod = MacroParameters.Job.LatestPeriod
    MacroParameters.Bundle.add(MacroParameters.Job.LatestPeriod)
  }

  private function setup(){
    if(MacroParameters.PolicyPeriod == null and MacroParameters.PolicyNumber != null){
      var query = Query.make(PolicyPeriod).compare("PolicyNumber", Relop.Equals, MacroParameters.PolicyNumber).select().first()
      MacroParameters.PolicyPeriod = query.Policy.LatestBoundPeriod
    }
    MacroParameters.Policy = MacroParameters.PolicyPeriod.Policy
  }

}