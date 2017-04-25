package acc.pc.scheme

uses java.util.HashSet
uses java.util.Set

uses acc.pc.scheme.util.SchemeResultBoolean
uses gw.api.database.Query
uses gw.api.productmodel.Product
uses java.lang.Exception
uses gw.api.util.Logger
uses java.lang.Double
uses java.math.BigDecimal
uses java.util.ArrayList

enhancement SchemeEnhancement: Scheme_Ext {
  
  public property get schemeProduct() : Product {
    return gw.api.productmodel.ProductLookup.getByPublicID(this.ProductCode)
  }
  
  public property set schemeProduct(inProduct : Product) {
    this.ProductCode = inProduct.PublicID
  }

  /**
   * Identify of the supplied coverage code is marked to be excluded
   * @param comparisonCode The code used for identification
   * @param actual The result required if there is no Scheme override
   */
  public function isCoverageExcluded(comparisonCode : String, actual : boolean) : boolean {
    var retVal = true
    var detail = detailFind(comparisonCode, SchemeSourceType_Ext.TC_COVERAGE, SchemeActionType_Ext.TC_EXCLUDE)
    if(detail == null){
      retVal = !actual
    }
    if(!evaluate(detail)){
      return !actual
    }
    return retVal
  }

  /**
   * Identify of the supplied coverage code is marked to be included, if there is no explicit inclusion 
   * we search for an exclusion and set the return to false otherwise we use the actual value
   * @param comparisonCode The code used for identification
   * @param actual The result required if there is no Scheme override
   */
  public function isCoverageIncluded(comparisonCode : String, actual : boolean) : boolean {
    var retVal = false
    var detail = detailFind(comparisonCode, SchemeSourceType_Ext.TC_COVERAGE, SchemeActionType_Ext.TC_INCLUDE)
    //
    // If no include check for exclude, if no exclude return actual
    //
    if(detail == null){
      detail = detailFind(comparisonCode, SchemeSourceType_Ext.TC_COVERAGE, SchemeActionType_Ext.TC_EXCLUDE)
      if(detail == null){
        return actual
      }
    }
    //
    // If there is a condition check that it returns true otherwise return actual
    //
    if(!evaluate(detail)){
        return actual
    }
    //
    // If we have an include then retrun true, otherwise we return false as we have an exclude
    //
    if(detail.SchemeActionType == SchemeActionType_Ext.TC_INCLUDE){
        retVal = true
    }
    
    return retVal
  }
  
  /**
   * Returns the Electable value for the coverage
   * @param comparisonCode The code used for identification
   * @param actual The result required if there is no Scheme override
   */
  public function coverageExistence(comparisonCode : String, actual : ExistenceType) : ExistenceType {
    var retVal = actual
    var findResult = detailFind(comparisonCode, SchemeSourceType_Ext.TC_COVERAGE, SchemeActionType_Ext.TC_EXISTENCEREQUIRED)
    if(findResult != null){
      if(!evaluate(findResult)){
        return actual
      }
      retVal = ExistenceType.TC_REQUIRED
      return retVal
    }
    
    findResult = detailFind(comparisonCode, SchemeSourceType_Ext.TC_COVERAGE, SchemeActionType_Ext.TC_EXISTENCESUGGESTED)
    if(findResult != null){
      if(!evaluate(findResult)){
        return actual
      }
      retVal = ExistenceType.TC_SUGGESTED
      return retVal
    }
    
    findResult = detailFind(comparisonCode, SchemeSourceType_Ext.TC_COVERAGE, SchemeActionType_Ext.TC_EXISTENCEELECTABLE)
    if(findResult != null){
      if(!evaluate(findResult)){
        return actual
      }
      retVal = ExistenceType.TC_ELECTABLE
      return retVal
    }    
    
    return retVal
  }  

  /**
   * Identify of the supplied coverage term code is marked to be excluded
   * @param comparisonCode The code used for identification
   * @param actual The result required if there is no Scheme override
   */
  public function isCoverageTermExcluded(comparisonCode : String, actual : boolean) : boolean {
    var retVal = true
    var detail = detailFind(comparisonCode, SchemeSourceType_Ext.TC_COVERAGE, SchemeActionType_Ext.TC_EXCLUDE)
    if(detail == null){
      retVal = !actual
    }
    if(!evaluate(detail)){
      return !actual
    }
    return retVal
  }

  /**
   * Identify of the supplied coverage term code is marked to be included, if there is no explicit inclusion 
   * we search for an exclusion and set the return to false otherwise we use the actual value
   * @param comparisonCode The code used for identification
   * @param actual The result required if there is no Scheme override
   */
  public function isCoverageTermIncluded(comparisonCode : String, actual : boolean) : boolean {
    var retVal = false
    var detail = detailFind(comparisonCode, SchemeSourceType_Ext.TC_COVERAGETERM, SchemeActionType_Ext.TC_INCLUDE)
    if(detail == null){
      detail = detailFind(comparisonCode, SchemeSourceType_Ext.TC_COVERAGETERM, SchemeActionType_Ext.TC_EXCLUDE)
      if(detail == null){
        return actual
      }
    }
    if(!evaluate(detail)){
        return actual
    }
    if(detail.SchemeActionType == SchemeActionType_Ext.TC_INCLUDE){
        retVal = true
    }
    
    return retVal    
  }

  /**
   * Identify of the supplied underwriting issue code is marked to be included, if there is no explicit inclusion 
   * we search for an exclusion and set the return to false otherwise we use the actual value
   * @param comparisonCode The code used for identification
   */
  public function isUWIssueIncluded(comparisonCode : String, actual : boolean) : boolean {
    var retVal = false
    var detail = detailFind(comparisonCode, SchemeSourceType_Ext.TC_UNDERWRITINGISSUE, SchemeActionType_Ext.TC_INCLUDE)
    if(detail == null){
      detail = detailFind(comparisonCode, SchemeSourceType_Ext.TC_UNDERWRITINGISSUE, SchemeActionType_Ext.TC_EXCLUDE)
      if(detail == null){
        return actual
      }
    }
    if(!evaluate(detail)){
        return actual
    }
    if(detail.SchemeActionType == SchemeActionType_Ext.TC_INCLUDE){
        retVal = actual
    }
    return retVal
  }

  /**
   * Identify of the supplied underwriting issue code is marked to be excluded
   * @param comparisonCode The code used for identification
   */
  public function isUWIssueExcluded(comparisonCode : String, actual : boolean) : boolean {
    var retVal = true
    var detail = detailFind(comparisonCode, SchemeSourceType_Ext.TC_UNDERWRITINGISSUE, SchemeActionType_Ext.TC_EXCLUDE)
    if(detail == null){
      return actual
    }
    if(!evaluate(detail)){
      return actual
    }
    return retVal
  }

  /**
   * Identify of the supplied underwriting issue code is marked to be AutoAccepted
   * @param comparisonCode The code used for identification
   */
  public function isUWIssueAutoAccepted(comparisonCode : String, actual : boolean) : boolean {
    var retVal = true
    var detail = detailFind(comparisonCode, SchemeSourceType_Ext.TC_UNDERWRITINGISSUE, SchemeActionType_Ext.TC_AUTOACCEPT)
    if(detail == null){
      return actual
    }
    if(!evaluate(detail)){
      return actual
    }
    return retVal
  }
  
  /**
   * Sets the values that are defined in the Scheme for the provided object, the comparator is the column to set
   * value is the value that will be set and the source type needs to be attribute
   * @param object Object that will have values set based on the Scheme
   */
  public function updateObjectValues(object : Object) {
    updateObjectValues(object, false)
  }

  /**
   * Sets the values that are defined in the Scheme for the provided object, the comparator is the column to set
   * value is the value that will be set and the source type needs to be attribute
   * @param object Object that will have values set based on the Scheme
   * @param storeMetaData if true, metadata about updated fields will be added to object, if it implements SchemeMetaDataHolderExt entity
   */
  public function updateObjectValues(object : Object, storeMetaData: boolean) {
    var entityName = (typeof object).toString().replaceFirst("entity.","")

    var agreementDetails = this.Details.where( \ elt -> elt.ParentCode == entityName
        and elt.SchemeActionType == SchemeActionType_Ext.TC_VALUE
        and elt.SchemeSourceType == SchemeSourceType_Ext.TC_ATTRIBUTE)

    
    var updatedFields = (storeMetaData && object typeis SchemeMetaDataHolder_Ext) ? new HashSet<String>() : null

    for(detail in agreementDetails){
      try{
        if(evaluate(detail)){
          if(object[detail.Comparator] == null or (object[detail.Comparator] != null and detail.ForceValue == true)){
            switch(detail.SchemeValueType){
              case SchemeValueType_Ext.TC_BOOLEAN:
                setFieldValue(object, detail.Comparator, detail.BooleanValue, updatedFields)
                break
              case SchemeValueType_Ext.TC_DATE:
                setFieldValue(object, detail.Comparator, detail.DateValue, updatedFields)
                break
              case SchemeValueType_Ext.TC_DECIMAL:
                setFieldValue(object, detail.Comparator, detail.DecimalValue, updatedFields)
                break
              case SchemeValueType_Ext.TC_INTEGER:
                setFieldValue(object, detail.Comparator, detail.IntegerValue, updatedFields)
                break
              case SchemeValueType_Ext.TC_LONG:
                setFieldValue(object, detail.Comparator, detail.LongValue, updatedFields)
                break
              case SchemeValueType_Ext.TC_MONEY:
                setFieldValue(object, detail.Comparator, detail.MoneyValue, updatedFields)
                break
              case SchemeValueType_Ext.TC_STRING:
                setFieldValue(object, detail.Comparator, detail.StringValue, updatedFields)
                break
/*              case "typekey":
                var typeName = XPathResultCxExt.getXPathValidator(Type.forName("entity." + entityName), detail.ComparatorExt).EntityIProperty.FeatureType.Name
                setFieldValue(object, detail.ComparatorExt, ReflectUtil.coerce(detail.StringValueExt,Type.forName(typeName)), updatedFields)
                break*/
            }
          }
        }
      } catch (e : Exception){
        Logger.logError(e.Message)
      }
    }
    
/*    if (updatedFields.HasElements && object typeis SchemeMetaDataHolderExt) {
      var metaData = object.getSchemeMetaData()
      metaData.addUpdatedFields(updatedFields)
      object.setSchemeMetaData(metaData)
    }*/
    
  }

  private function setFieldValue(object : Object, propName : String, val : Object, updatedFields : Set<String>) {
    object[propName] = val
    if (updatedFields != null) {
      updatedFields.add(propName)
    }
  }

  /**
   * Sets the value of the supplied attribute that are defined in the Scheme for the provided object
   * @param comparisonCode The string name of the attribute to be set, this has to be found in the Scheme
   * @param object Object that will have values set based on the Scheme
   */
  public function updateObjectValues(comparisonCode : String, object : Object){
    var entityName = (typeof object).toString().replaceFirst("entity.","")

    var agreementDetails = this.Details.where( \ elt -> elt.ParentCode == entityName
        and elt.Comparator == comparisonCode
        and elt.SchemeActionType == SchemeActionType_Ext.TC_VALUE
        and elt.SchemeSourceType == SchemeSourceType_Ext.TC_ATTRIBUTE)
    for(detail in agreementDetails){
      if(evaluate(detail)){
        if(object[detail.Comparator] == null or (object[detail.Comparator] != null and detail.ForceValue == true)){
          object[detail.Comparator] = detail.Value
        }
      }
    }
  }

  public function isTermEditable(parentCode : String, comparisonCode : String) : boolean{
    return this.isTermEditable(parentCode, comparisonCode, false)
  }
  
  /**
   * Identify if the value of object is immutable, this is used for UI processing to stop change of the value from the UI
   * @param parentCode The code of the parent object the attribute is associated with
   * @param comparisonCode The code of the attribute to be used
   * @param actual The result desired is immutable is not found
   */
  public function isImmutable(parentCode : String, comparisonCode : String, actual : boolean) : SchemeResultBoolean{
    var retVal = actual
    var detail : SchemeDetail_Ext
    if(parentCode != null){
      detail = detailFind(parentCode,comparisonCode, SchemeSourceType_Ext.TC_ATTRIBUTE, SchemeActionType_Ext.TC_IMMUTABLE)
    } else {
      detail = detailFind(comparisonCode, SchemeSourceType_Ext.TC_ATTRIBUTE, SchemeActionType_Ext.TC_IMMUTABLE)
    }
    if(detail == null){
      return new SchemeResultBoolean(null, actual)
    }
    if(!evaluate(detail)){
      return new SchemeResultBoolean(null, actual)
    }
    return new SchemeResultBoolean(retVal, null)
  }

  /**
   * Identify if the value of object has one of the UI Actions, this is used for UI processing to stop change of the value from the UI
   * @param parentCode The code of the parent object the attribute is associated with
   * @param comparisonCode The code of the attribute to be used
   * @param actual The result desired is immutable is not found
   */
  public function uiAction(parentCode : String, comparisonCode : String, actual : boolean, inUIActions : SchemeActionType_Ext[]) : SchemeResultBoolean{
    var retVal = false
    var detail : SchemeDetail_Ext
    if(parentCode != null){
      for(uiAction in inUIActions) {
        detail = detailFind(parentCode, comparisonCode, SchemeSourceType_Ext.TC_ATTRIBUTE, uiAction)
        if(detail != null){
          if({SchemeActionType_Ext.TC_VISIBLE, SchemeActionType_Ext.TC_AVAILABLE, SchemeActionType_Ext.TC_REQUIRED}.contains(uiAction)){
            retVal = true
          }
          break
        }
      }
    } else {
      for(uiAction in inUIActions) {
        detail = detailFind(comparisonCode, SchemeSourceType_Ext.TC_ATTRIBUTE, uiAction)
        if(detail != null){
          if({SchemeActionType_Ext.TC_VISIBLE, SchemeActionType_Ext.TC_AVAILABLE, SchemeActionType_Ext.TC_REQUIRED}.contains(uiAction)){
            retVal = true
          }
          break
        }
      }
    }
    if(detail == null){
      return new SchemeResultBoolean(null, actual)
    }
    if(!evaluate(detail)){
      return new SchemeResultBoolean(null, actual)
    }
    return new SchemeResultBoolean(retVal, null)
  }

  public function isTermEditable(parentCode : String, comparisonCode : String, actual : boolean) : boolean{
    var retVal = false
    var detail : SchemeDetail_Ext
    if(parentCode != null){
      detail = detailFind(parentCode,comparisonCode, SchemeSourceType_Ext.TC_COVERAGETERM, SchemeActionType_Ext.TC_IMMUTABLE)
    } else {
      detail = detailFind(comparisonCode, SchemeSourceType_Ext.TC_COVERAGETERM, SchemeActionType_Ext.TC_IMMUTABLE)
    }
    if(detail == null){
      return actual
    }
    if(!evaluate(detail)){
      return actual
    }
    return retVal
  }

  /**
   * Identify of the supplied condition code is marked to be excluded
   * @param comparisonCode The code used for identification
   * @param actual The result required if there is no Scheme override
   */
  public function isConditionExcluded(comparisonCode : String, actual : boolean) : boolean {
    var retVal = true
    var detail = detailFind(comparisonCode, SchemeSourceType_Ext.TC_COVERAGE, SchemeActionType_Ext.TC_EXCLUDE)
    if(detail == null){
      return actual
    }
    if(!evaluate(detail)){
      return actual
    }
    return retVal
  }

  /**
   * Identify of the supplied exclusion code is marked to be excluded
   * @param comparisonCode The code used for identification
   * @param actual The result required if there is no Scheme override
   */
  public function isExclusionExcluded(comparisonCode : String, actual : boolean) : boolean {
    var retVal = true
    var detail = detailFind(comparisonCode, SchemeSourceType_Ext.TC_EXCLUSION, SchemeActionType_Ext.TC_EXCLUDE)
    if(detail == null){
      return actual
    }
    if(!evaluate(detail)){
      return actual
    }
    return retVal
  }

  /**
   * Identify of the supplied modifier code is marked to be excluded
   * @param comparisonCode The code used for identification
   * @param actual The result required if there is no Scheme override
   */
  public function isModifierExcluded(comparisonCode : String, actual : boolean) : boolean {
    var retVal = true
    var detail = detailFind(comparisonCode, SchemeSourceType_Ext.TC_MODIFIER, SchemeActionType_Ext.TC_EXCLUDE)
    if(detail == null){
      return actual
    }
    if(!evaluate(detail)){
      return actual
    }
    return retVal
  }


  /**
   * Identify of the supplied condition code is marked to be included, if there is no explicit inclusion 
   * we search for an exclusion and set the return to false otherwise we use the actual value
   * @param comparisonCode The code used for identification
   * @param actual The result required if there is no Scheme override
   */
  public function isConditionIncluded(comparisonCode : String, actual : boolean) : boolean {
    var retVal = false
    var detail = detailFind(comparisonCode, SchemeSourceType_Ext.TC_CONDITION, SchemeActionType_Ext.TC_INCLUDE)
    
    if(detail == null){
      detail = detailFind(comparisonCode, SchemeSourceType_Ext.TC_CONDITION, SchemeActionType_Ext.TC_EXCLUDE)
      if(detail == null){
        return actual
      }
    }
    if(!evaluate(detail)){
        return actual
    }
    if(detail.SchemeActionType == SchemeActionType_Ext.TC_INCLUDE){
        retVal = true
    }
    
    return retVal
  }

  /**
   * Identify of the supplied exclusion code is marked to be included, if there is no explicit inclusion 
   * we search for an exclusion and set the return to false otherwise we use the actual value
   * @param comparisonCode The code used for identification
   * @param actual The result required if there is no Scheme override
   */
  public function isExclusionIncluded(comparisonCode : String, actual : boolean) : boolean {
    var retVal = false
    var detail = detailFind(comparisonCode, SchemeSourceType_Ext.TC_EXCLUSION, SchemeActionType_Ext.TC_INCLUDE)
    
    if(detail == null){
      detail = detailFind(comparisonCode, SchemeSourceType_Ext.TC_EXCLUSION, SchemeActionType_Ext.TC_EXCLUDE)
      if(detail == null){
        return actual
      }
    }
    if(!evaluate(detail)){
        return actual
    }
    if(detail.SchemeActionType == SchemeActionType_Ext.TC_INCLUDE){
        retVal = true
    }
    
    return retVal    
  }

  /**
   * Identify of the supplied modifier code is marked to be included, if there is no explicit inclusion 
   * we search for an exclusion and set the return to false otherwise we use the actual value
   * @param comparisonCode The code used for identification
   * @param actual The result required if there is no Scheme override
   */
  public function isModifierIncluded(comparisonCode : String, actual : boolean) : boolean {
    var retVal = false
    var detail = detailFind(comparisonCode, SchemeSourceType_Ext.TC_MODIFIER, SchemeActionType_Ext.TC_INCLUDE)
    
    if(detail == null){
      detail = detailFind(comparisonCode, SchemeSourceType_Ext.TC_MODIFIER, SchemeActionType_Ext.TC_EXCLUDE)
      if(detail == null){
        return actual
      }
    }
    if(!evaluate(detail)){
        return actual
    }
    if(detail.SchemeActionType == SchemeActionType_Ext.TC_INCLUDE){
        retVal = true
    }
    
    return retVal  
  }

  /**
   * Function checks is scheme contains details for given source type
   * @param source typekey for the source type
   */
  public function schemeSourceTypeExists(source : SchemeSourceType_Ext) : boolean {
    return this.Details.hasMatch(\ s -> s.SchemeSourceType == source)
  }

  /**
   * Function to find a match in the Scheme Details of the current Scheme
   * @param comparisonCode The code used for identification
   * @param source typekey for the source type
   * @param action typekey to the action
   */
  private function detailFind(comparisonCode : String, source : SchemeSourceType_Ext, action : SchemeActionType_Ext) : SchemeDetail_Ext {
    var retVal  : SchemeDetail_Ext
    var details : SchemeDetail_Ext[]
    details = this.Details.where(\ elt1 -> elt1.Comparator == comparisonCode
        and elt1.SchemeSourceType == source
        and elt1.SchemeActionType == action)
    if(details.HasElements){
      retVal = details.firstWhere(\ s -> evaluate(s))
    }
    return retVal
  }

  private function detailFind(parentCode : String, source : SchemeSourceType_Ext) : SchemeDetail_Ext[] {
    var details : SchemeDetail_Ext[]
    details = this.Details.where(\ elt1 -> elt1.ParentCode == parentCode
        and elt1.SchemeSourceType == source)
    return details
  }

  /**
   * Function to find a match in the Scheme Details of the current Scheme
   * @param parent The parent of the comparitor
   * @param comparisonCode The code used for identification
   * @param source typekey for the source type
   * @param action typekey to the action
   */
  private function detailFind(parent : String, comparisonCode : String, source : SchemeSourceType_Ext, action : SchemeActionType_Ext) : SchemeDetail_Ext {
    var retVal  : SchemeDetail_Ext
    var details : SchemeDetail_Ext[]
    details = this.Details.where(\ elt1 -> elt1.Comparator == comparisonCode
        and elt1.ParentCode == parent
        and elt1.SchemeSourceType == source
        and elt1.SchemeActionType == action)
    if(details.HasElements){
      retVal = details.firstWhere(\ s -> evaluate(s))
    }
    return retVal
  }

  /**
   * Function to find a match in the Scheme Details of the current Scheme
   * @param source typekey for the source type
   * @param action typekey to the action
   */
  private function detailsFind(source : SchemeSourceType_Ext, action : SchemeActionType_Ext) : SchemeDetail_Ext[] {
    return this.Details.where(\ elt1 -> elt1.SchemeSourceType == source and elt1.SchemeActionType == action)
  }

  /**
   * Function to find a match in the Scheme Details of the current Scheme
   * @param comparisonCode The code used for identification
   * @param source typekey for the source type
   * @param action typekey to the action
   */
  private function condExclTermdetailFind(comparisonCode : String, action : SchemeActionType_Ext) : SchemeDetail_Ext {
    var detail : SchemeDetail_Ext
    detail = this.Details.firstWhere(\ elt1 -> elt1.Comparator == comparisonCode
        and elt1.SchemeActionType == action)
    return detail
  }
    
  /**
   * Update the value of a direct term
   * @param term The direct term to update the value for
   */
  public function updateDirectTermValue(term : gw.api.domain.covterm.DirectCovTerm){
    var detail = detailFind(term.PatternCode, SchemeSourceType_Ext.TC_COVERAGETERM, SchemeActionType_Ext.TC_VALUE)
    if(detail != null && evaluate(detail)){
      term.setValueFromString(detail.Value.toString())
    }
  }
  
  /**
   * Update the value of an option term
   * @param term The option term to update the value for
   */
  public function updateOptionTermValue(term : gw.api.domain.covterm.OptionCovTerm){
    var detail = detailFind(term.PatternCode, SchemeSourceType_Ext.TC_COVERAGETERM, SchemeActionType_Ext.TC_VALUE)
    if(detail != null and evaluate(detail)){
      term.setValueFromString(detail.Value.toString())
    }
  }  
  
  /**
   * Update the value of a generic term
   * @param term The generic term to update the value for
   */
  public function updateGenericTermValue(term : gw.api.domain.covterm.GenericCovTerm){
    var detail = detailFind(term.PatternCode, SchemeSourceType_Ext.TC_COVERAGETERM, SchemeActionType_Ext.TC_VALUE)
    if(detail != null and evaluate(detail)){
      term.setValueFromString(detail.Value.toString())
    }
  }

  /**
   * Update the value of a direct term for conditions/exclusions cov terms
   * @param term The direct term to update the value for
   */
  public function updateCondExclDirectTermValue(term : gw.api.domain.covterm.DirectCovTerm){
    var detail = condExclTermdetailFind(term.PatternCode, SchemeActionType_Ext.TC_VALUE)
    if(detail != null){
      term.setValueFromString(detail.Value.toString())
    }
  }

  /**
   * Update the value of an option term for conditions/exclusions cov terms
   * @param term The option term to update the value for
   */
  public function updateCondExclOptionTermValue(term : gw.api.domain.covterm.OptionCovTerm){
    var detail = condExclTermdetailFind(term.PatternCode, SchemeActionType_Ext.TC_VALUE)
    if(detail != null){
      term.setValueFromString(detail.Value.toString())
    }
  }

  /**
   * Update the value of a generic term for conditions/exclusions cov terms
   * @param term The option term to update the value for
   */
  public function updateCondExclGenericTermValue(term : gw.api.domain.covterm.GenericCovTerm){
    var detail = condExclTermdetailFind(term.PatternCode, SchemeActionType_Ext.TC_VALUE)
    if(detail != null){
      term.setValueFromString(detail.Value.toString())
    }
  }

  /**
   * Function to decide if the term validation needs to be bypassed
   * @param parent The parent used in the selection of the detail
   * @param comparator The code used for identification
   * @param actual The result required if there is no Scheme override
   */
  public function bypassValidation(parent : String, comparator : String, actual : boolean) : boolean {
    var retVal = true
    var detail = detailFind(parent, comparator, SchemeSourceType_Ext.TC_COVERAGETERM, SchemeActionType_Ext.TC_BYPASSVALIDATION)
    if(detail == null){
      retVal = actual
    }
    if(!evaluate(detail)){
      return actual
    }
    return retVal
  }  
  
  /**
   * Function to decide if the term validation needs to be bypassed, this is used where a context is given for
   * the validation
   * @param comparator The code used for identification
   * @param actual The result required if there is no Scheme override
   */
  public function bypassValidation(comparator : String, actual : boolean) : boolean {
    var retVal = true
    var detail = detailFind(comparator, SchemeSourceType_Ext.TC_VALIDATIONCONTEXT ,SchemeActionType_Ext.TC_BYPASSVALIDATION)
    if(detail == null){
      retVal = actual
    }
    if(!evaluate(detail)){
      return actual
    }
    return retVal
  }

  /**
   * Identify if the value of object is required, this is used for UI processing
   * @param parentCode The code of the parent object the attribute is associated with
   * @param comparisonCode The code of the attribute to be used
   * @param actual The result desired is immutable is not found
   */
  public function isAttributeRequired(parentCode : String, comparisonCode : String, actual : boolean) : SchemeResultBoolean{
    var retVal = true
    var detail : SchemeDetail_Ext
    if(parentCode != null){
      detail = detailFind(parentCode,comparisonCode, SchemeSourceType_Ext.TC_ATTRIBUTE, SchemeActionType_Ext.TC_REQUIRED)
    } else {
      detail = detailFind(comparisonCode, SchemeSourceType_Ext.TC_ATTRIBUTE, SchemeActionType_Ext.TC_REQUIRED)
    }
    if(detail == null){
      return new SchemeResultBoolean(null,actual)
    }
    if(!evaluate(detail)){
      return new SchemeResultBoolean(null,actual)
    }
    return new SchemeResultBoolean(retVal,null)
  }

  /**
   * Validate that a change to a coverage term direct value is permitted under the scheme,
   * this function return a true or false to indicate if the change is permitted, if there is 
   * any conditional logic against the coverage term this is evaluated to see if the term is still value
   * @param term The coverage term to enquire on
   * @param inValue the changed value to be checked
   */
  public function validateCoverageTerm(term : gw.api.domain.covterm.DirectCovTerm, inValue : Double) : boolean {
    var retVal = true
    var detail = detailFind(term.PatternCode, SchemeSourceType_Ext.TC_COVERAGETERM, SchemeActionType_Ext.TC_VALUE)
    
    if(evaluate(detail) == true){
      switch (detail.SchemeValueType) {
        case SchemeValueType_Ext.TC_DECIMAL:
          retVal = compare(new Double((detail.Value as double)), inValue, detail.SchemeValidationType)
          break
      }
    }
    return retVal
  }
  
  /**
   * Extract the value for the coverage or Cost Category
   * @param comparitorCode The Coverage or Cost Category Code
   * @param policyPeriod PolicyPeriod used for the extraction of the Scheme for use
   * @param type The Scheme detail source type to use 
   */
  public function getRateValue(comparitorCode : String, type : SchemeSourceType_Ext) : BigDecimal {
    var retVal : BigDecimal = 0
    var detail = detailFind(comparitorCode, type, SchemeActionType_Ext.TC_VALUE)
    if(detail != null){
      if(evaluate(detail) == true){
        switch (detail.SchemeValueType) {
          case SchemeValueType_Ext.TC_DECIMAL:
            retVal = detail.DecimalValue
            break
          case SchemeValueType_Ext.TC_MONEY:
              retVal = detail.MoneyValue
              break
          case SchemeValueType_Ext.TC_INTEGER:
              retVal = detail.IntegerValue
              break
        }
      }    
    }
    return retVal
  }
    
  /**
   * Comparison of double values based on the validation type
   * @param origValue The value that was originaly set in the scheme
   * @param newValue the vchanged value
   * @param type The type of check to be done
   */
  private function compare(origValue : Double, newValue : Double, type : SchemeValidationType_Ext) : boolean {
    var retVal = true
    var compareResult = origValue.compareTo(newValue)
    switch(type){
      case SchemeValidationType_Ext.TC_EXACTLY:
        if(compareResult != 0){
          retVal = false
        }
        break
      case SchemeValidationType_Ext.TC_ATLEAST:
        if(compareResult > 0){
          retVal = false
        }
        break
      case SchemeValidationType_Ext.TC_ATMOST:
        if(compareResult < 0){
          retVal = false
        }
        break 
    }
    return retVal
  }

  private function evaluate(detail : SchemeDetail_Ext) : boolean {
    var condition = true
    var usesList  = "uses java.util.Date \n"
        + "uses java.math.BigDecimal \n"
        + "uses java.lang.Integer \n"
        + "uses java.lang.Long \n"
    //
    // If there is a condition check that it returns true otherwise return actual
    //
    if(detail.Condition != null){
      if(!detail.Condition.startsWithIgnoreCase("@Private")){
//        if(typeof this.ConditionValue == Type.forName("entity."+detail.SchemeCondition.Root) or typeof this.ConditionValue == Type.forName(detail.SchemeCondition.Root)){
        if(typeof this.ConditionValue == Type.forName("entity."+detail.SchemeCondition.Root)){
          detail.ConditionValue = this.ConditionValue
          var evalCondition = usesList + detail.Condition.replace("VALUE", "detail.ConditionValue").replace("ROOT", detail.SchemeCondition.Root)
          condition = eval(evalCondition) as boolean
        }
      } else {
        detail.ConditionValue = this.ConditionValue
        var evalCondition = usesList + detail.Condition. replace("@Private", "")
        condition = eval(evalCondition) as boolean
      }
    }
    return condition
  }
  
  public property get SchemeSearchLink(): SchemeSearchLink_Ext{
    var schemeLink = Query.make(SchemeSearchLink_Ext).compare("SchemeExt", Equals, this).select().AtMostOneRow
    return schemeLink
  }

  /**
   * Returns a list of array values for the attribute and and empty list if there are not array values
   * @param parentCode The parent or root object type
   * @param comparitorCode The attribute to lookup
   */
  public function arrayValues<T>(parentCode : String, comparitorCode : String, valueType : SchemeValueType_Ext) : List<T> {
    var retVal = new ArrayList<T>()
    var detail = detailFind(parentCode, comparitorCode, SchemeSourceType_Ext.TC_ATTRIBUTE, SchemeActionType_Ext.TC_ARRAY)
    if(detail != null){
      switch(valueType){
        case SchemeValueType_Ext.TC_STRING:
            (detail.SchemeDetailArrayValues*.StringValue).toList().each(\ s -> retVal.add(s as T))
            break
        case SchemeValueType_Ext.TC_BOOLEAN:
            (detail.SchemeDetailArrayValues*.BooleanValue).toList().each(\ s -> retVal.add(s as T))
            break
        case SchemeValueType_Ext.TC_DATE:
            (detail.SchemeDetailArrayValues*.DateValue).toList().each(\ s -> retVal.add(s as T))
            break
        case SchemeValueType_Ext.TC_DECIMAL:
            (detail.SchemeDetailArrayValues*.DecimalValue).toList().each(\ s -> retVal.add(s as T))
            break
        case SchemeValueType_Ext.TC_INTEGER:
            (detail.SchemeDetailArrayValues*.IntegerValue).toList().each(\ s -> retVal.add(s as T))
            break
        case SchemeValueType_Ext.TC_LONG:
            (detail.SchemeDetailArrayValues*.LongValue).toList().each(\ s -> retVal.add(s as T))
            break
/*        case "typekey":
            var stringValues = detail.SchemeDetailArrayValuesExt*.StringValueExt
            try{
              var entityName = parentCode.toString().replaceFirst("entity.","")
              var typeListName = XPathResultCxExt.getXPathValidator(Type.forName("entity." + entityName), comparitorCode).EntityIProperty.FeatureType.Name
              var typeList = TypeSystem.getByFullName(typeListName) as ITypeList
              stringValues.each(\ s -> retVal.add((typeList.getTypeKey(s) as T)) )
            } catch (e : Exception){
            }
            break*/
      }
    }
    return retVal
  }

  public function isEligible(object: Object) : boolean {
    var retVal = true
    var fullName = (typeof object).Name
    var name = fullName.replaceFirst("entity.", "")
    var details = detailFind(name, SchemeSourceType_Ext.TC_ELIGIBILITY)
    if(details.HasElements){
      retVal = details.where(\ s -> evaluate(s)).Count == details.Count
    }
    return retVal
  }

  public function filterTypelist(parent : String, code : String) : List<String> {
    var retVal = new ArrayList<String>()
    var details = detailsFind(SchemeSourceType_Ext.TC_ATTRIBUTE, SchemeActionType_Ext.TC_TYPELISTFILTER)
    if(details.HasElements){
      details.where(\elt -> elt.ParentCode == parent and elt.Comparator == code).each(\elt -> {
        retVal.add(elt.StringValue)
      })

    }
    return retVal
  }
}
