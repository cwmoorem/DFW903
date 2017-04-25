package acc.pc.apa.actions

uses acc.pc.apa.APAAction_Ext
uses gw.job.PolicyChangeProcess


class APAIssuePolicyChange_Ext extends APAAction_Ext {

  override function run(){
    setup()
    MacroParameters.PolicyChangeProcess.issueJob(true)
  }

  private function setup(){

  }


}