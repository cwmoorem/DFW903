package acc.pc.apa.actions

uses acc.pc.apa.APAAction_Ext
uses gw.job.CancellationProcess
uses gw.job.ReinstatementProcess


class APAIssuePolicyReinstatement_Ext extends APAAction_Ext {

  override function run(){
    setup()
    MacroParameters.ReinstatementProcess.issueJob(true)
  }

  private function setup(){

  }


}