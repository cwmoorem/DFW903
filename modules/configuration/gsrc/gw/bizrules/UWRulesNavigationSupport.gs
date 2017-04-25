package gw.bizrules

uses gw.api.util.DisplayableException
uses gw.bizrules.pcf.DefaultBizRulesPageNavigationSupport
uses gw.bizrules.pcf.RuleExportImportPageHelper
uses gw.pc.bizrules.UWRulesUtil
uses gw.pc.bizrules.UWRulesVersionController
uses pcf.CreateUWRule
uses pcf.UWRuleComparisonPopup
uses pcf.UWRuleExportImportStatus
uses pcf.UWRulePopup
uses pcf.UWRules

@Export
class UWRulesNavigationSupport extends DefaultBizRulesPageNavigationSupport<UWRule, UWRuleVersion, UWRuleHead> {

  static final var _instance = new UWRulesNavigationSupport()

  private construct() {
  }

  static property get Instance(): UWRulesNavigationSupport {
    return _instance
  }

  override property get VersionController(): UWRulesVersionController {
    return UWRulesUtil.VersionController
  }

  override function pushRuleVersionDetailsPopup(version: UWRuleVersion, importing: boolean) {
    UWRulePopup.push(version, importing)
  }

  override function pushRuleComparisonPopup(
      importEntry : RuleImportTaskEntry, importHelper : RuleExportImportPageHelper) {
    if (importEntry.ImportedVersion typeis UWRuleVersion) {
      UWRuleComparisonPopup.push(importEntry, importHelper as RuleExportImportPageHelper<UWRuleVersion>);
    } else {
      throw new DisplayableException(String.format(
          "Version comparison for imported rule type: %s is not supported",
          {importEntry.ImportedVersion.IntrinsicType.Name}));
    }
  }

  override function goToCreateRulePage() {
    CreateUWRule.push()
  }

  override function goToCloneRulePage(ruleToClone: UWRule) {
    CreateUWRule.push(ruleToClone)
  }

  override function goToRulesListPage() {
    UWRules.go()
  }

  override function goToExportImportStatusPage() {
    UWRuleExportImportStatus.go()
  }
}