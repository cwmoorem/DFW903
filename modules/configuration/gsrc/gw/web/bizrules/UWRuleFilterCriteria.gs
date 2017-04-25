package gw.web.bizrules

uses gw.api.database.ISelectQueryBuilder
uses gw.api.database.InOperation
uses gw.api.database.Queries
uses gw.api.database.Relop
uses gw.api.locale.DisplayKey
uses gw.api.web.SessionVar
uses gw.bizrules.management.FilterCriteria
uses gw.bizrules.management.RuleQueryFactory
uses gw.entity.IEntityType
uses gw.lang.reflect.features.PropertyReference

uses java.io.Serializable

@Export
class UWRuleFilterCriteria implements Serializable, FilterCriteria<UWRuleVersion> {
  static var _sessionVar = new SessionVar<UWRuleFilterCriteria>()

  var _jurisdiction: typekey.Jurisdiction as Jurisdiction
  var _job: typekey.Job as Job
  var _policyLine: typekey.PolicyLine as PolicyLine
  var _nameOrDescription: String as NameOrDescription
  var _availability: UWRuleAvailability as Availability
  var _defaultStatus: RuleQueryFactory<UWRule, UWRuleVersion, UWRuleHead>
  var _status: RuleQueryFactory<UWRule, UWRuleVersion, UWRuleHead>as Status
  var _availableStatuses: RuleQueryFactory<UWRule, UWRuleVersion, UWRuleHead>[] as AvailableStatuses

  private construct() {
    var helper = new UWRulesPageHelper(gw.bizrules.UWRulesNavigationSupport.Instance)
    var queryFactories = helper.RuleQueryFactories
    var statusAll = DisplayKey.get("BizRules.RulesPage.Query.All")
    _defaultStatus = queryFactories.singleWhere(\status -> status.DisplayName == statusAll)
    _status = _defaultStatus
    _availableStatuses = queryFactories.toTypedArray()
    _availability = TC_ALL
  }

  static property get Instance(): UWRuleFilterCriteria {
    var instance = _sessionVar.get()
    if (instance == null) {
      instance = new UWRuleFilterCriteria()
      _sessionVar.set(instance)
    }
    return instance
  }

  property get Specified(): boolean {
    return not(_nameOrDescription == null
        && _status == _defaultStatus
        && _availability == TC_ALL
        && _policyLine == null
        && _job == null
        && _jurisdiction == null
    )
  }

  function clear() {
    _nameOrDescription = null
    _status = _defaultStatus
    _availability = TC_ALL
    _policyLine = null
    _job = null
    _jurisdiction = null
  }

  function copyFrom(criteria: UWRuleFilterCriteria) {
    _nameOrDescription = criteria.NameOrDescription
    _status = criteria.Status
    _availability = criteria.Availability
    _policyLine = criteria.PolicyLine
    _job = criteria.Job
    _jurisdiction = criteria.Jurisdiction
  }

  function copy(): UWRuleFilterCriteria {
    return new UWRuleFilterCriteria(){
        :Jurisdiction = Jurisdiction,
        :PolicyLine = PolicyLine,
        :Job = Job,
        :NameOrDescription = NameOrDescription,
        :Status = Status,
        :Availability = Availability
        }
  }

  function apply(query: ISelectQueryBuilder<UWRuleVersion>) {
    if (Specified) {

      var ruleRestriction = query.join(UWRuleVersion#Rule)

      if (Jurisdiction != null) {
        appCritMultiselectFilter(ruleRestriction, AppCritJurisdiction#Jurisdiction, Jurisdiction, AppCritJurisdiction#UWRule)
      }
      if (PolicyLine != null) {
        appCritMultiselectFilter(ruleRestriction, AppCritLineOfBusiness#PolicyLine, PolicyLine, AppCritLineOfBusiness#UWRule)
      }
      if (Job != null) {
        appCritMultiselectFilter(ruleRestriction, AppCritPolicyTransaction#Job, Job, AppCritPolicyTransaction#UWRule)
      }
      if (NameOrDescription != null && NameOrDescription.trim() != "") {
        ruleRestriction.or(\r -> {
          r.contains(Rule#Name, NameOrDescription, true)
          r.contains(Rule#Description, NameOrDescription, true)
        })
      }

      switch (Availability) {
        case TC_ALL:
          break
        case TC_AVAILABLE:
          ruleRestriction.compare(Rule#AvailableToRun, Relop.Equals, true)
          break
        case TC_UNAVAILABLE:
          ruleRestriction.compare(Rule#AvailableToRun, Relop.Equals, false)
          break
        case TC_INVALID:
          var invalid = Queries.createQuery(RuleValidationInfo).compare(RuleValidationInfo#Valid, Relop.Equals, false)
          ruleRestriction.subselect(Rule#ID, InOperation.CompareIn, invalid, RuleValidationInfo#Rule)
          ruleRestriction.compare(UWRule#ExternallyManaged, Relop.Equals, false)
          break
        case TC_VALID:
          var valid = Queries.createQuery(RuleValidationInfo).compare(RuleValidationInfo#Valid, Relop.Equals, true)
          ruleRestriction.or(\orRestriction -> {
            orRestriction.subselect(Rule#ID, InOperation.CompareIn, valid, RuleValidationInfo#Rule)
            orRestriction.compare(UWRule#ExternallyManaged, Relop.Equals, true)
          })
          break
        default:
          throw new IllegalAccessException("Unknown availability typekey: ${Availability.Code}")
      }
    }
  }

  private function appCritMultiselectFilter<E extends gw.pl.persistence.core.Bean, T>(
      query: ISelectQueryBuilder<UWRuleVersion>,
      filterProp: PropertyReference<E, T>,
      filterValue: T,
      ruleProperty: PropertyReference<E, UWRule>) {
    var tableQuery = Queries.createQuery<E>(E as IEntityType)
    var filterQuery = Queries.createQuery<E>(E as IEntityType).compare(filterProp, Equals, filterValue)
    query.and(\andRestr ->
        andRestr.or(\orRestr -> {
          orRestr.subselect(UWRule#ID, CompareIn, filterQuery, ruleProperty)
          orRestr.subselect(UWRule#ID, CompareNotIn, tableQuery, ruleProperty)
        })
    )
  }
}
