package acc.pc.apa.actions

uses acc.pc.apa.APAAction_Ext
uses gw.api.database.Query
uses gw.api.database.Relop
uses gw.job.PolicyChangeProcess

class APAStartPolicyChange_Ext extends APAAction_Ext {

  construct(){
    super()
  }

  override function run(){
    setup()
    var period = getUpdatedPolicyPeriod(MacroParameters.PolicyPeriod)
    MacroParameters.PolicyChange = new PolicyChange()
    var inForcePeriod = getInForcePeriodWithBasedOn(period, MacroParameters.TransactionEffectiveDate) ?: period
    var inForceEffectiveDate = applyEffectiveTimePluginForPolicyChange(inForcePeriod, (MacroParameters.Job as PolicyChange), MacroParameters.TransactionEffectiveDate)
    MacroParameters.PolicyChange.startJob(period.Policy, inForceEffectiveDate)
    MacroParameters.Bundle = gw.transaction.Transaction.Current
    MacroParameters.PolicyChangeProcess = new PolicyChangeProcess(MacroParameters.Job.LatestPeriod)
    MacroParameters.PolicyPeriod = MacroParameters.Job.LatestPeriod
    MacroParameters.Bundle.add(MacroParameters.Job.LatestPeriod)
  }

  private function getInForcePeriodWithBasedOn(policyPeriod : PolicyPeriod, effectiveDate : Date) : PolicyPeriod {
    return (effectiveDate != null) ? Policy.finder.findPolicyPeriodByPolicyAndAsOfDate(policyPeriod.Policy, effectiveDate) : null
  }

  private function applyEffectiveTimePluginForPolicyChange( policyPeriod : entity.PolicyPeriod, job : entity.PolicyChange, effDate : Date ) : Date {
    var effDateTime = gw.api.job.EffectiveDateCalculator.instance().getPolicyChangeEffectiveDate(effDate, policyPeriod, job)
    if (effDateTime < policyPeriod.PeriodStart) {
      effDateTime = policyPeriod.PeriodStart
    } else if (effDateTime >= policyPeriod.PeriodEnd) {
      effDateTime = policyPeriod.PeriodEnd.addMinutes(-1)
    }
    return effDateTime
  }

  private function getUpdatedPolicyPeriod(policyPeriod : PolicyPeriod) : PolicyPeriod {
    var q = gw.api.database.Query.make(entity.PolicyPeriod)
    q.compare("Policy", Equals, policyPeriod.Policy.ID)
    var result = q.select()
    return result.FirstResult
  }

  private function setup(){
    if(MacroParameters.PolicyPeriod == null and MacroParameters.PolicyNumber != null){
      var query = Query.make(PolicyPeriod).compare("PolicyNumber", Relop.Equals, MacroParameters.PolicyNumber).select().first()
      MacroParameters.PolicyPeriod = query.Policy.LatestBoundPeriod
    }
  }

}