package gw.web.bizrules

uses gw.api.locale.DisplayKey
uses gw.bizrules.pcf.BizRulesPageNavigationSupport
uses gw.bizrules.pcf.CommandDefinitionUIConfig
uses gw.bizrules.pcf.ExpressionInputMode
uses gw.bizrules.pcf.RuleConditionLineHolder
uses gw.bizrules.pcf.RuleDetailsStateHolder
uses gw.bizrules.pcf.RulePageController
uses pcf.api.Location

uses java.util.Map
uses java.util.Set

@Export
class UWRuleDetailsStateHolder extends RuleDetailsStateHolder<UWRuleVersion, UWRuleHead> {
  private var _location: Location

  construct(head: UWRuleHead,
            navigationSupport: BizRulesPageNavigationSupport<UWRule, UWRuleVersion, UWRuleHead>,
            uiConfigs: Map<RuleActionKey, CommandDefinitionUIConfig>, location: Location) {
    super(head, navigationSupport, uiConfigs, location);
    _location = location
  }

  override function createRulePageController(ruleVersion: UWRuleVersion, location: Location): RulePageController {
    return new RulePageController(ruleVersion, _uiConfigs, location, SwitchableModes);
  }

  public static property get SwitchableModes(): Set<ExpressionInputMode> {
    return RuleConditionLineHolder.SWITCHABLE_LINE_EXPRESSION_MODES_SUPERSET.subtract({lastsavedvalue})
  }

  property get ExternallyManagedAlert(): String {
    return _location.InEditMode
        ? DisplayKey.get("Web.BizRules.UWRules.RuleIsNotManagedByBusinessRulesFrameworkEditAlert")
        : DisplayKey.get("Web.BizRules.UWRules.RuleIsNotManagedByBusinessRulesFrameworkAlert")
  }}
