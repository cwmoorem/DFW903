package acc.pc.bl

uses gw.api.database.Query
uses gw.api.database.Relop

/**
 * Created by cwmoorem on 08/02/2017.
 */
class BLEntityLoad_Ext {

  private var _queryEntity : BLEntity_Ext

  construct(){

  }

  public function loadBase(){
    gw.transaction.Transaction.newBundle(){
      loadEntities()
      loadCommands()
      gw.transaction.Transaction.Current.commit()
    }
  }

  private function loadEntities(){
    var entityMap = new HashMap<String,String>(){
        "PolicyPeriod"          -> "@Protected\n@Type:PolicyPeriod\n@PolicyPeriod",
        "Policy"                -> "@Protected\n@Type:Policy\n@PolicyPeriod.Policy",
        "Account"               -> "@Protected\n@Type:Account\n@PolicyPeriod.Policy.Account",
        "EffectiveDatedFields"  -> "@Protected\n@Type:EffectiveDatedFields\n@PolicyPeriod.EffectiveDatedFields",
        "PolicyTerm"            -> "@Protected\n@Type:PolicyTerm\n@PolicyPeriod.PolicyTerm"
    }

    for(keyValue in entityMap.getKeys()){
      if(!exists(keyValue)) {
        var newEntity = new BLEntity_Ext(gw.transaction.Transaction.Current){
            :EntityName = keyValue,
            :BLEntityType = BLEntityType_Ext.TC_ENTITY,
            :EntityPath = entityMap.get(keyValue)
            }
      }
    }
  }

  private function loadCommands(){

    var commandMap = new HashMap<String,String>(){
        "UpdateStringValue"   -> "@Protected\n@Update\n@Entity @StringValue",
        "UpdateIntegerValue"  -> "@Protected\n@Update\n@Entity @IntegerValue",
        "UpdateBooleanValue"  -> "@Protected\n@Update\n@Entity @BooleanValue",
        "UpdateDateValue"     -> "@Protected\n@Update\n@Entity @DateValue",
        "UpdateDateTimeValue" -> "@Protected\n@Update\n@Entity @DateTimeValue",
        "EqualsDateTime"      -> "@Protected\n@Entity == @DateTimeValue",
        "EqualsDate"          -> "@Protected\n@Entity == @DateValue",
        "EqualsString"        -> "@Protected\n@Entity == @StringValue",
        "EqualsBoolean"       -> "@Protected\n@Entity == @BooleanValue",
        "EqualsInteger"       -> "@Protected\n@Entity == @IntegerValue",
        "DateBefore"          -> "@Protected\n@Entity.before(@DateValue)",
        "DateAfter"           -> "@Protected\n@Entity.after(@DateValue)",
        "InSet"               -> "@Protected\n{@Value}.contains(@Entity)",
        "SetContains"         -> "@Protected\n@Entity.contains(@Value)",
        "GTE"                 -> "@Protected\n@Entity >= @Value",
        "LTE"                 -> "@Protected\n@Entity <= @Value"
    }

    for(keyValue in commandMap.getKeys()){
      if(!exists(keyValue)) {
        var newEntity = new BLEntity_Ext(gw.transaction.Transaction.Current){
            :EntityName = keyValue,
            :BLEntityType = BLEntityType_Ext.TC_COMMAND,
            :EntityPath = commandMap.get(keyValue)
            }
      } else {
        gw.transaction.Transaction.Current.add(_queryEntity)
        _queryEntity.EntityName = keyValue
        _queryEntity.BLEntityType = BLEntityType_Ext.TC_COMMAND
        _queryEntity.EntityPath = commandMap.get(keyValue)

      }
    }
  }

  private function exists(inName : String) : boolean{
    var retVal = false
    var query = Query.make(BLEntity_Ext)
                     .compare("EntityName", Relop.Equals, inName)
                     .select()
    if(query.Count > 0){
      retVal = true
      _queryEntity = query.first()
    }
    return retVal

  }

}