package acc.pc.scheme.util

uses java.math.BigDecimal
uses java.util.ArrayList
uses gw.api.database.Query

class SchemeUtil {

  construct() {
  }

  /**
   * Coverage Functions
   */

  public static function isCoverageIncluded(coverageCode : String, actual : boolean, policyPeriod : PolicyPeriod) : boolean {
    return SchemeService.instance().isCoverageIncluded(coverageCode, actual, policyPeriod)
  }

  public static function isCoverageIncluded(coverageCode : String, actual : boolean, coverable : Coverable) : boolean {
    return SchemeService.instance().isCoverageIncluded(coverageCode, actual, coverable)
  }

  public static function isCoverageTermIncluded(coverageTermCode : String, actual : boolean, policyPeriod : PolicyPeriod) : boolean {
    return SchemeService.instance().isCoverageTermIncluded(coverageTermCode, actual, policyPeriod)
  }

  public static function coverageExistence(coverageCode : String, actual : ExistenceType, coverable : Coverable) : ExistenceType {
    return SchemeService.instance().coverageExistence(coverageCode, actual, coverable)
  }

  /**
   * Underwriting Functions
   */

  public static function isUWIssueExcluded(uwIssueCode : String, policyPeriod : PolicyPeriod) : boolean {
    return SchemeService.instance().isUWIssueExcluded(uwIssueCode, policyPeriod)
  }

  public static function isUWIssueIncluded(uwIssueCode : String, policyPeriod : PolicyPeriod) : boolean {
    return SchemeService.instance().isUWIssueIncluded(uwIssueCode, policyPeriod)
  }

  public static function isUWIssueAutoAccepted(uwIssueCode : String, policyPeriod : PolicyPeriod) : boolean {
    return SchemeService.instance().isUWIssueAutoAccepted(uwIssueCode, policyPeriod)
  }

  /**
   * Exclusion, Conditions and Modifier Functions
   */

  public static function isExclusionIncluded(exclusionCode : String, actual : boolean, coverable : Coverable) : boolean {
    return SchemeService.instance().isExclusionIncluded(exclusionCode, actual, coverable)
  }

  public static function isExclusionIncluded(exclusionCode : String, actual : boolean, policyPeriod : PolicyPeriod) : boolean {
    return SchemeService.instance().isExclusionIncluded(exclusionCode, actual, policyPeriod)
  }

  public static function isConditionIncluded(conditionCode : String, actual : boolean, policyPeriod : PolicyPeriod) : boolean {
    return SchemeService.instance().isConditionIncluded(conditionCode, actual, policyPeriod)
  }

  public static function isModifierIncluded(modifierCode : String, actual : boolean, policyPeriod : PolicyPeriod) : boolean {
    return SchemeService.instance().isModifierIncluded(modifierCode, actual, policyPeriod)
  }

  /**
   * Update of values
   * @deprecated ("Use one of the other update functions if possible")
   */
  public static function updateObjectValues(policyPeriod : PolicyPeriod){
    SchemeService.instance().updateObjectValues(policyPeriod)
  }

  public static function updateObjectValues(bean : KeyableBean, scheme : Scheme_Ext){
    SchemeService.instance().updateObjectValues(bean, scheme, false)
  }

  public static function updateObjectValues(bean : KeyableBean, scheme : Scheme_Ext, storeMeta : boolean){
    SchemeService.instance().updateObjectValues(bean, scheme, storeMeta)
  }

  public static function updateObjectValues(policyPeriod : PolicyPeriod, objects : Object[]){
    SchemeService.instance().updateObjectValues(policyPeriod, objects)
  }

  public static function updateObjectValues(coverable : Coverable, object : Object){
    SchemeService.instance().updateObjectValues(coverable, object)
  }

  public static function updateTermValue(policyPeriod : PolicyPeriod, term : gw.api.domain.covterm.CovTerm){
    SchemeService.instance().updateTermValue(policyPeriod, term)
  }

  public static function updateTermValue(clause : gw.api.domain.Clause){
    SchemeService.instance().updateTermValue(clause)
  }

  public static function updateDirectTermValue(policyPeriod : PolicyPeriod, term : gw.api.domain.covterm.DirectCovTerm){
    SchemeService.instance().updateDirectTermValue(policyPeriod, term)
  }

  public static function updateOptionTermValue(policyPeriod : PolicyPeriod, term : gw.api.domain.covterm.OptionCovTerm){
    SchemeService.instance().updateOptionTermValue(policyPeriod, term)
  }

  /**
   * UI Functions
   */

  public static function isPCFEditable(parent : String, code : String, action : boolean, policyPeriod : PolicyPeriod) : boolean {
    return SchemeService.instance().isEditable(parent, code, action, policyPeriod)
  }

  public static function isPCFVisible(parent : String, code : String, action : boolean, policyPeriod : PolicyPeriod) : boolean {
    return SchemeService.instance().isVisible(parent, code, action, policyPeriod)
  }

  public static function isEditable(parent : String, code : String, action : boolean, policyPeriod : PolicyPeriod) : boolean {
    return SchemeService.instance().isEditable(parent, code, action, policyPeriod)
  }

  public static function isEditable(parent : Object, code : String, action : boolean, policyPeriod : PolicyPeriod) : boolean {
    return SchemeService.instance().isEditable(parent, code, action, policyPeriod)
  }

  public static function isAvailable(parent : String, code : String, action : boolean, policyPeriod : PolicyPeriod) : boolean {
    return SchemeService.instance().isAvailable(parent, code, action, policyPeriod)
  }

  public static function isAvailable(parent : Object, code : String, action : boolean, policyPeriod : PolicyPeriod) : boolean {
    return SchemeService.instance().isAvailable(parent, code, action, policyPeriod)
  }

  public static function isVisible(parent : String, code : String, action : boolean, policyPeriod : PolicyPeriod) : boolean {
    return SchemeService.instance().isVisible(parent, code, action, policyPeriod)
  }

  public static function isVisible(parent : Object, code : String, action : boolean, policyPeriod : PolicyPeriod) : boolean {
    return SchemeService.instance().isVisible(parent, code, action, policyPeriod)
  }

  public static function isAttributeRequired(parent : String, code : String, action : boolean, policyPeriod : PolicyPeriod) : boolean {
    return SchemeService.instance().isAttributeRequired(parent, code, action, policyPeriod)
  }

  public static function isAttributeRequired(parent : Object, code : String, action : boolean, policyPeriod : PolicyPeriod) : boolean {
    return SchemeService.instance().isAttributeRequired(parent, code, action, policyPeriod)
  }

  public static function isEditableTerm(code : String, action : boolean, policyPeriod : PolicyPeriod) : boolean {
    return SchemeService.instance().isEditableTerm(code, action, policyPeriod)
  }

  public static function fetchCurrentByCode(code : String) : Scheme_Ext {
    return SchemeService.instance().fetchCurrentByCode(code)
  }

  public static function fetchSchemeByProduct(code : String) : Scheme_Ext[] {
    return SchemeService.instance().fetchSchemeByProduct(code)
  }

  public static function fetchSchemeByProduct(code : String, schemeType : SchemeType_Ext) : Scheme_Ext[] {
    return SchemeService.instance().fetchSchemeByProduct(code, schemeType)
  }
  
 /**
  * Validation Functions
  */
  
  public static function bypassValidation(policyPeriod : PolicyPeriod, parent : String, comparator : String, actual : boolean) : boolean {
   return SchemeService.instance().bypassValidation(policyPeriod, parent, comparator, actual)
  }
  
  public static function bypassValidation(policyPeriod : PolicyPeriod, comparator : String, actual : boolean) : boolean {
   return SchemeService.instance().bypassValidation(policyPeriod, comparator, actual)
  }

  public static function validateCoverageTerm(coverable : Coverable, term : gw.api.domain.covterm.DirectCovTerm, inValue : double) : boolean{
    return SchemeService.instance().validateCoverageTerm(coverable, term, inValue)
  }

  public static function validateCoverageTerm(clause : gw.api.domain.Clause, term : gw.api.domain.covterm.DirectCovTerm, inValue : double) : boolean{
    return SchemeService.instance().validateCoverageTerm(clause, term, inValue)
  }

  /**
   * Rating Functions
   */

  public static function getCoverageRateValue(comparitorCode : String, policyPeriod : PolicyPeriod) : BigDecimal {
    return SchemeService.instance().getRateValue(comparitorCode, policyPeriod, SchemeSourceType_Ext.TC_RATECOVERAGE)
  }

  public static function getCostCategoryRateValue(comparitorCode : String, coverable : Coverable) : BigDecimal {
    return SchemeService.instance().getRateValue(comparitorCode, coverable, SchemeSourceType_Ext.TC_RATECOSTCATEGORY)
  }

  public static function getCoverageRateValue(comparitorCode : String, coverable : Coverable) : BigDecimal {
    return SchemeService.instance().getRateValue(comparitorCode, coverable, SchemeSourceType_Ext.TC_RATECOVERAGE)
  }

  public static function getCostCategoryRateValue(comparitorCode : String, policyPeriod : PolicyPeriod) : BigDecimal {
    return SchemeService.instance().getRateValue(comparitorCode, policyPeriod, SchemeSourceType_Ext.TC_RATECOSTCATEGORY)
  }
  
  /**
   * Eligibility Functions
   */

  public static function isEligible(policyPeriod: PolicyPeriod, object: Object) : boolean{
    return SchemeService.instance().isEligible(policyPeriod, object)
  }

  public static function isEligible(scheme: Scheme_Ext, object: Object) : boolean{
    return SchemeService.instance().isEligible(scheme, object)
  }

  /**
   * Typelist Functions
   */

  public static function filterTypelist(parent : Object, code : String, policyPeriod : PolicyPeriod, value : String) : boolean {
    return SchemeService.instance().filterTypelist(parent, code, policyPeriod, value)
  }

}