package acc.pc.apa

uses acc.pc.apa.actions.*

class APAFactory_Ext {

  construct(){

  }

  public function createAction(inActionType : APAActionType_Ext) : APAAction_Ext {
    var retVal : APAAction_Ext
    switch (inActionType){
      case APAActionType_Ext.TC_STARTSUBMISSION:
        retVal = new APAStartSubmission_Ext()
        break
      case APAActionType_Ext.TC_STARTPOLICYREINSTATEMENT:
        retVal = new APAStartPolicyReinstatement_Ext()
        break
      case APAActionType_Ext.TC_STARTPOLICYCHANGE:
        retVal = new APAStartPolicyChange_Ext()
        break
      case APAActionType_Ext.TC_STARTRENEWAL:
        retVal = new APAStartRenewal_Ext()
        break
      case APAActionType_Ext.TC_STARTREWRITE:
        retVal = new APAStartRewrite_Ext()
        break
      case APAActionType_Ext.TC_QUOTEPOLICYCHANGE:
        retVal = new APAQuotePolicyChange_Ext()
        break
      case APAActionType_Ext.TC_QUOTERENEWAL:
        retVal = new APAQuoteRenewal_Ext()
        break
      case APAActionType_Ext.TC_QUOTEREWRITE:
        retVal = new APAQuoteRewrite_Ext()
        break
      case APAActionType_Ext.TC_STARTPOLICYCANCELLATION:
        retVal = new APAStartPolicyCancellation_Ext()
        break
      case APAActionType_Ext.TC_QUOTEPOLICYCANCELLATION:
        retVal = new APAQuotePolicyCancellation_Ext()
        break
      case APAActionType_Ext.TC_QUOTEPOLICYREINSTATEMENT:
        retVal = new APAQuotePolicyReinstatement_Ext()
        break
      case APAActionType_Ext.TC_QUOTEPOLICYCHANGE:
        retVal = new APAQuotePolicyChange_Ext()
        break
      case APAActionType_Ext.TC_ISSUEPOLICYCANCELLATIONIMMEDIATLY:
        retVal = new APAIssuePolicyCancellationImmediatly_Ext()
        break
      case APAActionType_Ext.TC_ISSUEPOLICYREINSTATEMENT:
        retVal = new APAIssuePolicyReinstatement_Ext()
        break
      case APAActionType_Ext.TC_ISSUEREWRITE:
        retVal = new APAIssueRewrite_Ext()
        break
      case APAActionType_Ext.TC_SETDATA:
        retVal = new APASetData_Ext()
        break
      case APAActionType_Ext.TC_INCLUDEMACRO:
        retVal = new APAIncludeMacro_Ext()
        break
    }
    return retVal
  }

}