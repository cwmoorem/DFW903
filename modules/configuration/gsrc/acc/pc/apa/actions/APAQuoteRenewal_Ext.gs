package acc.pc.apa.actions

uses acc.pc.apa.APAAction_Ext

class APAQuoteRenewal_Ext extends APAAction_Ext {

  construct(){
    super()
  }

  override function run(){
    setup()
    MacroParameters.RenewalProcess.requestQuote()
  }


  private function setup(){

  }

}