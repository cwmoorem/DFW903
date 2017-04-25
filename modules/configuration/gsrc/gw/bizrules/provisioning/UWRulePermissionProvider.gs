package gw.bizrules.provisioning

uses com.guidewire._generated.security.UWRulePermKeys
uses com.guidewire.pl.system.security.PermissionKey
uses entity.RuleVersion
uses gw.api.locale.DisplayKey
uses gw.bizrules.IRulePermissionProvider

@Export
class UWRulePermissionProvider implements IRulePermissionProvider {

  static final var INSTANCE = new UWRulePermissionProvider()

  static property get Instance(): UWRulePermissionProvider {
    return INSTANCE;
  }

  private construct() {
  }

  override property get ViewPermission(): PermissionKey {
    return UWRulePermKeys.VIEW;
  }

  override property get EditPermission(): PermissionKey {
    return UWRulePermKeys.EDIT;
  }

  override property get ImportPermission(): PermissionKey {
    return UWRulePermKeys.IMPORT;
  }

  override property get DeployPermission(): PermissionKey {
    return UWRulePermKeys.DEPLOY;
  }

  override property get ApprovePermission(): PermissionKey {
    return UWRulePermKeys.APPROVE;
  }

  override function getNoApprovePermissionMsg<V extends RuleVersion>(ruleVersion: V): String {
    return DisplayKey.get("BizRules.Permissions.InsufficientPermissionForRuleVersion", ApprovePermission, ruleVersion.Rule.Name);
  }
}