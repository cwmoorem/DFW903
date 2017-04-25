package acc.pc.apa.actions

uses acc.pc.apa.APAAction_Ext
uses gw.job.CancellationProcess


class APAIssuePolicyCancellationImmediatly_Ext extends APAAction_Ext {

  override function run(){
    setup()
    MacroParameters.CancellationProcess.cancelImmediately()
  }

  private function setup(){

  }


}