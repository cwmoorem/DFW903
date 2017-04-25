package acc.pc.scheme.util

uses java.util.ArrayList
uses gw.api.database.Query
uses java.lang.IllegalArgumentException
uses java.math.BigDecimal
uses java.util.concurrent.locks.ReentrantLock

/**
 * SchemeService is the main class that will process the scheme requests, it will in most cases
 * hand off control to the SchemeExt enhancement.
 * 
 * It has been created as a singleton to stop unnecessary instantiations of the class and thus attempt
 * to improve the performance of Scheme processing as this could be problematic if care is not taken
 * to make sure performance is always at the fore.
 */
class SchemeService {

  private static var _instance : SchemeService
  private static var _lock     = new ReentrantLock()

  /**
   * To ensure that there is only one instance at any one time
  */
  public static function instance() : SchemeService {
    using(_lock){
      if(_instance == null){
        _instance = new SchemeService ()
      }
      return _instance
    }
  }

  private construct(){
  }

  /**
   * Identify if an element is required, the default reply will be false if the element can not be found
   * this is intended to be used on the UI
   * @param parent The parent object
   * @param code String value of the code to be enquired on
   * @param actual The value to use if immutable is not found
   * @param policyPeriod Policy Period to be used for the identification of the General Agreement
   */
  public function isAttributeRequired(parent : String, code : String, actual : boolean,  policyPeriod : PolicyPeriod) : boolean {
    var retVal = this.uiAction(parent, code, actual, policyPeriod, {SchemeActionType_Ext.TC_REQUIRED})
    return retVal
  }

  /**
   * Identify if an element is required, the default reply will be false if the element can not be found
   * this is intended to be used on the UI
   * @param parent the parent object
   * @param code String value of the code to be enquired on
   * @param actual The value to use if immutable is not found
   * @param policyPeriod Policy Period to be used for the identification of the General Agreement
   */
  public function isAttributeRequired(parent : Object, code : String, actual : boolean,  policyPeriod : PolicyPeriod) : boolean {
    var retVal = actual
    if(parent != null){
      var objectName = (typeof parent).toString().replaceFirst("entity.","")
      retVal = this.uiAction(objectName, code, actual, policyPeriod, {SchemeActionType_Ext.TC_REQUIRED})
    }
    return retVal
  }

  /**
   * Identify if an element has a specific UI setting (Editable, Visible, Available, Required), the default reply will be true if the element can not be found
   * this is intended to be used on the UI mainly for availability of a field for update
   * @param parent The parent object
   * @param code String value of the code to be enquired on
   * @param actual The value to use if immutable is not found
   * @param policyPeriod Policy Period to be used for the identification of the General Agreement
   */
  public function uiAction(parent : String, code : String, actual : boolean,  policyPeriod : PolicyPeriod, inUIActions : SchemeActionType_Ext[]) : boolean {
    var retVal = actual
    var schemeResult : SchemeResultBoolean
    var injectValue = actual
    if(policyPeriod.EffectiveDatedFields.SchemeLinks.HasElements){
      for(schemeLink in policyPeriod.EffectiveDatedFields.SchemeLinks.orderBy(\elt -> elt.SchemeOrder)){
        if(schemeLink.Scheme.ConditionValue == null){
          setConditionValueFor(schemeLink.Scheme, policyPeriod)
        }
        schemeResult = schemeLink.Scheme.uiAction(parent, code, injectValue, inUIActions)
        if(schemeResult.isSchemeResult() == false){
          retVal = schemeResult.SchemeResult
          break
        }
        if(schemeResult.isSchemeResult() == true){
          injectValue = schemeResult.SchemeResult
        }
        if(schemeResult.SchemeResult == null) {
          injectValue = schemeResult.ActualResult
        }
        retVal = injectValue
      }
    }
    return retVal
  }

  /**
   * Identify if an element is editable, the default reply will be true if the element can not be found
   * this is intended to be used on the UI mainly for availability of a field for update
   * @param parent The parent object
   * @param code String value of the code to be enquired on
   * @param actual The value to use if immutable is not found
   * @param policyPeriod Policy Period to be used for the identification of the General Agreement
   */
  public function isEditable(parent : String, code : String, actual : boolean,  policyPeriod : PolicyPeriod) : boolean {
    var retVal = this.uiAction(parent, code, actual, policyPeriod, {SchemeActionType_Ext.TC_IMMUTABLE})
    return retVal
  }

  /**
   * Identify if an element is editable, the default reply will be true if the element can not be found
   * this is intended to be used on the UI mainly for availability of a field for update
   * @param parent the parent object
   * @param code String value of the code to be enquired on
   * @param actual The value to use if immutable is not found
   * @param policyPeriod Policy Period to be used for the identification of the General Agreement
   */
  public function isEditable(parent : Object, code : String, actual : boolean,  policyPeriod : PolicyPeriod) : boolean {
    var retVal = actual
    if(parent != null){
      var objectName = (typeof parent).toString().replaceFirst("entity.","")
      retVal = this.uiAction(objectName, code, actual, policyPeriod, {SchemeActionType_Ext.TC_IMMUTABLE})
    }
    return retVal
  }

  /**
   * Identify if an element is available, the default reply will be true if the element can not be found
   * this is intended to be used on the UI mainly for availability of a field for update
   * @param parent The parent object
   * @param code String value of the code to be enquired on
   * @param actual The value to use if immutable is not found
   * @param policyPeriod Policy Period to be used for the identification of the General Agreement
   */
  public function isAvailable(parent : String, code : String, actual : boolean,  policyPeriod : PolicyPeriod) : boolean {
    var retVal = this.uiAction(parent, code, actual, policyPeriod, {SchemeActionType_Ext.TC_AVAILABLE, SchemeActionType_Ext.TC_NOTAVAILABLE})
    return retVal
  }

  /**
   * Identify if an element is available, the default reply will be true if the element can not be found
   * this is intended to be used on the UI mainly for availability of a field for update
   * @param parent the parent object
   * @param code String value of the code to be enquired on
   * @param actual The value to use if immutable is not found
   * @param policyPeriod Policy Period to be used for the identification of the General Agreement
   */
  public function isAvailable(parent : Object, code : String, actual : boolean,  policyPeriod : PolicyPeriod) : boolean {
    var retVal = actual
    if(parent != null){
      var objectName = (typeof parent).toString().replaceFirst("entity.","")
      retVal = this.uiAction(objectName, code, actual, policyPeriod, {SchemeActionType_Ext.TC_AVAILABLE, SchemeActionType_Ext.TC_NOTAVAILABLE})
    }
    return retVal
  }

  /**
   * Identify if an element is visible, the default reply will be true if the element can not be found
   * this is intended to be used on the UI mainly for availability of a field for update
   * @param parent The parent object
   * @param code String value of the code to be enquired on
   * @param actual The value to use if immutable is not found
   * @param policyPeriod Policy Period to be used for the identification of the General Agreement
   */
  public function isVisible(parent : String, code : String, actual : boolean,  policyPeriod : PolicyPeriod) : boolean {
    var retVal = this.uiAction(parent, code, actual, policyPeriod, {SchemeActionType_Ext.TC_VISIBLE, SchemeActionType_Ext.TC_NOTVISIBLE})
    return retVal
  }

  /**
   * Identify if an element is visible, the default reply will be true if the element can not be found
   * this is intended to be used on the UI mainly for availability of a field for update
   * @param parent the parent object
   * @param code String value of the code to be enquired on
   * @param actual The value to use if immutable is not found
   * @param policyPeriod Policy Period to be used for the identification of the General Agreement
   */
  public function isVisible(parent : Object, code : String, actual : boolean,  policyPeriod : PolicyPeriod) : boolean {
    var retVal = actual
    if(parent != null){
      var objectName = (typeof parent).toString().replaceFirst("entity.","")
      retVal = this.uiAction(objectName, code, actual, policyPeriod, {SchemeActionType_Ext.TC_VISIBLE, SchemeActionType_Ext.TC_NOTVISIBLE})
    }
    return retVal
  }

  /**
   * Identify if an element is immutable, the default reply will be false if the element can not be found
   * this is intended to be used on the UI mainly for availability of a field for update
   * @param code String value of the code to be enquired on
   * @param actual This is the desired result if immutable is not found for the term
   * @param policyPeriod Policy Period to be used for the identification of the General Agreement
   */
  public function isEditableTerm(code : String, actual : boolean, policyPeriod : PolicyPeriod) : boolean {
    var retVal = true
    if(policyPeriod.Scheme != null){
      if(policyPeriod.Scheme.ConditionValue == null){
        setConditionValueFor(policyPeriod.Scheme, policyPeriod)
      }
      retVal = policyPeriod.Scheme.isTermEditable(null, code, actual)
      if(policyPeriod.SecondaryScheme != null){
        setConditionValueFor(policyPeriod.SecondaryScheme, policyPeriod)
        retVal = policyPeriod.SecondaryScheme.isTermEditable(null, code, actual)
      }
    }
    return retVal
  }

  /**
   * Identify if the given underwriting issue code is marked as excluded in the Scheme
   * @param uwIssueCode String value of the underwriting issue code
   * @param policyPeriod PolicyPeriod used for the extraction of the Scheme for use
   */
  public function isUWIssueExcluded(uwIssueCode : String, policyPeriod : PolicyPeriod) : boolean {
    var retVal = false
    if(policyPeriod.Scheme == null){
      return false
    }
    if(policyPeriod.Scheme.ConditionValue == null){
      setConditionValueFor(policyPeriod.Scheme, policyPeriod)
    }
    retVal = policyPeriod.Scheme.isUWIssueExcluded(uwIssueCode, false)
    if(policyPeriod.SecondaryScheme != null){
      setConditionValueFor(policyPeriod.SecondaryScheme, policyPeriod)
      retVal = policyPeriod.SecondaryScheme.isUWIssueExcluded(uwIssueCode, retVal)
    }
    return retVal
  }

  /**
   * Identify if the given underwriting issue code is marked as included in the Scheme
   * @param uwIssueCode String value of the underwriting issue code
   * @param policyPeriod PolicyPeriod used for the extraction of the Scheme for use
   */
  public function isUWIssueIncluded(uwIssueCode : String, policyPeriod : PolicyPeriod) : boolean {
    var retVal = false
    if (policyPeriod.Scheme == null) {
      return false
    }
    if(policyPeriod.Scheme.ConditionValue == null){
      setConditionValueFor(policyPeriod.Scheme, policyPeriod)
    }
    retVal =  policyPeriod.Scheme.isUWIssueIncluded(uwIssueCode, true)
    if(policyPeriod.SecondaryScheme != null){
      setConditionValueFor(policyPeriod.SecondaryScheme, policyPeriod)
      retVal = policyPeriod.SecondaryScheme.isUWIssueIncluded(uwIssueCode, retVal)
    }
    return retVal
  }

  /**
   * Identify if the given coverage code is marked as included in the Scheme
   * @param coverageCode String value of the coverage code
   * @param actual The result required if there is no Scheme override
   * @param policyPeriod PolicyPeriod used for the extraction of the Scheme for use
   */
  public function isCoverageIncluded(coverageCode : String, actual : boolean, policyPeriod : PolicyPeriod) : boolean {
    var retVal = false
    if(policyPeriod.Scheme == null){
      return actual
    }
    if(policyPeriod.Scheme.ConditionValue == null){
      setConditionValueFor(policyPeriod.Scheme, policyPeriod)
    }
    retVal =  policyPeriod.Scheme.isCoverageIncluded(coverageCode, actual)
    if(policyPeriod.SecondaryScheme != null){
      setConditionValueFor(policyPeriod.SecondaryScheme, policyPeriod)
      retVal = policyPeriod.SecondaryScheme.isCoverageIncluded(coverageCode, retVal)
    }
    return retVal
  }
  
  /**
   * Identify if the given coverage code is marked as excluded in the Scheme
   * @param coverageCode String value of the coverage code
   * @param actual The result required if there is no inclued
   * @param coverable Coverable used for the extraction of the Scheme configuration
   */
  public function isCoverageIncluded(coverageCode : String, actual : boolean, coverable : Coverable) : boolean {
    var retVal = false
    if(coverable.PolicyLine.Branch.Scheme == null){
      return actual
    }
    setConditionValueFor(coverable.PolicyLine.Branch.Scheme, coverable)
    retVal = coverable.PolicyLine.Branch.Scheme.isCoverageIncluded(coverageCode, actual)
    if(coverable.PolicyLine.Branch.SecondaryScheme != null){
      setConditionValueFor(coverable.PolicyLine.Branch.SecondaryScheme, coverable)
      retVal = coverable.PolicyLine.Branch.SecondaryScheme.isCoverageIncluded(coverageCode, retVal)
    }
    return retVal
  }  
  
  /**
   * Get the existance of a coverage
   * @param coverageCode String value of the coverage code
   * @param actual The desired result if no existence
   * @param coverable Coverable used for the extraction of the Scheme configuration
   */
  public function coverageExistence(coverageCode : String, actual : ExistenceType, coverable : Coverable) : ExistenceType {
    var retVal : ExistenceType
    if(coverable.PolicyLine.Branch.Scheme == null){
      return actual
    }
    setConditionValueFor(coverable.PolicyLine.Branch.Scheme, coverable)
    retVal = coverable.PolicyLine.Branch.Scheme.coverageExistence (coverageCode, actual)
    if(coverable.PolicyLine.Branch.SecondaryScheme != null){
      setConditionValueFor(coverable.PolicyLine.Branch.SecondaryScheme, coverable)
      retVal = coverable.PolicyLine.Branch.SecondaryScheme.coverageExistence (coverageCode, retVal)
    }
    return retVal
  }     

  /**
   * Identify if the given coverage term code is marked as included in the Scheme
   * @param coverageTermCode String value of the coverage term code
   * @param actual The result required if there is no Scheme override
   * @param policyPeriod PolicyPeriod used for the extraction of the Scheme for use
   */
  public function isCoverageTermIncluded(coverageTermCode : String, actual : boolean, policyPeriod : PolicyPeriod) : boolean {
    var retVal = true
    if(policyPeriod.Scheme == null){
      return actual
    }
    if(policyPeriod.Scheme.ConditionValue == null){
      setConditionValueFor(policyPeriod.Scheme, policyPeriod)
    }
    retVal = policyPeriod.Scheme.isCoverageTermIncluded(coverageTermCode, actual)
    if(policyPeriod.SecondaryScheme != null){
      setConditionValueFor(policyPeriod.SecondaryScheme, policyPeriod)
      retVal = policyPeriod.SecondaryScheme.isCoverageTermIncluded(coverageTermCode, retVal)
    }
    return retVal
  }

  /**
   * Uses the bundle from the supplied PolicyPeriod to set the values of any object present in the bundle
   * that is also defined in the Scheme
   * You must be careful to ensure that what you want to update is in the bundle, it is better to use one of the other
   * functions that do not rely on the object being in the bundle at that point in time
   * @param policyPeriod The Period that will be used for the extraction of the bundle objects and the Scheme to use
   */
  public function updateObjectValues(policyPeriod : PolicyPeriod) {
    if(policyPeriod.Scheme == null){
      return
    }
    var bundle = gw.transaction.Transaction.getCurrent()
    var objects = new ArrayList<KeyableBean>()
    objects.addAll(bundle.InsertedBeans.toList())
    objects.addAll(bundle.UpdatedBeans.toList())
    objects.each( \ elt -> updateObjectValues(policyPeriod,{elt}))
  }

  /**
   * Uses the bundle from the supplied bean to set the values of any object present in the bundle
   * that is also defined in the Scheme
   * @param bean Entity instance that will be used for the extraction of the bundle objects
   * @param scheme the Scheme to use
   */
  public function updateObjectValues(bean : KeyableBean, scheme : Scheme_Ext) {
    updateObjectValues(bean, scheme, false)
  }

  /**
   * Uses the bundle from the supplied bean to set the values of any object present in the bundle
   * that is also defined in the Scheme
   * @param bean Entity instance that will be used for the extraction of the bundle objects
   * @param scheme the Scheme to use
   * @param storeMetaData if true metadata about updated fields will be added to object, if it implements SchemeMetaDataHolderExt entity
   */
  public function updateObjectValues(bean : KeyableBean, scheme : Scheme_Ext, storeMetaData: boolean) {
    if (scheme == null) {
      throw new IllegalArgumentException("Scheme must not be null")
    }
    var bundle = bean.Bundle
    var objects = new ArrayList<KeyableBean>()
    objects.addAll(bundle.InsertedBeans.toList())
    objects.addAll(bundle.UpdatedBeans.toList())
    objects.each( \ obj -> {
      scheme.updateObjectValues(obj, storeMetaData)
    })
  }

  /**
   * Set the values stored in the Scheme for the provided object
   * @param policyPeriod PolicyPeriod used for the extraction of the Scheme
   * @param object The object that will have the attributes set
   */
  public function updateObjectValues(policyPeriod : PolicyPeriod, objects : Object[]) {
    if(policyPeriod.Scheme == null){
      return
    }
    if(policyPeriod.Scheme.ConditionValue == null){
      setConditionValueFor(policyPeriod.Scheme, policyPeriod)
    }
    for(object in objects){
      policyPeriod.Scheme.updateObjectValues(object)
      if(policyPeriod.SecondaryScheme != null){
        if(policyPeriod.SecondaryScheme.ConditionValue == null){
          setConditionValueFor(policyPeriod.SecondaryScheme, policyPeriod)
        }
        policyPeriod.SecondaryScheme.updateObjectValues(object)
      }
    }
  }

  /**
   * Set the values stored in the Scheme for the provided object
   * @param coverable Coverable used for the extraction of the Scheme
   * @param object The object that will have the attributes set
   */
  public function updateObjectValues(coverable : Coverable, object : Object) {
    if(coverable.PolicyLine.Branch.Scheme == null){
      return
    }
    setConditionValueFor(coverable.PolicyLine.Branch.Scheme, coverable)
    updateObjectValues(coverable.PolicyLine.Branch,{object})
  }


  /**
   * Identify if the given underwriting issue code is marked as AutoAccepted in the Scheme
   * @param uwIssueCode String value of the underwriting issue code
   * @param policyPeriod PolicyPeriod used for the extraction of the Scheme for use
   */
  public function isUWIssueAutoAccepted(uwIssueCode : String, policyPeriod : PolicyPeriod) : boolean {
    var retVal = false
    if (policyPeriod.Scheme == null) {
      return false
    }
    if(policyPeriod.Scheme.ConditionValue == null){
      setConditionValueFor(policyPeriod.Scheme, policyPeriod)
    }
    retVal = policyPeriod.Scheme.isUWIssueAutoAccepted(uwIssueCode, false)
    if(policyPeriod.SecondaryScheme != null){
      setConditionValueFor(policyPeriod.SecondaryScheme, policyPeriod)
      retVal = policyPeriod.SecondaryScheme.isUWIssueAutoAccepted(uwIssueCode, retVal)
    }
    return retVal
  }

  /**
   * Fetch the scheme based on its code
   * @param code The code of the scheme to fetch
   */
  public function fetchCurrentByCode(code : String) : Scheme_Ext {
    var query = Query.make(Scheme_Ext).compare("CodeExt", Equals, code).select()
    if(query.Count != 1){
      return null
    } else {
      return query.first()
    }
  }
  
  /**
   * Selects the schemes that are applicable for the passed product code
   * @param code Product code for selection
   */
  public function fetchSchemeByProduct(code : String) : Scheme_Ext[] {
    var retVal = new ArrayList<Scheme_Ext>()
    var query = Query.make(Scheme_Ext).compare("ProductCode", Equals, code).select()
    retVal.addAll(query.toList())
    return retVal.toTypedArray()
  }

  /**
   * Selects the schemes that are applicable for the passed product code
   * @param code Product code for selection
   */
  public function fetchSchemeByProduct(code : String, schemeType : SchemeType_Ext) : Scheme_Ext[] {
    var retVal = new ArrayList<Scheme_Ext>()
    var query = Query.make(Scheme_Ext).compare("ProductCode", Equals, code).select()
    retVal.addAll(query.where(\elt -> elt.SchemeType == schemeType).toList())
    return retVal.toTypedArray()
  }

  /**
   * Identify if the given condition code is marked as excluded in the Scheme
   * @param conditionCode String value of the condition code
   * @param actual Block to execute if Scheme does not hold the coverage
   * @param policyPeriod PolicyPeriod used for the extraction of the Scheme for use
   */
  public function isConditionExcluded(conditionCode : String, actual : boolean, policyPeriod : PolicyPeriod) : boolean {
    var retVal = false
    if(policyPeriod.Scheme == null){
      return actual
    }
    if(policyPeriod.Scheme.ConditionValue == null){
      setConditionValueFor(policyPeriod.Scheme, policyPeriod)
    }
    retVal = policyPeriod.Scheme.isConditionExcluded(conditionCode, actual)
    if(policyPeriod.SecondaryScheme != null){
      setConditionValueFor(policyPeriod.SecondaryScheme, policyPeriod)
      retVal = policyPeriod.SecondaryScheme.isConditionExcluded(conditionCode, retVal)
    }
    return retVal
  }

  /**
   * Identify if the given exclusion code is marked as excluded in the Scheme
   * @param exclusionCode String value of the exclusion code
   * @param actual Block to execute if Scheme does not hold the coverage
   * @param policyPeriod PolicyPeriod used for the extraction of the Scheme for use
   */
  public function isExclusionExcluded(exclusionCode : String, actual : boolean, policyPeriod : PolicyPeriod) : boolean {
    var retVal = false
    if(policyPeriod.Scheme == null){
      return actual
    }
    if(policyPeriod.Scheme.ConditionValue == null){
      setConditionValueFor(policyPeriod.Scheme, policyPeriod)
    }
    retVal = policyPeriod.Scheme.isExclusionExcluded(exclusionCode, actual)
    if(policyPeriod.SecondaryScheme != null){
      setConditionValueFor(policyPeriod.SecondaryScheme, policyPeriod)
      retVal = policyPeriod.SecondaryScheme.isExclusionExcluded(exclusionCode, retVal)
    }
    return retVal
  }

  /**
   * Identify if the given coverage code is marked as excluded in the Scheme
   * @param exclusionCode String value of the exclusion code
   * @param actual Block to execute if Scheme does not hold the coverage
   * @param coverable Coverable used for the extraction of the Scheme configuration
   */
  public function isExclusionExcluded(exclusionCode : String, actual : boolean, coverable : Coverable) : boolean {
    if(coverable.PolicyLine.Branch.Scheme == null){
      return actual
    }
    setConditionValueFor(coverable.PolicyLine.Branch.Scheme, coverable)
    return isExclusionExcluded(exclusionCode, actual, coverable.PolicyLine.Branch)
  }

  /**
   * Identify if the given modifier code is marked as excluded in the Scheme
   * @param modifierCode String value of the exclusion code
   * @param actual The desired result if exclude is not found
   * @param policyPeriod PolicyPeriod used for the extraction of the Scheme for use
   */
  public function isModifierExcluded(modifierCode : String, actual : boolean, policyPeriod : PolicyPeriod) : boolean {
    var retVal = false
    if(policyPeriod.Scheme == null){
      return actual
    }
    if(policyPeriod.Scheme.ConditionValue == null){
      setConditionValueFor(policyPeriod.Scheme, policyPeriod)
    }
    retVal = policyPeriod.Scheme.isModifierExcluded(modifierCode, actual)
    if(policyPeriod.SecondaryScheme != null){
      setConditionValueFor(policyPeriod.SecondaryScheme, policyPeriod)
      retVal = policyPeriod.SecondaryScheme.isModifierExcluded(modifierCode, retVal)
    }
    return retVal
  }

  /**
   * Identify if the given condition code is marked as included in the Scheme
   * @param conditionCode String value of the condition code
   * @param actual The result required if there is no Scheme override
   * @param policyPeriod PolicyPeriod used for the extraction of the Scheme for use
   */
  public function isConditionIncluded(conditionCode : String, actual : boolean, policyPeriod : PolicyPeriod) : boolean {
    var retVal = true
    if(policyPeriod.Scheme == null){
      return actual
    }
    if(policyPeriod.Scheme.ConditionValue == null){
      setConditionValueFor(policyPeriod.Scheme, policyPeriod)
    }
    retVal = policyPeriod.Scheme.isConditionIncluded(conditionCode, actual)
    if(policyPeriod.SecondaryScheme != null){
      setConditionValueFor(policyPeriod.SecondaryScheme, policyPeriod)
      retVal = policyPeriod.SecondaryScheme.isConditionIncluded(conditionCode, retVal)
    }
    return retVal
  }

  /**
   * Identify if the given exclusion code is marked as included in the Scheme
   * @param exclusionCode String value of the exclusion code
   * @param actual The result required if there is no Scheme override
   * @param policyPeriod PolicyPeriod used for the extraction of the Scheme for use
   */
  public function isExclusionIncluded(exclusionCode : String, actual : boolean, policyPeriod : PolicyPeriod) : boolean {
    var retVal = true
    if(policyPeriod.Scheme == null){
      return actual
    }
    if(policyPeriod.Scheme.ConditionValue == null){
      setConditionValueFor(policyPeriod.Scheme, policyPeriod)
    }
    retVal = policyPeriod.Scheme.isExclusionIncluded(exclusionCode, actual)
    if(policyPeriod.SecondaryScheme != null){
      setConditionValueFor(policyPeriod.SecondaryScheme, policyPeriod)
      retVal = policyPeriod.SecondaryScheme.isExclusionIncluded(exclusionCode, actual)
    }
    return retVal
  }
  
  /**
   * Identify if the given coverage code is marked as excluded in the Scheme
   * @param exclusionCode String value of the exclusion code
   * @param actual Block to execute if Scheme does not hold the coverage
   * @param coverable Coverable used for the extraction of the Scheme configuration
   */
  public function isExclusionIncluded(exclusionCode : String, actual : boolean, coverable : Coverable) : boolean {
    if(coverable.PolicyLine.Branch.Scheme == null){
      return actual
    }
    setConditionValueFor(coverable.PolicyLine.Branch.Scheme, coverable)
    return isExclusionIncluded(exclusionCode, actual, coverable.PolicyLine.Branch)
  }

  /**
   * Identify if the given modifier code is marked as included in the Scheme
   * @param modifierCode String value of the exclusion code
   * @param actual The result required if there is no Scheme override
   * @param policyPeriod PolicyPeriod used for the extraction of the Scheme for use
   */
  public function isModifierIncluded(modifierCode : String, actual : boolean, policyPeriod : PolicyPeriod) : boolean {
    var retVal = true
    if(policyPeriod.Scheme == null){
      return actual
    }
    if(policyPeriod.Scheme.ConditionValue == null){
      setConditionValueFor(policyPeriod.Scheme, policyPeriod)
    }
    retVal = policyPeriod.Scheme.isModifierIncluded(modifierCode, actual)
    if(policyPeriod.SecondaryScheme != null){
      setConditionValueFor(policyPeriod.SecondaryScheme, policyPeriod)
      retVal = policyPeriod.SecondaryScheme.isModifierIncluded(modifierCode, retVal)
    }
    return retVal
  }
  
  /**
   * Update coverage term values
   * @param policyPeriod PolicyPeriod used for the extraction of the Scheme for use
   * @param term The term to update the value for
   */
  public function updateTermValue(policyPeriod : PolicyPeriod, term : gw.api.domain.covterm.CovTerm){
    if(term typeis gw.api.domain.covterm.DirectCovTerm){
      updateDirectTermValue(policyPeriod, term)
    }
    if(term typeis gw.api.domain.covterm.OptionCovTerm){
      updateOptionTermValue(policyPeriod, term)
    }
    if(term typeis gw.api.domain.covterm.GenericCovTerm){
      updateGenericTermValue(policyPeriod, term)
    }
  }
  
  /**
   * Update coverage term values, the clause is searched for terms and passed to the standard term
   * processing function, this saves time in needing to know the codes that have been used in the 
   * configuration of the scheme
   * @param clause The clause to use for the update of the terms
   */
  public function updateTermValue(clause : gw.api.domain.Clause){
    if(clause.PolicyLine.Branch.Scheme != null){
      setConditionValueFor(clause.PolicyLine.Branch.Scheme, clause.OwningCoverable)
      for(term in clause.CovTerms){
        updateTermValue(clause.PolicyLine.Branch.Scheme, term)
      }
    }
    if(clause.PolicyLine.Branch.SecondaryScheme != null){
      setConditionValueFor(clause.PolicyLine.Branch.SecondaryScheme, clause.OwningCoverable)
      for(term in clause.CovTerms){
        updateTermValue(clause.PolicyLine.Branch.SecondaryScheme, term)
      }
    }
  }

  /**
   * Update coverage term values
   * @param scheme Scheme for use
   * @param term The term to update the value for
   */
  private function updateTermValue(scheme : Scheme_Ext, term : gw.api.domain.covterm.CovTerm){
    if(term typeis gw.api.domain.covterm.DirectCovTerm){
      scheme.updateDirectTermValue(term)
      //      updateDirectTermValue(policyPeriod, term)
    }
    if(term typeis gw.api.domain.covterm.OptionCovTerm){
      scheme.updateOptionTermValue(term)
      //      updateOptionTermValue(policyPeriod, term)
    }
    if(term typeis gw.api.domain.covterm.GenericCovTerm){
      scheme.updateGenericTermValue(term)
      //      updateGenericTermValue(policyPeriod, term)
    }
  }

  /**
   * Update the value of a direct term
   * @param policyPeriod PolicyPeriod used for the extraction of the Scheme for use
   * @param term The direct term to update the value for
   */  
  public function updateDirectTermValue(policyPeriod : PolicyPeriod, term : gw.api.domain.covterm.DirectCovTerm){
    if(policyPeriod.Scheme != null){
      if(policyPeriod.Scheme.ConditionValue == null){
        setConditionValueFor(policyPeriod.Scheme, policyPeriod)
      }
      policyPeriod.Scheme.updateDirectTermValue(term)
    }
  }
  
  /**
   * Update the value of an option term
   * @param policyPeriod PolicyPeriod used for the extraction of the Scheme for use
   * @param term The option term to update the value for
   */  
  public function updateOptionTermValue(policyPeriod : PolicyPeriod, term : gw.api.domain.covterm.OptionCovTerm){
    if(policyPeriod.Scheme != null){
      if(policyPeriod.Scheme.ConditionValue == null){
        setConditionValueFor(policyPeriod.Scheme, policyPeriod)
      }
      policyPeriod.Scheme.updateOptionTermValue(term)
    }
  }  
  
  /**
   * Update the value of a generic term
   * @param policyPeriod PolicyPeriod used for the extraction of the Scheme for use
   * @param term The generic term to update the value for
   */  
  public function updateGenericTermValue(policyPeriod : PolicyPeriod, term : gw.api.domain.covterm.GenericCovTerm){
    if(policyPeriod.Scheme != null){
      if(policyPeriod.Scheme.ConditionValue == null){
        setConditionValueFor(policyPeriod.Scheme, policyPeriod)
      }
      policyPeriod.Scheme.updateGenericTermValue(term)
    }
  }

  /**
   * Update the value of condition/exclusion direct term
   * @param policyPeriod PolicyPeriod used for the extraction of the Scheme for use
   * @param term The direct term to update the value for
   */
  public function updateCondExclDirectTermValue(policyPeriod : PolicyPeriod, term : gw.api.domain.covterm.DirectCovTerm){
    if(policyPeriod.Scheme != null){
      policyPeriod.Scheme.updateCondExclDirectTermValue(term)
    }
    if(policyPeriod.SecondaryScheme != null){
      policyPeriod.SecondaryScheme.updateCondExclDirectTermValue(term)
    }
  }

  /**
   * Update the value of condition/exclusion option term
   * @param policyPeriod PolicyPeriod used for the extraction of the Scheme for use
   * @param term The option term to update the value for
   */
  public function updateCondExclOptionTermValue(policyPeriod : PolicyPeriod, term : gw.api.domain.covterm.OptionCovTerm){
    if(policyPeriod.Scheme != null){
      policyPeriod.Scheme.updateCondExclOptionTermValue(term)
    }
    if(policyPeriod.SecondaryScheme != null){
      policyPeriod.SecondaryScheme.updateCondExclOptionTermValue(term)
    }
  }

  /**
   * Update the value of condition/exclusion generic term
   * @param policyPeriod PolicyPeriod used for the extraction of the Scheme for use
   * @param term The generic term to update the value for
   */
  public function updateCondExclGenericTermValue(policyPeriod : PolicyPeriod, term : gw.api.domain.covterm.GenericCovTerm){
    if(policyPeriod.Scheme != null){
      policyPeriod.Scheme.updateCondExclGenericTermValue(term)
    }
    if(policyPeriod.SecondaryScheme != null){
      policyPeriod.SecondaryScheme.updateCondExclGenericTermValue(term)
    }
  }

  /**
   * Bypass validation indicator
   * @param policyPeriod PolicyPeriod used for the extraction of the Scheme for use
   * @param parent The parent object of the comparitor
   * @param comparator The comparitor value to use for the validation bypass
   * @param actual The result required if there is no Scheme override
   */ 
  public function bypassValidation(policyPeriod : PolicyPeriod, parent : String, comparator : String, actual : boolean) : boolean {
    var retVal = false
    if(policyPeriod.Scheme == null){
      return false
    } else {
      if(policyPeriod.Scheme.ConditionValue == null){
        setConditionValueFor(policyPeriod.Scheme, policyPeriod)
      }
      retVal = policyPeriod.Scheme.bypassValidation(parent, comparator, actual)
      if(policyPeriod.SecondaryScheme != null){
        setConditionValueFor(policyPeriod.SecondaryScheme, policyPeriod)
        retVal = policyPeriod.SecondaryScheme.bypassValidation(parent, comparator, retVal)
      }
    }
    return retVal
  }  
  
  /**
   * Bypass validation indicator, this is used when a validation context is supplied as the comparator
   * @param policyPeriod PolicyPeriod used for the extraction of the Scheme for use
   * @param comparator The comparitor value to use for the validation bypass
   * @param actual The result required if there is no Scheme override
   */ 
  public function bypassValidation(policyPeriod : PolicyPeriod, comparator : String, actual : boolean) : boolean {
    var retVal = false
    if(policyPeriod.Scheme == null){
      return false
    } else {
      if(policyPeriod.Scheme.ConditionValue == null){
        setConditionValueFor(policyPeriod.Scheme, policyPeriod)
      }
      retVal = policyPeriod.Scheme.bypassValidation(comparator, actual)
      if(policyPeriod.SecondaryScheme != null){
        setConditionValueFor(policyPeriod.SecondaryScheme, policyPeriod)
        retVal = policyPeriod.SecondaryScheme.bypassValidation(comparator, retVal)
      }
    }
    return retVal
  } 
  
  /**
   * Perform a simple validation on the value of the coverage term
   * @param coverable the coverable where the coverage term is accociated
   * @param term The coverage term to validate
   * @param inValue The value of the coverage term to test 
   */  
  public function validateCoverageTerm(coverable : Coverable, term : gw.api.domain.covterm.DirectCovTerm, inValue : double) : boolean{
    var retVal = true
    if(coverable.PolicyLine.Branch.Scheme == null){
      return retVal
    }
    coverable.PolicyLine.Branch.Scheme.ConditionValue = coverable
    retVal = coverable.PolicyLine.Branch.Scheme.validateCoverageTerm(term, inValue)
    if(coverable.PolicyLine.Branch.SecondaryScheme != null){
      coverable.PolicyLine.Branch.SecondaryScheme.ConditionValue = coverable
      retVal = coverable.PolicyLine.Branch.SecondaryScheme.validateCoverageTerm(term, inValue)
    }
    return retVal
  }

  /**
   * Perform a simple validation on the value of the coverage term
   * @param clause The Clause where the coverage term is accociated
   * @param term The coverage term to validate
   * @param inValue The value of the coverage term to test 
   */  
  public function validateCoverageTerm(clause : gw.api.domain.Clause, term : gw.api.domain.covterm.DirectCovTerm, inValue : double) : boolean{
    var retVal = true
    if(clause.OwningCoverable.PolicyLine.Branch.Scheme == null){
      return retVal
    }
    clause.OwningCoverable.PolicyLine.Branch.Scheme.ConditionValue = clause
    retVal = clause.OwningCoverable.PolicyLine.Branch.Scheme.validateCoverageTerm(term, inValue)

    if(clause.OwningCoverable.PolicyLine.Branch.SecondaryScheme != null){
      clause.OwningCoverable.PolicyLine.Branch.SecondaryScheme.ConditionValue = clause
      retVal = clause.OwningCoverable.PolicyLine.Branch.SecondaryScheme.validateCoverageTerm(term, inValue)
    }
    return retVal
  }
  
  /**
   * Extract the value for the coverage or Cost Category
   * @param comparitorCode The Coverage or Cost Category Code
   * @param policyPeriod PolicyPeriod used for the extraction of the Scheme for use
   * @param type The Scheme detail source type to use 
   */
  public function getRateValue(comparitorCode : String, policyPeriod : PolicyPeriod, type : SchemeSourceType_Ext) : BigDecimal {
    var retVal : BigDecimal
    if(policyPeriod.Scheme == null){
      return null
    }
    if(policyPeriod.Scheme.ConditionValue == null){
      setConditionValueFor(policyPeriod.Scheme, policyPeriod)
    }
    retVal = policyPeriod.Scheme.getRateValue(comparitorCode, type)
    if(policyPeriod.SecondaryScheme != null){
      setConditionValueFor(policyPeriod.SecondaryScheme, policyPeriod)
      retVal = policyPeriod.SecondaryScheme.getRateValue(comparitorCode, type)
    }
    return retVal
  }
  
  /**
   * Extract the value for the coverage or Cost Category
   * @param comparitorCode The Coverage or Cost Category Code
   * @param coverable Coverable to use for the extraction of the scheme
   * @param type The Scheme detail source type to use 
   */
  public function getRateValue(comparitorCode : String, coverable : Coverable, type : SchemeSourceType_Ext) : BigDecimal {
    var retVal : BigDecimal
    if(coverable.PolicyLine.Branch.Scheme == null){
      return null
    }
    setConditionValueFor(coverable.PolicyLine.Branch.Scheme, coverable)
    retVal = getRateValue(comparitorCode, coverable.PolicyLine.Branch, type)
    return retVal
  }

  public function isEligible(policyPeriod: PolicyPeriod, object: Object) : boolean{
    var retVal : boolean
    if(policyPeriod.Scheme == null){
      return true
    }
    setConditionValueFor(policyPeriod.Scheme, object)
    retVal = policyPeriod.Scheme.isEligible(object)
    if(policyPeriod.SecondaryScheme != null){
      setConditionValueFor(policyPeriod.SecondaryScheme, policyPeriod)
      retVal = policyPeriod.SecondaryScheme.isEligible(object)
    }
    return retVal
  }

  public function isEligible(scheme: Scheme_Ext, object: Object) : boolean{
    if(scheme == null){
      return true
    }
    scheme.ConditionValue = object
    return scheme.isEligible(object)
  }

  private function setConditionValueFor(scheme : Scheme_Ext, conditionValue : Object) {
    scheme.ConditionValue = conditionValue
    if (typeof conditionValue == PolicyPeriod){
      scheme.PolicyPeriod = (conditionValue   as PolicyPeriod)
    } else if (typeof conditionValue == PolicyLine){
      scheme.PolicyPeriod = (conditionValue as PolicyLine).Branch
    } else if(typeof conditionValue == Coverable){
      scheme.PolicyPeriod = (conditionValue as Coverable).PolicyLine.Branch
    }
  }

  public function filterTypelist(parent : Object, code : String, policyPeriod : PolicyPeriod, value : String ) : boolean {
    var retVal = true
    if(policyPeriod.EffectiveDatedFields.SchemeLinks.HasElements){
      for(schemeLink in policyPeriod.EffectiveDatedFields.SchemeLinks.orderBy(\elt -> elt.SchemeOrder)){
        if(schemeLink.Scheme.ConditionValue == null){
          setConditionValueFor(schemeLink.Scheme, policyPeriod)
        }
        if(parent != null){
          var objectName = (typeof parent).toString().replaceFirst("entity.","")
          var found = schemeLink.Scheme.filterTypelist(objectName, code)
          if(found.contains(value)){
            retVal = true
          } else {
            retVal = false
          }
        }
      }
    }
    return retVal
  }
}