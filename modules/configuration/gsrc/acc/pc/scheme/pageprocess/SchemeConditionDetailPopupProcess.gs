package acc.pc.scheme.pageprocess

uses gw.api.database.Query

class SchemeConditionDetailPopupProcess {
  
  private var _schemeDetail           : SchemeDetail_Ext              as schemeDetail
  private var _isCodeVisible          : boolean                      as isCodeVisible = false
  private var _location               : pcf.api.Location

  construct(inSchemeDetail : SchemeDetail_Ext, inLocation : pcf.api.Location) {
    _schemeDetail = inSchemeDetail
    _location = inLocation
    
  }
  
   /**
   * Create a list of available scheme conditions for given product code
   */  
  public function availableSchemeConditions(productCode : String) : List<SchemeCondition_Ext> {
    return Query.make(SchemeCondition_Ext).select().where(\ s -> s.ProductCode == null || s.ProductCode == productCode).orderBy(\ s -> s.Name).toList()
  }
  
  public function conditionChange() {
    _schemeDetail.SchemeDetailParams = {}
    _schemeDetail.SchemeCondition.SchemeConditionParams.each(\ s -> {
                                                    var param = new SchemeDetailParam_Ext()
                                                    param.SchemeConditionParam = s
                                                    _schemeDetail.addToSchemeDetailParams(param)} )
    _schemeDetail.Condition = null
    gw.api.web.PebblesUtil.invalidateIterators(_location,SchemeDetailParam_Ext)
  }
  
  public function canGenerateConditionCode() : boolean {
    var canGenerate : boolean = true
    if(_schemeDetail.SchemeCondition != null)
    {
      schemeDetail.SchemeDetailParams.each(\ s -> { if(s.Value == null) {canGenerate = false}})
    } else {
      canGenerate = false
    }
    return canGenerate;
  }
  /**
   * Function called before commit on this page
   * generates condition code and normalizes line endings in multi line fields
   */
  public function beforeCommit(){
    generateConditionCode()
    //Normalize line endings to LF
     if(schemeDetail.Condition!=null) schemeDetail.Condition = schemeDetail.Condition.replaceAll("\\r", "")
  }
  
  
  public function generateConditionCode() {
    var condition : String = _schemeDetail.SchemeCondition.Condition
    for(var param in schemeDetail.SchemeDetailParams) {
      condition = condition.replaceAll("#"+param.SchemeConditionParam.Parameter+"#", param.ParamValueForCode)
    }
    _schemeDetail.Condition = condition
    gw.api.web.PebblesUtil.invalidateIterators(_location,SchemeDetailParam_Ext)
  }
  
  public function deleteCondition() {
    _schemeDetail.Condition = null
    for(param in _schemeDetail.SchemeDetailParams){
      param.remove()
    }
    _schemeDetail.SchemeCondition = null
    _location.commit()
  }
  
}
