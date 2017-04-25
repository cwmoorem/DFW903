package gw.processes

uses gw.api.database.Query
uses gw.api.database.QuerySelectColumns
uses gw.api.path.Paths
uses gw.api.processes.BatchProcessLogger
uses java.util.Date
uses gw.transaction.Transaction
uses gw.api.domain.account.PendingUpdate
uses java.util.List

/**
 * Apply account syncable changes that were made during future dated jobs to 
 * the backing account information. For example if a policy change updates a 
 * driver's marital status in the future, that change should be applied to 
 * the corresponding person at the account level on the edit effective date 
 * of the policy change job.
 */
@Export
class ApplyPendingAccountDataUpdates extends BatchProcessBase {
  
  /** User which the updates execute as */
  protected static var APPLY_UPDATE_USER : String = "sys"
  
  public construct() {
    super(BatchProcessType.TC_APPLYPENDINGACCOUNTDATAUPDATES)
  }
  
  override function doWork() {
    var updateComparisonTime = Date.Tomorrow.trimToMidnight().addMinutes(-1)
    BatchProcessLogger.logInfo("Applying pending account data updates.")
        
    var contactUpdates = Query.make(PendingContactUpdate)
      .compare("PendingUpdateTime", LessThanOrEquals, updateComparisonTime)
      .select().orderBy(QuerySelectColumns.path(Paths.make(PendingContactUpdate#CreateTime))).toList()
    BatchProcessLogger.logInfo("Starting contact updates.  There are ${contactUpdates.Count} Contact Update(s) to apply.")
    applyUpdates(contactUpdates)
    
    var accountContactUpdates = Query.make(PendingAccountContactRoleUpdate)
      .compare("PendingUpdateTime", LessThanOrEquals, updateComparisonTime)
      .select().orderBy(QuerySelectColumns.path(Paths.make(PendingAccountContactRoleUpdate#CreateTime))).toList()
    BatchProcessLogger.logInfo("Starting account contact updates.  There are ${accountContactUpdates.Count} AccountContactRole Update(s) to apply.")    
    applyUpdates(accountContactUpdates)
        
    var addressUpdates = Query.make(PendingAddressUpdate)
      .compare("PendingUpdateTime", LessThanOrEquals, updateComparisonTime)
      .select().orderBy(QuerySelectColumns.path(Paths.make(PendingAddressUpdate#CreateTime))).toList()
    BatchProcessLogger.logInfo("Starting address updates.  There are ${addressUpdates.Count} Address Update(s) to apply.")
    applyUpdates(addressUpdates)
  }
  
  private function applyUpdates(updates : List<PendingUpdate & KeyableBean>){
    Transaction.runWithNewBundle(\ b -> {              
      for (update in updates){
        if (BatchProcessLogger.isTraceEnabled()){
          BatchProcessLogger.logTrace("Updating ${update.Target.PublicID} with updates scheduled for ${update.ExecuteTime.ShortFormat}")
        } 
        update = b.add(update)
        update.applyUpdate()
        update.remove()
      }
    }, APPLY_UPDATE_USER)
  }
  
}
