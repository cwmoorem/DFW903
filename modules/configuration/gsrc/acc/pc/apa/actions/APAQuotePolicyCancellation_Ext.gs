package acc.pc.apa.actions

uses acc.pc.apa.APAAction_Ext
uses gw.job.CancellationProcess


class APAQuotePolicyCancellation_Ext extends APAAction_Ext {

  override function run(){
    setup()
    MacroParameters.CancellationProcess.edit()
    MacroParameters.CancellationProcess.requestQuote()
  }

  private function setup(){
  }


}