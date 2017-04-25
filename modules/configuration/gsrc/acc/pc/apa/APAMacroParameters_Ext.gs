package acc.pc.apa

uses gw.api.productmodel.Product
uses gw.job.CancellationProcess
uses gw.job.JobProcess
uses gw.job.PolicyChangeProcess
uses gw.job.ReinstatementProcess
uses gw.job.RenewalProcess
uses gw.job.RewriteProcess
uses gw.pl.persistence.core.Bundle

class APAMacroParameters_Ext {

  private var _transactionEffectiveDate : Date                   as TransactionEffectiveDate
  private var _expirationDate           : Date                   as ExpirationDate
  private var _productCode              : String                 as ProductCode
  private var _product                  : Product                as Product
  private var _account                  : Account                as Account
  private var _accountNumber            : String                 as AccountNumber
  private var _offer                    : ProductSelection       as Offer
  private var _producerSelection        : ProducerSelection      as ProducerSelection
  private var _quoteType                : QuoteType              as QuoteType
  private var _job                      : Job                    as Job
  private var _policyPeriod             : PolicyPeriod           as PolicyPeriod
  private var _policyNumber             : String                 as PolicyNumber
  private var _producerCode             : ProducerCode           as ProducerCode
  private var _jobProcess               : JobProcess             as JobProcess
  private var _bundle                   : Bundle                 as Bundle
  private var _cancellationSource       : CancellationSource     as CancellationSource
  private var _cancellationReasonCode   : ReasonCode             as CancellationReasonCode
  private var _cancellationDescription  : String                 as CancellationDescription
  private var _calculationMethod        : CalculationMethod      as CalculationMethod
  private var _macroStep                : APAMacroDetail_Ext     as MacroStep
  private var _policy                   : Policy                 as Policy
  private var _rewriteType              : RewriteType            as RewriteType

  private var _macroData                : List<APAMacroData_Ext> as MacroData

  construct(){
    _macroData = new ArrayList<APAMacroData_Ext>()
  }

  public function createAndAddData() : APAMacroData_Ext {
    var retVal = new APAMacroData_Ext()
    if(!_macroData.HasElements){
      _macroData = new ArrayList<APAMacroData_Ext>()
    }
    _macroData.add(retVal)
    return retVal
  }

  public function removeMacroData(inMacroData : APAMacroData_Ext){
    _macroData.remove(inMacroData)
  }

  public function extractMacroData() : APAMacroData_Ext[]{
    var retVal = new ArrayList<APAMacroData_Ext>()
    retVal.addAll(_macroData.toCollection())
    return retVal.toTypedArray()
  }

 /*
  * Process Get and Set functions, it is all stored in the jobPorocess variable but these just make it
  * just that littel bit easier
  */

  public property set CancellationProcess(inCancellationProcess : CancellationProcess) {
    _jobProcess = inCancellationProcess
  }

  public property get CancellationProcess() : CancellationProcess {
    return (_jobProcess as CancellationProcess)
  }

  public property set PolicyChangeProcess(inPolicyChangeProcess : PolicyChangeProcess){
    _jobProcess = inPolicyChangeProcess
  }

  public property get PolicyChangeProcess() : PolicyChangeProcess {
    return (_jobProcess as PolicyChangeProcess)
  }

  public property set ReinstatementProcess(inReinstatementProcess : ReinstatementProcess) {
    _jobProcess = inReinstatementProcess
  }

  public property get ReinstatementProcess() : ReinstatementProcess {
    return (_jobProcess as ReinstatementProcess)
  }

  public property set RenewalProcess(inRenewalProcess : RenewalProcess) {
    _jobProcess = inRenewalProcess
  }

  public property get RenewalProcess() : RenewalProcess {
    return (_jobProcess as RenewalProcess)
  }

  public property set RewriteProcess(inRewriteProcess : RewriteProcess) {
    _jobProcess = inRewriteProcess
  }

  public property get RewriteProcess() : RewriteProcess {
    return (_jobProcess as RewriteProcess)}

  /*
   * Job get and set functions, this is all stored in the job variable but these make it a little easier
   */

  public property set Cancellation(inCancellation : Cancellation) {
    _job = inCancellation
  }

  public property get Cancellation() : Cancellation {
    return (_job as Cancellation)
  }

  public property set PolicyChange(inPolicyChange : PolicyChange) {
    _job = inPolicyChange
  }

  public property get PolicyChange() : PolicyChange {
    return (_job as PolicyChange)
  }

  public property set Reinstatement(inReinstatement : Reinstatement) {
    _job = inReinstatement
  }

  public property get Reinstatement() : Reinstatement {
    return (_job as Reinstatement)
  }

  public property set Submission(inSubmission : Submission) {
    _job = inSubmission
  }

  public property get Submission() : Submission {
    return (_job as Submission)
  }

  public property set Renewal(inRenewal : Renewal) {
    _job = inRenewal
  }

  public property get Renewal() : Renewal {
    return (_job as Renewal)
  }

  public property set Rewrite(inRewrite : Rewrite) {
    _job = inRewrite
  }

  public property get Rewrite() : Rewrite {
    return (_job as Rewrite)
  }

}