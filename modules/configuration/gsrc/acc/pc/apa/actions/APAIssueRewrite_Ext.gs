package acc.pc.apa.actions

uses acc.pc.apa.APAAction_Ext


class APAIssueRewrite_Ext extends APAAction_Ext {

  override function run(){
    setup()
    MacroParameters.RewriteProcess.issueJob(true)
  }

  private function setup(){

  }


}