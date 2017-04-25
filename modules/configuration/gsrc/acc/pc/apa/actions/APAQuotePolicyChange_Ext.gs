package acc.pc.apa.actions

uses acc.pc.apa.APAAction_Ext
uses gw.job.PolicyChangeProcess

class APAQuotePolicyChange_Ext extends APAAction_Ext {

  construct(){
    super()
  }

  override function run(){
    setup()
    MacroParameters.PolicyChangeProcess.requestQuote()
  }


  private function setup(){

  }

}