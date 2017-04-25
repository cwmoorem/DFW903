package acc.pc.scheme

uses java.util.List
uses java.util.ArrayList
uses java.util.ArrayList

uses acc.pc.scheme.model.scheme_extmodel.anonymous.elements.Scheme_Ext_Details_Entry
uses acc.pc.scheme.model.schemecomprehensivecontainerextmodel.*
uses acc.pc.scheme.model.schemecondition_extmodel.anonymous.elements.SchemeCondition_Ext_SchemeConditionParams_Entry
uses acc.pc.scheme.model.schemedetail_extmodel.anonymous.elements.SchemeDetail_Ext_SchemeCondition
uses gw.api.database.Query
uses gw.api.database.Query
uses gw.api.database.Query
uses java.util.List
uses gw.api.database.Query
uses gw.api.database.Query
uses java.util.List
uses java.io.File

class SchemeImporter {
  private var _conditionsUsedInTransactionList: List<SchemeCondition_Ext>
  private var _searchKeysUsedInTransactionList: List<SchemeSearchKey_Ext>
  //EXCEPTION MESSAGES:
  private final static var EXPORTING_DRAFT_ERR_MSG =  "Trying to import scheme in draft status"
  private final static var OVERWRITING_APPROVED_ERR_MSG =  "Trying to overwrite existing approved scheme"
  private final static var OVERWRITING_APPROVED_CONDITION_ERR_MSG = "Trying to overwrite approved conditions with new data(fields or params)"
  
  /**
   * Initializes arrays used for holding entities from database (making them loaded only once from database)
   */
  construct() {
    _conditionsUsedInTransactionList = new ArrayList<SchemeCondition_Ext>()
    _searchKeysUsedInTransactionList = new ArrayList<SchemeSearchKey_Ext>()
  }

  /**
   * Imports Scheme Container model to database
   */
   public static function importSchemaContainerToDB(file: File){
     var importer = new SchemeImporter()
     var instance = acc.pc.scheme.model.schemecomprehensivecontainerextmodel.SchemeComprehensiveContainerExt.parse(file)
     var dbScheme = Query.make(Scheme_Ext).compare("Code", Equals, instance.Scheme.Code).select().AtMostOneRow
       gw.transaction.Transaction.runWithNewBundle(\bundle -> {
         if (instance.Scheme.GeneralStatus == typekey.GeneralStatusType_Ext.TC_DRAFT) {
           throw new Exception(EXPORTING_DRAFT_ERR_MSG)
         }
         if (dbScheme == null) {
           importer.importSchemeIntoDBCreateNew(instance, bundle)
         } else {
           if (dbScheme.GeneralStatus == typekey.GeneralStatusType_Ext.TC_APPROVED) {
             throw new Exception(OVERWRITING_APPROVED_ERR_MSG)
           }
           bundle.add(dbScheme)
           importer.importSchemeIntoDBOverwriteOld(instance, dbScheme, bundle)
         }

       })
   }
   
   /**
    * Creates new Scheme and recursively fills its fields
    * @param schemeModel Model instance of imported SchemeComprehensiveContainerExt
    * @param bundle Transaction bundle used throughout this import
    */
   private function importSchemeIntoDBCreateNew(schemeModel: acc.pc.scheme.model.schemecomprehensivecontainerextmodel.SchemeComprehensiveContainerExt, bundle : gw.pl.persistence.core.Bundle): void{
     var createdScheme = new Scheme_Ext(bundle)
     createdScheme.Code = schemeModel.Scheme.Code
     createdScheme.Description = schemeModel.Scheme.Description
     createdScheme.EndDate = schemeModel.Scheme.EndDate
     createdScheme.GeneralStatus = schemeModel.Scheme.GeneralStatus
     createdScheme.Name = schemeModel.Scheme.Name
     createdScheme.ProductCode = schemeModel.Scheme.ProductCode
     createdScheme.RenewalAvailable = schemeModel.Scheme.RenewalAvailable
     createdScheme.StartDate = schemeModel.Scheme.StartDate
     
     importSchemeSearchLinkCascading(schemeModel, createdScheme, bundle)

     importSchemeDetailsCascading(schemeModel, createdScheme, bundle)
     
     createdScheme.SupersedingScheme = Query.make(Scheme_Ext).compare("Code", Equals, schemeModel.Scheme.SupersedingScheme.Code).select().AtMostOneRow
   }
   /**
    * Recursively overwrites existing scheme with data from imported scheme 
    * @param schemeModel Model instance of imported SchemeComprehensiveContainerExt
    * @param overwrittenScheme Scheme to overwrite with new data
    * @param bundle Transaction bundle used throughout this import
    */
  private function importSchemeIntoDBOverwriteOld(
                               schemeModel: acc.pc.scheme.model.schemecomprehensivecontainerextmodel.SchemeComprehensiveContainerExt,
                               overwrittenScheme: Scheme_Ext, bundle : gw.pl.persistence.core.Bundle)
                               : void{
     overwrittenScheme.Description= schemeModel.Scheme.Description
     overwrittenScheme.EndDate = schemeModel.Scheme.EndDate
     overwrittenScheme.GeneralStatus = schemeModel.Scheme.GeneralStatus
     overwrittenScheme.Name = schemeModel.Scheme.Name
     overwrittenScheme.ProductCode = schemeModel.Scheme.ProductCode
     overwrittenScheme.RenewalAvailable = schemeModel.Scheme.RenewalAvailable
     overwrittenScheme.StartDate = schemeModel.Scheme.StartDate
     
     importSchemeSearchLinkCascading(schemeModel, overwrittenScheme, bundle)
     
     importSchemeDetailsCascading(schemeModel, overwrittenScheme, bundle)
     
     overwrittenScheme.SupersedingScheme = Query.make(Scheme_Ext).compare("Code", Equals, schemeModel.Scheme.SupersedingScheme.Code).select().AtMostOneRow
       
   }
   
   /**
    * Imports schemeSearchLink, also overwrites(if they exist) SearchKeys
    * @param schemeModel Model instance of imported SchemeComprehensiveContainerExt
    * @param overwrittenScheme Scheme to overwrite with new data
    * @param bundle Transaction bundle used throughout this import
    */
   private function importSchemeSearchLinkCascading(
                                 schemeModel: acc.pc.scheme.model.schemecomprehensivecontainerextmodel.SchemeComprehensiveContainerExt,
                                 overwrittenScheme: Scheme_Ext, bundle: gw.pl.persistence.core.Bundle)
                                 : void{
/*    if(schemeModel.Scheme.SchemeSearchLink == null){
       if(overwrittenScheme.SchemeSearchLink!=null){
         var listSchemeSearches = overwrittenScheme.SchemeSearchLink.SchemeSearches.toList()
         var sslink = overwrittenScheme.SchemeSearchLink
         bundle.add(sslink)
         for(schemeSearch in listSchemeSearches){
           bundle.add(schemeSearch)
           sslink.removeFromSchemeSearches(schemeSearch)
         }
        sslink.remove()
       }
     }
     else{
       var schemeSearchLinkDb: SchemeSearchLink_Ext
       if(overwrittenScheme.SchemeSearchLink==null){
         schemeSearchLinkDb = new SchemeSearchLink_Ext(bundle)
         schemeSearchLinkDb.Scheme_Ext = overwrittenScheme
       }
       else{
        schemeSearchLinkDb = overwrittenScheme.SchemeSearchLink
        bundle.add(schemeSearchLinkDb)  
       }
       var schemeSearchesToImportList = schemeModel.Scheme.SchemeSearchLink.SchemeSearchesExt.Entry.copy()
       var schemeSearchesDbToRemove = new ArrayList<SchemeSearch_Ext>()
       for(schemeSearchesDbElem in schemeSearchLinkDb.SchemeSearches_Ext){
         
         var schemeSearchImportedElem = schemeSearchesToImportList.firstWhere(\ sSearch -> sSearch.SerachKey.KeyExt==schemeSearchesDbElem.SerachKey.KeyExt)
        
         if(schemeSearchImportedElem==null){
           schemeSearchesDbToRemove.add(schemeSearchesDbElem)
         }
         else{
           schemeSearchesToImportList.remove(schemeSearchImportedElem)
           //insert scheme search key status conditions here
           bundle.add(schemeSearchesDbElem)
           bundle.add(schemeSearchesDbElem.SerachKey)
           schemeSearchesDbElem.Value = schemeSearchImportedElem.Value
           schemeSearchesDbElem.SerachKey.RootEntity = schemeSearchImportedElem.SerachKey.RootEntity
           schemeSearchesDbElem.SerachKey.XPath = schemeSearchImportedElem.SerachKey.XPath
         }
       }
       for(schemeSearchToDelDbElem in schemeSearchesDbToRemove){
         bundle.add(schemeSearchToDelDbElem)
         schemeSearchLinkDb.removeFromSchemeSearchesExt(schemeSearchToDelDbElem)
         schemeSearchToDelDbElem.remove()
       }
       for(schemeSearchImportNewElem in schemeSearchesToImportList){
         var schemeSearchNewDbElem = new SchemeSearch_Ext(bundle)
         schemeSearchNewDbElem.Value = schemeSearchImportNewElem.Value
         schemeSearchLinkDb.addToSchemeSearches(schemeSearchNewDbElem)
         var fromList=false
         var schemeSearchKeyDb = _searchKeysUsedInTransactionList.firstWhere(\ ssk -> ssk.KeyExt ==schemeSearchImportNewElem.SerachKeyExt.KeyExt )
         if(schemeSearchKeyDb==null) schemeSearchKeyDb = Query.make(SchemeSearchKey_Ext).compare("KeyExt", Equals, schemeSearchImportNewElem.SerachKeyExt.KeyExt).select().AtMostOneRow
         else fromList=true
         if(schemeSearchKeyDb==null){
           schemeSearchKeyDb = new SchemeSearchKey_Ext(bundle)
           schemeSearchKeyDb.Key = schemeSearchImportNewElem.SerachKeyExt.KeyExt
           _searchKeysUsedInTransactionList.add(schemeSearchKeyDb)
         }
         else{
           if(!fromList){
             bundle.add(schemeSearchKeyDb)
             _searchKeysUsedInTransactionList.add(schemeSearchKeyDb)
           }
         }
         schemeSearchNewDbElem.SerachKey = schemeSearchKeyDb
         schemeSearchKeyDb.RootEntity = schemeSearchImportNewElem.SerachKeyExt.RootEntityExt
         schemeSearchKeyDb.XPath = schemeSearchImportNewElem.SerachKey.XPath
       }
     } */
   }
   /**
    * Deletes scheme details and imports them recursively from scratch
    * @param schemeModel Model instance of imported SchemeComprehensiveContainerExt
    * @param overwrittenScheme Scheme to overwrite with new data
    * @param bundle Transaction bundle used throughout this import
    */
   private function importSchemeDetailsCascading(
                                 schemeModel: acc.pc.scheme.model.schemecomprehensivecontainerextmodel.SchemeComprehensiveContainerExt,
                                 overwrittenScheme: Scheme_Ext, bundle: gw.pl.persistence.core.Bundle){
     var schemeDetailsDbToRemove = overwrittenScheme.Details.toList()
     for(schemeDetailDb in schemeDetailsDbToRemove){
       bundle.add(schemeDetailDb)
       var schemeDetailParamDbToRemove = schemeDetailDb.SchemeDetailParams.toList()
       for(schemeDetailParamDb in schemeDetailParamDbToRemove){
         bundle.add(schemeDetailParamDb)
         schemeDetailDb.removeFromSchemeDetailParams(schemeDetailParamDb)
         schemeDetailParamDb.remove()
       }
       overwrittenScheme.removeFromDetails(schemeDetailDb)
       schemeDetailDb.remove()
     }
       for(schemeDetailImport in schemeModel.Scheme.Details.Entry){
         var createdSchemeDetail = new SchemeDetail_Ext(bundle)
         
         createdSchemeDetail.BooleanValue = schemeDetailImport.BooleanValue
         createdSchemeDetail.Comparator = schemeDetailImport.Comparator
         createdSchemeDetail.Condition = schemeDetailImport.Condition
         createdSchemeDetail.DateValue = schemeDetailImport.DateValue
         createdSchemeDetail.DecimalValue = schemeDetailImport.DecimalValue
         createdSchemeDetail.ForceValue = schemeDetailImport.ForceValue
         createdSchemeDetail.IntegerValue = schemeDetailImport.IntegerValue
         createdSchemeDetail.LongValue = schemeDetailImport.LongValue
         createdSchemeDetail.MoneyValue = schemeDetailImport.MoneyValue
         createdSchemeDetail.ParentCode = schemeDetailImport.ParentCode
         createdSchemeDetail.SchemeActionType = schemeDetailImport.SchemeActionType
         createdSchemeDetail.SchemeSourceType = schemeDetailImport.SchemeSourceType
         createdSchemeDetail.SchemeValidationType = schemeDetailImport.SchemeValidationType
         createdSchemeDetail.SchemeValueType = schemeDetailImport.SchemeValueType
         createdSchemeDetail.StringValue = schemeDetailImport.StringValue
         
         importSchemeConditionsAndDetailParams(schemeDetailImport, createdSchemeDetail, bundle)
         
         overwrittenScheme.addToDetails(createdSchemeDetail)
       }
     }
     
     /**
      * Imports scheme conditions, scheme condition parameters, and scheme detail parameters
      * @param schemeDetailImport Model instance of imported Scheme Detail
      * @param overwrittenSchemeDetail Scheme Detail to overwrite with new data
      * @param bundle Transaction bundle used throughout this import
      */
  private function importSchemeConditionsAndDetailParams(
                                 schemeDetailImport: Scheme_Ext_Details_Entry,
                                 overwrittenSchemeDetail: SchemeDetail_Ext,
                                 bundle: gw.pl.persistence.core.Bundle) {
//newSchemeDetail.SchemeConditionExt
       if(schemeDetailImport.SchemeCondition!=null){
         var fromList =false
         var schemeCondition = _conditionsUsedInTransactionList.firstWhere(\ sCond -> sCond.Code==schemeDetailImport.SchemeCondition.Code)
         if(schemeCondition==null){
           schemeCondition = Query.make(SchemeCondition_Ext).compare("Code", Equals, schemeDetailImport.SchemeCondition.Code).select().AtMostOneRow
         }
         else{
            fromList=true
         }
         if(schemeCondition==null){
           schemeCondition = new SchemeCondition_Ext(bundle)
           schemeCondition.GeneralStatus= GeneralStatusType_Ext.TC_DRAFT
           schemeCondition.Code = schemeDetailImport.SchemeCondition.Code
           overwrittenSchemeDetail.SchemeCondition = schemeCondition
           _conditionsUsedInTransactionList.add(schemeCondition)
         }
         else
         {
           if(!fromList){
             bundle.add(schemeCondition)
             _conditionsUsedInTransactionList.add(schemeCondition)
           }
           overwrittenSchemeDetail.SchemeCondition = schemeCondition
         }
           
         if(schemeCondition.GeneralStatus== GeneralStatusType_Ext.TC_TEST || schemeCondition.GeneralStatus==typekey.GeneralStatusType_Ext.TC_DRAFT){
           schemeCondition.Condition = schemeDetailImport.SchemeCondition.Condition
           schemeCondition.Description = schemeDetailImport.SchemeCondition.Description
           schemeCondition.GeneralStatus = schemeDetailImport.SchemeCondition.GeneralStatus
           schemeCondition.Name =  schemeDetailImport.SchemeCondition.Name
           schemeCondition.ProductCode = schemeDetailImport.SchemeCondition.ProductCode
           schemeCondition.Root = schemeDetailImport.SchemeCondition.Root
           var schemeConditionParamImportList = schemeDetailImport.SchemeCondition.SchemeConditionParams.Entry
           var schemeConditionParamDbRemoveList = new ArrayList<SchemeConditionParam_Ext>()
           for(schemeConditionParamDb in schemeCondition.SchemeConditionParams){
             var tempSchemeConditionParam = schemeDetailImport.SchemeCondition.SchemeConditionParams.Entry.firstWhere
                                                   (\ sConditionParam -> sConditionParam.Name == schemeConditionParamDb.Name)
           
             if(tempSchemeConditionParam!=null) {
               schemeConditionParamImportList.remove(tempSchemeConditionParam)
               if(!bundle.InsertedBeans.hasMatch(\ k -> k==schemeConditionParamDb )){
                 bundle.add(schemeConditionParamDb)
               }
               schemeConditionParamDb.Parameter = tempSchemeConditionParam.Parameter
               schemeConditionParamDb.ParamValueType = tempSchemeConditionParam.ParamValueType
             }
             else{
               schemeConditionParamDbRemoveList.add(schemeConditionParamDb)
             }
           }
           for( schemeConditionParamToRemove in schemeConditionParamDbRemoveList){
             if(!bundle.InsertedBeans.hasMatch(\ k -> k==schemeConditionParamToRemove)) {
               bundle.add(schemeConditionParamToRemove)
             }
             schemeCondition.removeFromSchemeConditionParams(schemeConditionParamToRemove)
           }
           for(schemeConditionImportNew in schemeConditionParamImportList) {
             var schemeConditionParamNew = new SchemeConditionParam_Ext(bundle)
             schemeConditionParamNew.Name = schemeConditionImportNew.Name
             schemeConditionParamNew.Parameter = schemeConditionImportNew.Parameter
             schemeConditionParamNew.ParamValueType = schemeConditionImportNew.ParamValueType
             schemeCondition.addToSchemeConditionParams(schemeConditionParamNew)
           }
         }
         else if(schemeCondition.GeneralStatus== GeneralStatusType_Ext.TC_APPROVED && !checkIfSchemeConditionMatchDeep(schemeDetailImport.SchemeCondition, schemeCondition)){
           throw new Exception(OVERWRITING_APPROVED_CONDITION_ERR_MSG)
         }
                
         //newSchemeDetail.SchemeDetailParam
         for(schemeDetailParamsImport in schemeDetailImport.SchemeDetailParams.Entry){
          var createdSchemeDetailParam = new SchemeDetailParam_Ext(bundle)
          createdSchemeDetailParam.BooleanValue = schemeDetailParamsImport.BooleanValue
          createdSchemeDetailParam.DateValue = schemeDetailParamsImport.DateValue
          createdSchemeDetailParam.DecimalValue = schemeDetailParamsImport.DecimalValue
          createdSchemeDetailParam.IntegerValue = schemeDetailParamsImport.IntegerValue
          createdSchemeDetailParam.LongValue = schemeDetailParamsImport.LongValue
          createdSchemeDetailParam.MoneyValue = schemeDetailParamsImport.MoneyValue
          createdSchemeDetailParam.StringValue = schemeDetailParamsImport.StringValue
          createdSchemeDetailParam.SchemeConditionParam = schemeCondition.SchemeConditionParams.firstWhere(\ sCond -> sCond.Name==schemeDetailParamsImport.SchemeConditionParam.Name )
          overwrittenSchemeDetail.addToSchemeDetailParams(createdSchemeDetailParam)
         }
       }     
   }
   /**
    * Checks if scheme conditions and scheme condition model instance match, recursively
    * @param importedSchemeCondition Instance of model scheme condition
    * @param existingSchemeCondition Scheme Conditions from database
    * @return true if matches, false otherwise
    */
   private function checkIfSchemeConditionMatchDeep(
                                 importedSchemeCondition: SchemeDetail_Ext_SchemeCondition,
                                 existingSchemeCondition: SchemeCondition_Ext)
                                 : Boolean {
     if(!checkIfSchemeConditionsMatchShallow(importedSchemeCondition, existingSchemeCondition))return false

     if(existingSchemeCondition.SchemeConditionParams.Count!=importedSchemeCondition.SchemeConditionParams.Entry.Count) return false
     for(schemeConditionParam in existingSchemeCondition.SchemeConditionParams){
       var tempSchemeConditionParam = importedSchemeCondition.SchemeConditionParams.Entry.firstWhere(\ sConditionParam -> sConditionParam.Name == schemeConditionParam.Name)
       if(tempSchemeConditionParam==null){
          return false
       }
       if(tempSchemeConditionParam!=null && !checkIfSchemeConditionParamsMatch(tempSchemeConditionParam, schemeConditionParam))
         return false
     }

     return true
   }
   
   /**
    * Checks if single scheme condition params match instance of scheme condition params model
    * @param importedSchemeConditionParam Instance of model scheme condition parameter
    * @param existingSchemeConditionParam Scheme condition parameter from the database
    * @return True if match, false otherwise
    */
   private function checkIfSchemeConditionParamsMatch
                                 (importedSchemeConditionParam: SchemeCondition_Ext_SchemeConditionParams_Entry,
                                 existingSchemeConditionParam: SchemeConditionParam_Ext)
                                 : Boolean{
      return (existingSchemeConditionParam.Name == importedSchemeConditionParam.Name &&
           existingSchemeConditionParam.Parameter == importedSchemeConditionParam.Parameter &&
           existingSchemeConditionParam.ParamValueType == importedSchemeConditionParam.ParamValueType)
   }
   /**
    * Checks if scheme condition fields match, nonrecursively
    * @param importedSchemeCondition Instance of scheme condition model 
    * @param existingSchemeCondition Scheme condition from the database
    * @return True if match, false otherwise
    */
   private function checkIfSchemeConditionsMatchShallow
                                 (importedSchemeCondition: acc.pc.scheme.model.schemedetail_extmodel.anonymous.elements.SchemeDetail_Ext_SchemeCondition,
                                 existingSchemeCondition: SchemeCondition_Ext)
                                 : Boolean {
     return existingSchemeCondition.Condition == importedSchemeCondition.Condition &&
       existingSchemeCondition.Description== importedSchemeCondition.Description &&
       existingSchemeCondition.GeneralStatus == importedSchemeCondition.GeneralStatus &&
       existingSchemeCondition.Name ==  importedSchemeCondition.Name &&
       existingSchemeCondition.ProductCode == importedSchemeCondition.ProductCode &&
       existingSchemeCondition.Root == importedSchemeCondition.Root
   }
}
