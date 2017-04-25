package acc.pc.scheme

uses java.util.ArrayList
uses gw.api.database.Query
uses java.util.List
uses gw.api.database.Query

/**
 * Utility class supporting the scheme searchs
 */
class SchemeSearchUtil {

  construct() {

  }
  
  /**
   * Function to find the schemes that are identified by the search paris
   * Search Pairs should be entered in the following
   * {{key,value},{key,value}}
   * @param searchPairs The array of search pairs to use in the search
   */
  public static function findSchemes(searchPairs : String[][]) : List<Scheme_Ext> {
    var retVal = new ArrayList<Scheme_Ext>()
    var query = Query.make(SchemeSearch_Ext)
    for(pairs in searchPairs index i){
      query.or(\ orRestriction -> {
        orRestriction.and(\ restriction ->{ 
          restriction.compareIgnoreCase("KeyExt", Equals, pairs[0])
          restriction.compareIgnoreCase("ValueExt", Equals, pairs[1])
        })
      })
    }
    
    for(schemeLink in query.select().toList().partition(\ s -> s.SchemeSearchLink).Keys){
      retVal.add(schemeLink.Scheme)
      print(schemeLink.Scheme.Code)
    }
    return retVal.toList()
  }
  
  /**
   * Get the list of currently available search keys
   */
  public static function SearchKeys() : List<SchemeSearchKey_Ext> {
    var retVal = Query.make(SchemeSearchKey_Ext).select().toList()
    return retVal
  }

}
