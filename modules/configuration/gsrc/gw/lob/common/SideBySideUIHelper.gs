package gw.lob.common

uses gw.api.locale.DisplayKey
uses gw.api.profiler.PCProfilerTag
uses gw.api.web.job.JobWizardHelper
uses pcf.api.Wizard

@Export
class SideBySideUIHelper {

  var _policyPeriod : PolicyPeriod
  var _wizard : Wizard
  var _jobWizardHelper : JobWizardHelper

  construct(period : PolicyPeriod, wiz : Wizard, jobWizHelper : JobWizardHelper) {
    _policyPeriod = period
    _wizard = wiz
    _jobWizardHelper = jobWizHelper
  }

  function attemptSideBySide(numPeriods : int) {
    PCProfilerTag.SIDE_BY_SIDE.execute(\ f -> {
      var job = _policyPeriod.Job
      if (job.ActivePeriods.hasMatch(\p -> p.hasAnyUnhandledPreemptions())) {
        throw new gw.api.util.DisplayableException(DisplayKey.get("Web.Job.SideBySide.Errors.ResolveUnhandledPreemption"))
      } else if (job.OOSJob and job.ActivePeriods.hasMatch(\ p -> p.OOSConflicts.HasElements)) {
        throw new gw.api.util.DisplayableException(DisplayKey.get("Web.Job.SideBySide.Errors.ResolveUnhandledOOSConflicts"))
      } else {
        _wizard.saveDraft()
        if (_jobWizardHelper.revalidateModel()) {
          var initValidationCtxt =
            gw.lob.common.SideBySideUtil.validatePeriodForSideBySide(_policyPeriod, _policyPeriod.ValidationLevel)
          _policyPeriod.JobProcess.JobProcessValidator.LastResult = initValidationCtxt.Result
          if (initValidationCtxt.Result.hasErrors()) {
            gw.api.util.PCWebMessageUtil.addIssuesToTopLocation(initValidationCtxt.Result.Errors as List<gw.api.validation.ValidationIssue>)
            return
          }

          // No errors, clear last result and messages
          gw.api.web.workspace.WorkspaceUtil.closeActiveWorksheet()
          _policyPeriod.JobProcess.JobProcessValidator.LastResult = null
          _wizard.saveDraft()

          _jobWizardHelper.invalidateIterators()
          gw.lob.common.SideBySideUtil.maybeCreateSideBySidePeriods(_policyPeriod, numPeriods, true)
          _jobWizardHelper.refreshBundle()

          _wizard.saveDraft()
          _jobWizardHelper.goToStep("SideBySide")
        }
      }
    })
  }

  function canAttemptSideBySide() : boolean {
    var job = _policyPeriod.Job
    if (null==job) {
      return false
    }

    if (not _policyPeriod.AvailableForSideBySideEdit) {
      return false
    }

    // Use out of the box PersonalAutoSideBySideBaseDataConfig to make sure current policy is supported before showing Side-by-Side button
    var PASxSConfig = new gw.job.sxs.PersonalAutoSideBySideBaseDataConfig()
    if (not PASxSConfig.supportsPolicies({_policyPeriod})) {
      return false
    }

    var status = _policyPeriod.Status
    return !job.SideBySide and !job.hasMultiplePeriods() and (status == TC_DRAFT or status == TC_QUOTING or status == TC_QUOTED)
  }

  function getVersionLabel() : String {
    var job = _policyPeriod.Job
    if (job.hasMultiplePeriods()){
     if (job.SideBySide) {
       return DisplayKey.get("Web.Job.SideBySide.AddSideBySide")
     } else {
       return  DisplayKey.get("Web.MultiQuoteWizardToolbar.AddNewVersion")
     }
    } else {
      return DisplayKey.get("Web.MultiQuoteWizardToolbar.NewVersion")
    }
  }
}
