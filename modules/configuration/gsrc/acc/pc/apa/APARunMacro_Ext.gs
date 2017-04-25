package acc.pc.apa

uses typekey.*
uses typekey.APAMacroInput_Ext

class APARunMacro_Ext {

  private var _macroParameters : APAMacroParameters_Ext  as MacroParameters
  private var _apaMacro        : APAMacro_Ext
  private var _apaFactory      : APAFactory_Ext

  construct(inAPAMacro : APAMacro_Ext, inMacroParameters : APAMacroParameters_Ext){
    init(inAPAMacro, inMacroParameters)
  }

  private function init(inAPAMacro : APAMacro_Ext, inMacroParameters : APAMacroParameters_Ext){
    _macroParameters = inMacroParameters
    _apaMacro = inAPAMacro
    _apaFactory = new APAFactory_Ext()
  }

  public function run(){
    process(true)
  }

  public function run(newBundle : boolean){
    process(newBundle)
  }

  private function process(newBundle : boolean){
    if(newBundle == true){
      gw.transaction.Transaction.runWithNewBundle(\bundle -> {
        MacroParameters.Bundle = bundle
        try {
          processMacro()
        } catch (exception : APAException_Ext){
          print (exception.Message)
        }
      })
    } else {
      MacroParameters.Bundle = gw.transaction.Transaction.Current
      try {
        processMacro()
      } catch (exception : APAException_Ext){
        print (exception.Message)
      }
    }
  }

  private function processMacro(){
    try {
      checkAllParameters()
      for (macroStep in _apaMacro.APAMacroDetails.sortBy(\elt -> elt.DetailOrder)) {
        var macroAction = _apaFactory.createAction(macroStep.getAPAActionType())
        macroAction.MacroParameters = _macroParameters
        _macroParameters.MacroStep = macroStep
        macroAction.run()
      }
    } catch (exception: APAException_Ext) {
      throw exception
    }
  }

  public function checkAllParameters() {
    var retVal = new ArrayList<String>()
    for(parameter in typekey.APAMacroInput_Ext.AllTypeKeys){
      if(_apaMacro.APAMacroInputs.hasMatch(\elt -> elt.APAMacroInput == parameter and elt.RequiredInput == true)) {
        switch (parameter){
          case APAMacroInput_Ext.TC_PRODUCT:
            if(_macroParameters.Product == null) {
              retVal.add("Missing Product Parameter")
            }
            break;
          case APAMacroInput_Ext.TC_PRODUCTCODE:
            if(_macroParameters.ProductCode == null) {
              retVal.add("Missing Product Code Parameter")
            }
            break;
          case APAMacroInput_Ext.TC_ACCOUNT:
            if(_macroParameters.Account == null) {
              retVal.add("Missing Account Parameter")
            }
            break;
          case APAMacroInput_Ext.TC_ACCOUNTNUMBER:
            if(_macroParameters.AccountNumber == null) {
              retVal.add("Missing Account Number Parameter")
            }
            break;
          case APAMacroInput_Ext.TC_TRANSACTIONDATE:
            if(_macroParameters.TransactionEffectiveDate == null) {
              retVal.add("Missing Transaction Effective Date Parameter")
            }
            break;
          case APAMacroInput_Ext.TC_POLICYNUMBER:
            if(_macroParameters.PolicyNumber == null) {
              retVal.add("Missing Policy Number Parameter")
            }
            break;
          case APAMacroInput_Ext.TC_POLICYPERIOD:
            if(_macroParameters.PolicyPeriod == null) {
              retVal.add("Missing Policy Period Parameter")
            }
            break;
          case APAMacroInput_Ext.TC_PRODUCERCODE:
            if(_macroParameters.ProducerCode == null) {
              retVal.add("Missing Transaction Effective Date Parameter")
            }
            break;
          case APAMacroInput_Ext.TC_QUOTETYPE:
            if(_macroParameters.QuoteType == null) {
              retVal.add("Missing Quote Type Parameter")
            }
            break;
          case APAMacroInput_Ext.TC_CANCELLATIONCALCULATIONMETHOD:
            if(_macroParameters.CalculationMethod == null) {
              retVal.add("Missing Cancellation Calculation Method Parameter")
            }
            break;
          case APAMacroInput_Ext.TC_CANCELLATIONDESCRIPTION:
            if(_macroParameters.CancellationDescription == null) {
              retVal.add("Missing Cancellation Description Parameter")
            }
            break;
          case APAMacroInput_Ext.TC_CANCELLATIONREASONCODE:
            if(_macroParameters.CancellationReasonCode == null) {
              retVal.add("Missing Cancellation Reason Code Parameter")
            }
            break;
          case APAMacroInput_Ext.TC_CANCELLATIONSOURCE:
            if(_macroParameters.CancellationSource == null) {
              retVal.add("Missing Cancellation Source Code Parameter")
            }
            break;
        }
      }
    }
    if(retVal.HasElements){
      throw new APAException_Ext(retVal.toTypedArray().join("\n"))
    }
  }

}