package acc.pc.scheme

uses gw.api.database.Query
uses java.util.Set
uses gw.api.util.DisplayableException

enhancement GeneralStatusDelegateEnhancement : GeneralStatusDelegate_Ext {
  
  private function getParents() : Object[] {
    var parents : List<Object> = {}
    if(this typeis SchemeCondition_Ext){
      var tempParents = Query.make(Scheme_Ext).select().where(\ s -> s.Details.hasMatch(\ d -> d.SchemeCondition == this)).toArray()
      var bundle = gw.transaction.Transaction.getCurrent()
      for(parent in tempParents) {
        parents.add(bundle.add(parent as Scheme_Ext))
      }
    } else if(this typeis Scheme_Ext) {
      // when scheme will have parents (NegotiationExt ?) this block need to be filled
    }
    return parents.toArray()
  }
  
  private function getChildren() : Object[] {
    var children : Set<Object> = {}
    if(this typeis Scheme_Ext){
      for(schemedetail in this.Details) {
        if(schemedetail.SchemeCondition != null) {
          children.add(schemedetail.SchemeCondition)
        }    
      }
    }
    return children.toArray()
  }
    
  private function demoteAndGetInfo(object: GeneralStatusDelegate_Ext) : Set<String> {
    var errorMessage : Set<String> = {}
    if(object.GeneralStatus == GeneralStatusType_Ext.TC_TEST) {
      object.GeneralStatus = GeneralStatusType_Ext.TC_DRAFT
      errorMessage.add(getObjectDetail(object))
      for(parent in getParents()) {
        errorMessage.addAll(demoteAndGetInfo((parent as GeneralStatusDelegate_Ext)))
      }
    }
    return errorMessage
  }
  
  private function getObjectDetail(object : Object) : String {
    var objectInformation : String = ""
/*     if(object typeis SchemeConditionExt){
      objectInformation = displaykey.Web.Scheme.Error.SchemeConditionExt(object.NameExt)
    } else if(object typeis SchemeExt) {
      objectInformation = displaykey.Web.Scheme.Error.SchemeExt(object.NameExt)
    }*/
    return objectInformation
  }
  
  public function promote() {
    var newStatus : GeneralStatusType_Ext
    switch(this.GeneralStatus) {
      case GeneralStatusType_Ext.TC_DRAFT:
          newStatus = GeneralStatusType_Ext.TC_TEST
          break
      case GeneralStatusType_Ext.TC_TEST:
          newStatus = GeneralStatusType_Ext.TC_APPROVED
          break
      default:
          newStatus = GeneralStatusType_Ext.TC_APPROVED
    }
    
    var childWithWrongStatus : Set<Object> = {}
    
    for(child in getChildren()) {
      var childStatus = (child as GeneralStatusDelegate_Ext).GeneralStatus
      if(childStatus != newStatus && childStatus != GeneralStatusType_Ext.TC_APPROVED) {
        childWithWrongStatus.add(child)
      }
    }
    
    if(childWithWrongStatus.Count > 0) {
      var errorMessage : String = ""
      childWithWrongStatus.each(\ e -> {errorMessage += getObjectDetail(e)+"\n"})
      throw new DisplayableException("Unable to promote")
    }
    
    this.GeneralStatus = newStatus
  }
    
  public function demote() {
    var errors = demoteAndGetInfo(this)
      
    if(errors.Count > 0)
    {
      var message : String = ""
      errors.each(\ e -> {message += e + "\n"})
      throw new DisplayableException("Demoted")
    }
  }
  
  public function isEditable() : boolean {
    return this.GeneralStatus == GeneralStatusType_Ext.TC_DRAFT
  }
  
}
