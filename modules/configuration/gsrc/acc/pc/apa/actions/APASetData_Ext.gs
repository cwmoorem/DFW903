package acc.pc.apa.actions

uses acc.pc.apa.APAAction_Ext
uses acc.pc.apa.APAMacroData_Ext
uses acc.pc.bl.BLEntityUtility_Ext
uses acc.pc.bl.inputs.BLValueInput_Ext
uses acc.pc.bl.inputs.BLValueType_Ext

class APASetData_Ext extends APAAction_Ext {

  override function run(){
    for(dataElement in MacroParameters.MacroData){
      var _blEntityUtility_Ext = new BLEntityUtility_Ext()
      setup(dataElement, _blEntityUtility_Ext)
      _blEntityUtility_Ext.executeCommand<PolicyPeriod>(MacroParameters.PolicyPeriod)
    }
  }

  private function setup(inDataElement : APAMacroData_Ext, inBLEntityUtility_Ext : BLEntityUtility_Ext){
    inBLEntityUtility_Ext.BLEntity = inDataElement.BLEntity
    inBLEntityUtility_Ext.BLCommand = inDataElement.BLCommand
    inBLEntityUtility_Ext.AttributeName = inDataElement.BLAttribute
    var inBLValue = new BLValueInput_Ext()
    inBLValue.StringValue = inDataElement.BLStringValue
    inBLValue.ValueType = BLValueType_Ext.String
    inBLEntityUtility_Ext.buildCommand(inBLValue)
  }
}