package acc.pc.apa.actions

uses acc.pc.apa.APAAction_Ext
uses acc.pc.apa.APARunMacro_Ext


class APAIncludeMacro_Ext extends APAAction_Ext {

  override function run(){
    setup()
    var process = new APARunMacro_Ext(MacroParameters.MacroStep.IncludeMacro, MacroParameters)
    process.run(false)
  }

  private function setup(){

  }
}