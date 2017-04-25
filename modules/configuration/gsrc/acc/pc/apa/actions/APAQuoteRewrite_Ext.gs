package acc.pc.apa.actions

uses acc.pc.apa.APAAction_Ext

class APAQuoteRewrite_Ext extends APAAction_Ext {

  construct(){
    super()
  }

  override function run(){
    setup()
    MacroParameters.RewriteProcess.requestQuote()
  }


  private function setup(){

  }

}