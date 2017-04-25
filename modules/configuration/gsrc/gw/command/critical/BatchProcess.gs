package gw.command.critical
uses com.guidewire.pl.quickjump.BaseCommand
uses com.guidewire.pl.quickjump.Argument
uses gw.api.web.tools.BatchProcessInfoPage
uses com.guidewire.pl.quickjump.DefaultMethod
uses com.guidewire.pl.quickjump.OpenPopup

@Export
@DefaultMethod("wCode")
class BatchProcess extends BaseCommand
{
  @OpenPopup
  @Argument("process", BatchProcessType.getTypeKeys( false )*.Code)
  function wCode() : String {
    var code = getArgumentAsString("process")
    run(BatchProcessType.get( code ))
    return "Batch process run: " + code
  }

  function wAuditTask(){
    run(BatchProcessType.TC_AUDITTASK)
  }
  
  function wWorkflow(){
    run(BatchProcessType.TC_WORKFLOW)
  }
  
  private function run(type : BatchProcessType){
    var batchProcess = new gw.api.tools.BatchProcess(type)
    new BatchProcessInfoPage().start( batchProcess )
  }
}
