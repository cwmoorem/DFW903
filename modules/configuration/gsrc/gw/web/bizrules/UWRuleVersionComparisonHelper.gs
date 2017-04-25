package gw.web.bizrules

uses gw.api.locale.DisplayKey
uses gw.bizrules.pcf.RuleComparisonRow
uses gw.bizrules.pcf.RuleVersionComparisonController
uses gw.entity.TypeKey
uses pcf.api.Location
uses typekey.*

@Export
class UWRuleVersionComparisonHelper extends RuleVersionComparisonController<UWRuleVersion> {

  final var _nameRow : RuleComparisonRow<String> as readonly NameRow
  final var _codeRow: RuleComparisonRow<String> as readonly CodeRow
  final var _checkingSetRow: RuleComparisonRow<TypeKey> as readonly CheckingSetRow
  final var _blockingPointRow: RuleComparisonRow<TypeKey> as readonly BlockingPointRow
  final var _defaultDurationRow: RuleComparisonRow<TypeKey> as readonly DefaultDurationRow
  final var _contextRow: RuleComparisonRow<TypeKey> as readonly ContextRow
  final var _descriptionRow: RuleComparisonRow<String> as readonly DescriptionRow
  final var _availableToRunRow: RuleComparisonRow<Boolean> as readonly AvailableToRunRow

  final var _jurisdictionRow: RuleComparisonRow<String[]> as readonly JurisdictionRow
  final var _policyLineRow: RuleComparisonRow<String[]> as readonly PolicyLineRow
  final var _policyTransactionRow: RuleComparisonRow<String[]> as readonly PolicyTransactionRow
  final var _startDateRow: RuleComparisonRow<Date> as readonly StartDateRow
  final var _endDateRow: RuleComparisonRow<Date> as readonly EndDateRow

  final var _autoApprovableRow: RuleComparisonRow<Boolean> as readonly AutoApprovableRow
  final var _defaultEditBeforeBindRow: RuleComparisonRow<Boolean> as readonly DefaultEditBeforeBindRow
  final var _defaultApprovalBlockingPointRow: RuleComparisonRow<TypeKey> as readonly DefaultApprovalBlockingPointRow
  final var _comparatorRow: RuleComparisonRow<TypeKey> as readonly ComparatorRow
  final var _valueFormatterTypeRow: RuleComparisonRow<TypeKey> as readonly ValueFormatterTypeRow
  final var _defaultValueAssignmentTypeRow: RuleComparisonRow<TypeKey> as readonly DefaultValueAssignmentTypeRow
  final var _defaultValueOffsetAmountRow: RuleComparisonRow<String> as readonly DefaultValueOffsetAmountRow
  final var _defaultValueOffsetCurrencyRow: RuleComparisonRow<TypeKey> as readonly DefaultValueOffsetCurrencyRow

  construct(left: UWRuleVersion, right: UWRuleVersion, location: Location) {
    super(left, right, 1/* total number of columns used to display each Rule */, {} /*UWRulePanelSetHelper.UIConfigs*/, location)

    _nameRow = createRow(DisplayKey.get("BizRules.RuleDetailsPage.Name"), \v -> v.Rule.Name)
    _codeRow = createRow(DisplayKey.get("Web.BizRules.UWRulePanelSet.Code"), \v -> v.Rule.UWIssueType.Code)
    _blockingPointRow = createRow(DisplayKey.get("Web.BizRules.UWRulePanelSet.BlockingPoint"), \v -> v.Rule.UWIssueType.BlockingPoint)
    _checkingSetRow = createRow(DisplayKey.get("Web.BizRules.UWRules.CheckingSet"), \v -> v.Rule.TriggeringPointKey)
    _defaultDurationRow = createRow(DisplayKey.get("Web.BizRules.UWRulePanelSet.DefaultDurationType"), \v -> v.Rule.UWIssueType.DefaultDurationType)
    _contextRow = createRow(DisplayKey.get("BizRules.RuleDetailsPage.Context"), \v -> v.Rule.RuleContextDefinitionKey)
    _descriptionRow = createRow(DisplayKey.get("BizRules.RuleDetailsPage.Description"), \v -> v.Rule.Description)
    _availableToRunRow = createRow(DisplayKey.get("BizRules.RuleDetailsPage.AvailableToRun"), \v -> v.Rule.AvailableToRun)
    _startDateRow = createRow(DisplayKey.get("Web.BizRules.UWRules.ApplicabilityCriteria.RuleStartDate"), \v -> v.Rule.StartDate)
    _endDateRow = createRow(DisplayKey.get("Web.BizRules.UWRules.ApplicabilityCriteria.RuleEndDate"), \v -> v.Rule.EndDate)

    var jurisdictions = RuleVersions*.Rule.map(\r -> r.Jurisdictions*.Jurisdiction).toList()
    _jurisdictionRow = createRow(DisplayKey.get("Web.BizRules.UWRules.ApplicabilityCriteria.Jurisdictions"), \v -> getJurisdictions(v.Rule.Jurisdictions), arrayValuesDiffer(jurisdictions))

    var policyLines = RuleVersions*.Rule.map(\r -> r.LinesOfBusiness*.PolicyLine).toList()
    _policyLineRow = createRow(DisplayKey.get("Web.BizRules.UWRules.ApplicabilityCriteria.PolicyLine"), \v -> getPolicyLines(v.Rule.LinesOfBusiness), arrayValuesDiffer(policyLines))

    var transactions = RuleVersions*.Rule.map(\r -> r.PolicyTransactions*.Job).toList()
    _policyTransactionRow = createRow(DisplayKey.get("Web.BizRules.UWRules.ApplicabilityCriteria.PolicyTransactions"), \v -> getPolicyTransactions(v.Rule.PolicyTransactions), arrayValuesDiffer(transactions))

    _autoApprovableRow = createRow(DisplayKey.get("Web.BizRules.UWRulePanelSet.AutoApprovable"), \v -> v.Rule.UWIssueType.AutoApprovable)
    _defaultEditBeforeBindRow = createRow(DisplayKey.get("Web.BizRules.UWRulePanelSet.DefaultEditBeforeBind"), \v -> v.Rule.UWIssueType.DefaultEditBeforeBind)
    _defaultApprovalBlockingPointRow = createRow(DisplayKey.get("Web.BizRules.UWRulePanelSet.DefaultApprovalBlockingPoint"), \v -> v.Rule.UWIssueType.DefaultApprovalBlockingPoint)
    _comparatorRow = createRow(DisplayKey.get("Web.BizRules.UWRulePanelSet.ValueComparator"), \v -> v.Rule.UWIssueType.Comparator.Value)
    _valueFormatterTypeRow = createRow(DisplayKey.get("Web.BizRules.UWRulePanelSet.ValueFormatterType"), \v -> v.Rule.UWIssueType.ValueFormatterType)
    _defaultValueAssignmentTypeRow = createRow(DisplayKey.get("Web.BizRules.UWRulePanelSet.DefaultValueAssignmentType"), \v -> v.Rule.UWIssueType.DefaultValueAssignmentType)
    _defaultValueOffsetAmountRow = createRow(DisplayKey.get("Web.BizRules.UWRulePanelSet.DefaultValueOffsetAmount"), \v -> v.Rule.UWIssueType.DefaultValueOffsetAmount.DisplayValue)
    _defaultValueOffsetCurrencyRow = createRow(DisplayKey.get("Web.BizRules.UWRulePanelSet.DefaultValueOffsetCurrency"), \v -> v.Rule.UWIssueType.DefaultValueOffsetCurrency)
  }

  private function getJurisdictions(jurisdictions : AppCritJurisdiction[]) : String[] {
    if (jurisdictions == null or jurisdictions.IsEmpty) {
      return {DisplayKey.get("Web.BizRules.ApplicationCriteriaInputSet.All")}
    }
    return jurisdictions*.Jurisdiction*.DisplayName.sort()
  }

  private function getPolicyLines(lines : AppCritLineOfBusiness[]): String[] {
    if (lines == null or lines.IsEmpty) {
      return {DisplayKey.get("Web.BizRules.ApplicationCriteriaInputSet.All")}
    }
    return lines*.PolicyLine*.DisplayName.sort()
  }

  private function getPolicyTransactions(transactions : AppCritPolicyTransaction[])  : String[] {
    if (transactions == null or transactions.IsEmpty) {
      return {DisplayKey.get("Web.BizRules.ApplicationCriteriaInputSet.All")}
    }
    return transactions*.Job*.DisplayName.sort()
  }

  private function createRow<T>(label: String, getter(v: UWRuleVersion): T, isDifferent: Boolean = null): RuleComparisonRow<T> {
    var values = RuleVersions.map(\v -> getter(v))
    if (isDifferent == null) {
      isDifferent = valuesDiffer(values)
    }
    return new RuleComparisonRow<T>(label, isDifferent, values)
  }

}