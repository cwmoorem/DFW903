package acc.pc.apa.actions

uses acc.pc.apa.APAAction_Ext
uses gw.api.database.Query
uses gw.api.database.Relop
uses gw.job.CancellationProcess
uses gw.job.ReinstatementProcess

class APAStartPolicyReinstatement_Ext extends APAAction_Ext {

  construct(){
    super()
  }

  override function run() {
    setup()
    MacroParameters.Reinstatement = new Reinstatement()
    MacroParameters.Reinstatement.startJob(MacroParameters.PolicyPeriod)
    MacroParameters.ReinstatementProcess = new ReinstatementProcess(MacroParameters.Job.LatestPeriod)
    MacroParameters.PolicyPeriod = MacroParameters.Job.LatestPeriod
    MacroParameters.Bundle.add(MacroParameters.Job.LatestPeriod)
  }

  private function setup(){
    if(MacroParameters.PolicyPeriod == null and MacroParameters.PolicyNumber != null){
      var query = Query.make(PolicyPeriod).compare("PolicyNumber", Relop.Equals, MacroParameters.PolicyNumber).select().first()
      MacroParameters.PolicyPeriod = query.Policy.LatestBoundPeriod
    }
  }

}