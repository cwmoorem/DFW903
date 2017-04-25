package acc.pc.scheme.pageprocess

uses java.util.ArrayList
uses gw.api.database.Query
uses acc.pc.scheme.copier.SchemeCopier
uses acc.pc.scheme.copier.SchemeDetailCopier
uses gw.api.util.DisplayableException
uses acc.pc.scheme.server.SchemeTableWrapper

class SchemeDetailPageProcess {
  
  private var _scheme               : Scheme_Ext                 as scheme
  private var _sourceScheme         : Scheme_Ext                 as isourceScheme
  private var _remove               : boolean                    as remove
  private var _searches             : ArrayList<LocalSearch>     as searches
  private var _searchLink           : SchemeSearchLink_Ext       as searchLink
  private var _cloneDetail          : SchemeDetailWrapper        as cloneDetail
  private var _location             : pcf.api.Location
  private var _coverages            : LocalCoverage[]            as coverages
  private var _conditions           : LocalCondition[]           as conditions
  private var _exclusions           : LocalExclusion[]           as exclusions
  private var _modifiers            : LocalModifier[]            as modifiers
  private var _issues               : LocalIssue[]               as issues
  private var _coverageRates        : LocalCoverageRate[]        as coverageRates
  private var _costCategoryRates    : LocalCostCategoryRate[]    as costCategoryRates
  private var _schemeDetailWrappers : List<SchemeDetailWrapper>  as schemeDetailWrappers

  class SchemeDetailWrapper {
    private var _schemeDetail          : SchemeDetail_Ext as schemeDetail
    private var _localCoverage         : LocalCoverage
    private var _localCoverageTerm     : LocalCoverageTerm
    private var _localCondition        : LocalCondition
    private var _localExclusion        : LocalExclusion
    private var _localModifier         : LocalModifier
    private var _localIssue            : LocalIssue
    private var _localCoverageRate     : LocalCoverageRate
    private var _localCostCategoryRate : LocalCostCategoryRate
    private var _localPcf              : LocalPcf
    
    public property get localCoverageRate() : LocalCoverageRate {
      return _localCoverageRate
    }
    
    public property set localCoverageRate(inCoverageRate : LocalCoverageRate){
      _localCoverageRate = inCoverageRate
      if(_schemeDetail != null and _schemeDetail.SchemeSourceType == SchemeSourceType_Ext.TC_RATECOVERAGE){
        _schemeDetail.Comparator = inCoverageRate._code
      }
    }
    
    public property get localCostCategoryRate() : LocalCostCategoryRate {
      return _localCostCategoryRate
    }
    
    public property set localCostCategoryRate(inCostCategoryRate : LocalCostCategoryRate){
      _localCostCategoryRate = inCostCategoryRate
      if(_schemeDetail != null and _schemeDetail.SchemeSourceType == SchemeSourceType_Ext.TC_RATECOSTCATEGORY){
        _schemeDetail.Comparator = inCostCategoryRate._code
      }
    }    

    public property set localCoverage(inCoverage : LocalCoverage){
      _localCoverage = inCoverage
      if(_schemeDetail != null and _schemeDetail.SchemeSourceType == SchemeSourceType_Ext.TC_COVERAGE){
        _schemeDetail.Comparator = inCoverage.code
      }
      if(_schemeDetail != null and _schemeDetail.SchemeSourceType == SchemeSourceType_Ext.TC_COVERAGETERM){
        _schemeDetail.ParentCode = inCoverage.code
      }
    }
    
    public property get localCoverage() : LocalCoverage {
      return _localCoverage
    }
    
    
    public property set localCoverageTerm(inCoverageTerm : LocalCoverageTerm){
      _localCoverageTerm = inCoverageTerm
      if(_schemeDetail != null and _schemeDetail.SchemeSourceType == SchemeSourceType_Ext.TC_COVERAGETERM){
        _schemeDetail.Comparator = inCoverageTerm.code
      }
    }
    
    public property get localCoverageTerm() : LocalCoverageTerm {
      return _localCoverageTerm
    }
    
    public property set localCondition(inCondition : LocalCondition){
      _localCondition = inCondition
      if(_schemeDetail != null and _schemeDetail.SchemeSourceType == SchemeSourceType_Ext.TC_CONDITION){
        _schemeDetail.Comparator = inCondition.code
      }
    }
    
    public property get localCondition() : LocalCondition {
      return _localCondition
    }  
    
    public property set localExclusion(inExclusion : LocalExclusion){
      _localExclusion = inExclusion
      if(_schemeDetail != null and _schemeDetail.SchemeSourceType == SchemeSourceType_Ext.TC_EXCLUSION){
        _schemeDetail.Comparator = inExclusion.code
      }
    }
    
    public property get localExclusion() : LocalExclusion {
      return _localExclusion
    }  
    
    public property set localModifier(inModifier : LocalModifier){
      _localModifier = inModifier
      if(_schemeDetail != null and _schemeDetail.SchemeSourceType == SchemeSourceType_Ext.TC_MODIFIER){
        _schemeDetail.Comparator = inModifier.code
      }
    }
    
    public property get localModifier() : LocalModifier {
      return _localModifier
    } 
    
    public property set localIssue(inIssue : LocalIssue){
      _localIssue = inIssue
      if(_schemeDetail != null and _schemeDetail.SchemeSourceType == SchemeSourceType_Ext.TC_UNDERWRITINGISSUE){
        _schemeDetail.Comparator = inIssue.code
      }
    }
    
    public property get localIssue() : LocalIssue {
      return _localIssue
    }

    public property get localPcf() : LocalPcf {
      return _localPcf
    }

    public property set localPcf(inPcf : LocalPcf){
      _localPcf = inPcf
      if(_schemeDetail != null and _schemeDetail.SchemeSourceType == SchemeSourceType_Ext.TC_PCF){
        _schemeDetail.Comparator = inPcf.code
      }
    }
  }
  
  class LocalCoverage {
    private var _code  : String              as code
    private var _name  : String              as name
    private var _terms : LocalCoverageTerm[] as terms
  }
  
  class LocalCoverageTerm {
    private var _code : String as code
    private var _name : String as name
  }
  
  class LocalCondition {
    private var _code  : String              as code
    private var _name  : String              as name
  }
  
  class LocalExclusion {
    private var _code  : String              as code
    private var _name  : String              as name
  }
  
  class LocalModifier {
    private var _code  : String              as code
    private var _name  : String              as name
  }
  
  class LocalIssue {
    private var _code  : String              as code
    private var _name  : String              as name
  }

  class LocalCoverageRate {
    private var _code  : String      as code
    private var _name  : String      as name
  }
  
  class LocalCostCategoryRate {
    private var _code  : String      as code
    private var _name  : String      as name
  }

  class LocalPcf {
    private var _code  : String      as code
    private var _name  : String      as name
  }
  
  /**
   * Inner class containing the information needed to manage the search 
   */
  class LocalSearch {
    private var _value      : String              as value
    private var _key        : SchemeSearchKey_Ext  as key
    private var _localRemove: boolean             as localRemove
    private var _search     : SchemeSearch_Ext     as search
  }

  construct(inScheme : Scheme_Ext, inLocation : pcf.api.Location, isCopy : boolean) {
    if(isCopy) {
      var newScheme : Scheme_Ext = new Scheme_Ext()
      new SchemeCopier(inScheme).copy(newScheme)
      newScheme.Name += " - Copy"
      var newCode = (inScheme.Code)
      if(newCode.length > 23){
        newCode = newCode.substring(0,23)
      }
      newScheme.Code = newCode + " - Copy"
      init(newScheme, inLocation)
    }
    else {
      init(inScheme, inLocation)
    }
  }
  
  /**
   * Initalisation code
   */
  private function init(inScheme : Scheme_Ext, inLocation : pcf.api.Location) {
    _sourceScheme = inScheme
    _location = inLocation
    if(inScheme == null){
      _scheme = new Scheme_Ext()
    } else {
      _scheme = inScheme
    }
    findSearches()
    loadCoverages()
    loadConditions()
    loadExclusions()
    loadModifiers()
    loadIssues()
    loadCostCategory()
    populateSchemeDetailWrapper()
  }
  
  /**
   * Create a list of available products to assign to a scheme
   */  
  public function availableProducts() : List<gw.api.productmodel.Product> {
   return gw.api.productmodel.ProductLookup.getAll().sortBy(\ p -> p.DisplayName )
  }
  
  /**
   * Function to add new detail row to the scheme
   * @paramm scheme Scheme to add the detail to
   */
  public function addDetail(inType : SchemeSourceType_Ext) : SchemeDetailWrapper{
    var schemeDetail = new SchemeDetail_Ext(scheme)
    var wrapper = new SchemeDetailWrapper()
    wrapper.schemeDetail = schemeDetail
    schemeDetailWrappers.add(wrapper)
    schemeDetail.Scheme = scheme
    schemeDetail.SchemeSourceType = inType
    scheme.addToDetails(schemeDetail)
//    switch(inType){
//      case SchemeSourceType_Ext.TC_ATTRIBUTE:
//        schemeDetail.SchemeSourceType_Ext = inType
//    }
    return wrapper
  } 
  
  /**
   * Create a list of action types that are applicable for the given source type
   * @param insource The source to use to determine the available actions
   */
  public function schemeActionTypes(insource : SchemeSourceType_Ext) : SchemeActionType_Ext[] {
    var retVal = new ArrayList<SchemeActionType_Ext>()
    if(insource != null){
      retVal.addAll(SchemeActionType_Ext.getTypeKeys(false).where(\ s -> s.hasCategory(insource)))
    }
    return retVal.toTypedArray()
  }   
  
  public function allSchemes() : List<Scheme_Ext> {
    return Query.make(Scheme_Ext).select().toList()
  }
  
  public function allProducers() : List<ProducerCode>{
    return Query.make(ProducerCode).select().toList()
  }
  
  public function addSchemeProducer() : SchemeProducer_Ext {
    var newProducer = new SchemeProducer_Ext(_scheme)
    newProducer.Scheme = _scheme
    _scheme.addToProducers(newProducer)
    return newProducer
  }
  
  /**
   * Create a clone of a scheme detail row
   * @param inDetail The detail row to clone
   */
  public function cloneDetail(inDetail : SchemeDetailWrapper) : SchemeDetailWrapper{
    var clone = addDetail(inDetail.schemeDetail.SchemeSourceType)
    new SchemeDetailCopier(inDetail.schemeDetail).copy(clone.schemeDetail)
    clone.localCoverage = inDetail.localCoverage
    clone.localCoverageTerm = inDetail.localCoverageTerm
    clone.localCondition = inDetail.localCondition
    clone.localExclusion = inDetail.localExclusion
    clone.localModifier = inDetail.localModifier
    clone.localIssue = inDetail.localIssue
    cloneDetail = clone
    gw.api.web.PebblesUtil.invalidateIterators(_location,SchemeDetail_Ext)
    return clone
  }
  
  /**
   * Function used to indicate the last cloned detail, this is used on the UI as finding
   * the last cloned detail could be difficult
   * @param inDetail The detail row to compare to the cloned row
   */
  public function indicateClone(inDetail : SchemeDetailWrapper) : String {
    var retVal = ""
    if(_cloneDetail === inDetail){
      retVal = "**"
    }
    return retVal
  }
  
  /**
   * Remove the current scheme
   */
  public function removeScheme(){
    _scheme.remove()
    gw.transaction.Transaction.getCurrent().commit()
    pcf.Scheme.push()
  }
  
  public function findSearches(){
    searches = new ArrayList<LocalSearch>()
    var bundle = gw.transaction.Transaction.getCurrent()
    var query = Query.make(SchemeSearchLink_Ext).compare("Scheme", Equals, _scheme).select()
    _searchLink = query.FirstResult
    bundle.add(_searchLink)
    for(foundsearch in query.toTypedArray()){
      foundsearch.SchemeSearches.each(\ s -> {
        var newLocalSearch = new LocalSearch()
        newLocalSearch.key = s.SerachKey
        newLocalSearch.value = s.Value
        newLocalSearch.search = s 
        newLocalSearch.localRemove = false
        _searches.add(newLocalSearch)
        bundle.add(s)
      })
    }
  }
  
  /**
   * Add a new search key value pair
   */
  public function addLocalSearch() : LocalSearch {
    var retVal = new LocalSearch()
    searches.add(retVal)
    return retVal
  }
  
  /**
   * Mark the search item for removal
   * @param inLocalSearch The item to be marked for removal
   */
  public function removeLocalSearch(inLocalSearch : LocalSearch){
    inLocalSearch.localRemove = true
  }
  
  /**
   * Function called before commit
   * Updates Scheme Searches and normalizes line endings(to LF) in multi line fields
   */
   public function beforeCommit(){
     updateSearches()
     updateEligibility()
     //normalize line endings
     if(scheme.Description!=null) scheme.Description = scheme.Description.replaceAll("\\r", "")
   }

  private function updateEligibility(){
    var eleDetails = scheme.Details.where( \ elt -> elt.SchemeSourceType == SchemeSourceType_Ext.TC_ELIGIBILITY)
    for(eachDetail in eleDetails){
      var condition = "@Private"

      condition = condition + "(detail.ConditionValue  as ${eachDetail.ParentCode}).${eachDetail.Comparator} "
      switch(eachDetail.SchemeOperatorType){
        case SchemeOperatorType_Ext.TC_EQUALS:
          condition = condition + "=="
          break
        case SchemeOperatorType_Ext.TC_GREATERTHAN:
          condition = condition + ">"
          break
        case SchemeOperatorType_Ext.TC_LESSTHAN:
          condition = condition + "<"
          break
      }
      switch(eachDetail.SchemeValueType){
        case SchemeValueType_Ext.TC_INTEGER:
          condition = condition + " " + eachDetail.IntegerValue
          break
        case SchemeValueType_Ext.TC_STRING:
            condition = condition + " " + eachDetail.StringValue
            break
        case SchemeValueType_Ext.TC_BOOLEAN:
            condition = condition + " " + eachDetail.BooleanValue
            break
        case SchemeValueType_Ext.TC_DATE:
          condition = condition + " " + eachDetail.DateValue
          break
        case SchemeValueType_Ext.TC_DECIMAL:
            condition = condition + " " + eachDetail.DecimalValue
            break
        case SchemeValueType_Ext.TC_LONG:
            condition = condition + " " + eachDetail.LongValue
            break
        case SchemeValueType_Ext.TC_MONEY:
            condition = condition + " " + eachDetail.MoneyValue
            break
      }
      eachDetail.Condition = condition
    }

  }
  
  /**
   * Update the Scheme Searches, as these are connected to schemne in a round about way
   * the update is a bit more complicated
   */
  public function updateSearches(){
    if(_searchLink == null and searches.where(\ l -> l.localRemove != true).Count > 0){
      _searchLink = new SchemeSearchLink_Ext()
      _searchLink.Scheme = _scheme
    }
    for(search in searches){
      if(search.localRemove != true){
        if(search.search == null){
          search.search = new SchemeSearch_Ext()
        }
        search.search.SerachKey = search.key
        search.search.Value = search.value
        if(!_searchLink.SchemeSearches.hasMatch(\ s -> s == search.search)){
          _searchLink.addToSchemeSearches(search.search)
        }
      } else {
        if(search.search != null){
          search.search.remove()
          _searchLink.removeFromSchemeSearches(search.search)
        }
      }
    }
  }
  
  public function loadCoverages() {
    var coverageArray = new ArrayList<LocalCoverage>()
    var coverageRateArray = new ArrayList<LocalCoverageRate>()
    if(_scheme.ProductCode != null){
      for(line in gw.api.productmodel.ProductLookup.getByCodeIdentifier(_scheme.ProductCode).LinePatterns){
        for(category in line.CoverageCategories){
          for(coverage in category.CoveragePatterns){
            var newitem = new LocalCoverage()
            var newRate = new LocalCoverageRate()
            newitem._code = coverage.CodeIdentifier
            newitem.name = coverage.Description
            newRate._code = coverage.CodeIdentifier
            newRate._name = coverage.Description
            if(coverage.CovTerms != null){
              var termArray = new ArrayList<LocalCoverageTerm>()
              for(term in coverage.CovTerms){
                var newterm = new LocalCoverageTerm()
                newterm.code = term.CodeIdentifier
                newterm.name = term.DisplayName
                termArray.add(newterm)
              }
              newitem.terms = termArray.toTypedArray()
            }

            coverageArray.add(newitem)
            coverageRateArray.add(newRate)
          }
        }
      }
    }
    _coverages = coverageArray.toTypedArray()
    _coverageRates = coverageRateArray.toTypedArray()
  } 
  
  public function loadConditions() {
    var conditionArray = new ArrayList<LocalCondition>()
    if(_scheme.ProductCode != null){
      for(line in gw.api.productmodel.ProductLookup.getByCodeIdentifier(_scheme.ProductCode).LinePatterns){
        for(category in line.CoverageCategories){
          for(coverage in category.ConditionPatterns){
            var newitem = new LocalCondition()
            newitem._code = coverage.CodeIdentifier
            newitem.name = coverage.DisplayName

            conditionArray.add(newitem)
          }
        }
      }
    }
    _conditions = conditionArray.toTypedArray()
  }
  
  public function loadExclusions() {
    var exclusionArray = new ArrayList<LocalExclusion>()
    if(_scheme.ProductCode != null){
      for(line in gw.api.productmodel.ProductLookup.getByCodeIdentifier(_scheme.ProductCode).LinePatterns){
        for(category in line.CoverageCategories){
          for(coverage in category.ExclusionPatterns){
            var newitem = new LocalExclusion()
            newitem._code = coverage.CodeIdentifier
            newitem.name = coverage.DisplayName

            exclusionArray.add(newitem)
          }
        }
      }
    }
    _exclusions = exclusionArray.toTypedArray()
  }
  
  public function loadModifiers() {
    var modiferArray = new ArrayList<LocalModifier>()
    if(_scheme.ProductCode != null){
      for(line in gw.api.productmodel.ProductLookup.getByCodeIdentifier(_scheme.ProductCode).LinePatterns){
        for(modifier in line.ModifierPatterns){
          var newitem = new LocalModifier()
          newitem._code = modifier.CodeIdentifier
          newitem.name = modifier.DisplayName
          modiferArray.add(newitem)
        }
      }
    }
    _modifiers = modiferArray.toTypedArray()
  }
  
  public function loadIssues() {
    var issueArray = new ArrayList<LocalIssue>()
    for(issue in Query.make(UWIssueType).select()){
      var newitem = new LocalIssue()
      newitem.code = issue.Code
      newitem.name = issue.DisplayName
      issueArray.add(newitem)
    }
    _issues = issueArray.toTypedArray()
  }
  
  public function loadCostCategory(){
    var costCategoryArray = new ArrayList<LocalCostCategoryRate>()
/*    for(item in typekey.PMOCostCategory.getTypeKeys(false)){
      var option = new LocalCostCategoryRate()
      option.code = item.CodeIdentifier
      option.name = item.DisplayName
      costCategoryArray.add(option)
    }*/
    _costCategoryRates = costCategoryArray.toTypedArray()
  }  
   
  
  
  public function populateSchemeDetailWrapper() {
    _schemeDetailWrappers = new ArrayList<SchemeDetailWrapper>()
    for(detail in _scheme.Details){
      var wrapper = new SchemeDetailWrapper()
      wrapper.schemeDetail = detail
      if(detail.SchemeSourceType == SchemeSourceType_Ext.TC_COVERAGE){
        wrapper.localCoverage = coverages.firstWhere(\ l -> l._code == detail.Comparator)
      }
      if(detail.SchemeSourceType == SchemeSourceType_Ext.TC_COVERAGETERM){
        wrapper.localCoverage = coverages.firstWhere(\ l -> l._code == detail.ParentCode)
        wrapper.localCoverageTerm = wrapper.localCoverage.terms.firstWhere(\ l -> l.code == detail.Comparator)
      }
      if(detail.SchemeSourceType == SchemeSourceType_Ext.TC_CONDITION){
        wrapper.localCondition = conditions.firstWhere(\ l -> l._code == detail.Comparator)
      }      
      if(detail.SchemeSourceType == SchemeSourceType_Ext.TC_EXCLUSION){
        wrapper.localExclusion = exclusions.firstWhere(\ l -> l._code == detail.Comparator)
      } 
      if(detail.SchemeSourceType == SchemeSourceType_Ext.TC_MODIFIER){
        wrapper.localModifier = modifiers.firstWhere(\ l -> l._code == detail.Comparator)
      } 
      if(detail.SchemeSourceType == SchemeSourceType_Ext.TC_UNDERWRITINGISSUE){
        wrapper.localIssue = issues.firstWhere(\ l -> l._code == detail.Comparator)
      }
      if(detail.SchemeSourceType == SchemeSourceType_Ext.TC_RATECOVERAGE){
        wrapper.localCoverageRate = coverageRates.firstWhere(\ l -> l._code == detail.Comparator)
      }
      if(detail.SchemeSourceType == SchemeSourceType_Ext.TC_RATECOSTCATEGORY){
        wrapper.localCostCategoryRate = costCategoryRates.firstWhere(\ l -> l._code == detail.Comparator)
      }
      _schemeDetailWrappers.add(wrapper)
    }
  }
  
  public function removeDetail(inWrapper : SchemeDetailWrapper){
    if(inWrapper.schemeDetail.SchemeDetailParams.Count > 0){
      throw new DisplayableException("Please remove the condition prior to deletion")
    }
    _scheme.removeFromDetails(inWrapper.schemeDetail)
    _schemeDetailWrappers.remove(inWrapper)
  }

  public function parentColumns(inParent : String) : List<String>{
    //return acc.pc.scheme.server.SchemeServerStartup.Instance.schemeTables.firstWhere( \ elt -> elt.EntityName == inParent).MetaData.Columns*.ColumnName.toList()
    return acc.pc.scheme.server.SchemeServerStartup.Instance.schemeTables.firstWhere( \ elt -> elt.EntityName == inParent).Columns
  }

  public property get tableWrappers() : List<SchemeTableWrapper> {
    return acc.pc.scheme.server.SchemeServerStartup.Instance.schemeTables
  }

}
