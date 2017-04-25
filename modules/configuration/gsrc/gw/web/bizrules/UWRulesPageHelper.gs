package gw.web.bizrules

uses gw.api.database.IQueryBeanResult
uses gw.api.database.Query
uses gw.api.locale.DisplayKey
uses gw.bizrules.UWRulesNavigationSupport
uses gw.bizrules.management.RuleQueryFactory
uses gw.bizrules.pcf.CommandDefinitionUIConfig
uses gw.bizrules.pcf.RuleListPageHelper
uses gw.pc.bizrules.UWRulesUtil

@Export
class UWRulesPageHelper extends RuleListPageHelper<UWRule, UWRuleVersion, UWRuleHead> {
  private var _defaultFactory: RuleQueryFactory<UWRule, UWRuleVersion, UWRuleHead>
  private var _navigationSupport: UWRulesNavigationSupport as readonly NavigationSupport

  construct(navigationSupport : UWRulesNavigationSupport) {
    super(navigationSupport.VersionController)
    _navigationSupport = navigationSupport
    _defaultFactory = createAllRulesQueryFactory()
  }

  function getHead(version: UWRuleVersion): UWRuleHead {
    return UWRulesUtil.VersionController.getRuleHead(version)
  }

  static property get UIConfigs(): Map<RuleActionKey, CommandDefinitionUIConfig> {
    return {RuleActionKey.TC_ADDUWISSUE->new AddUWIssueCommandDefinitionUIConfig()}
  }

  function join(items: String[]): String {
    return items.IsEmpty ? DisplayKey.get("Web.BizRules.UWRules.All") : items.sort().join("\n")
  }

  function queryRuleVersions(criteria : UWRuleFilterCriteria) : Query<UWRuleVersion> {
    var factory = criteria.Status
    return factory?.createQuery(VersionController, null, criteria)
  }

  function queryRuleVersionsWithResults(criteria: UWRuleFilterCriteria): IQueryBeanResult<UWRuleVersion> {
    return _defaultFactory?.createQuery(VersionController, null, criteria).select()
  }

  function getValidationStatusDisplay(criteria: UWRuleFilterCriteria): String {
    var countTotal = queryRuleVersions(criteria).select().getCount()
    var countInvalid = 0
    if (criteria.Availability != TC_VALID) {
      var invalidCountCriteria = criteria.copy()
      invalidCountCriteria.Availability = TC_INVALID
      countInvalid = queryRuleVersions(invalidCountCriteria).select().getCount()
    } else if (criteria.Availability == TC_INVALID) {
      countInvalid = countTotal
    }
    return DisplayKey.get("BizRules.ValidateAll.Count", countTotal, countInvalid);
  }
}
