package acc.pc.bl.enhancement

uses gw.api.database.Query

enhancement BLEntity_ExtEnhancement: BLEntity_Ext {

  public property get protectedEntity() : boolean {
    var retVal = false
    if(this.EntityPath != null) {
      if (this.EntityPath.indexOf("@Protected") >= 0) {
        retVal = true
      }
    }
    return retVal
  }

  public static property get BLEntities() : List<BLEntity_Ext> {
    return Query.make(BLEntity_Ext).select().toList().where(\elt -> elt.BLEntityType == BLEntityType_Ext.TC_ENTITY)
  }

  public static property get BLCommands() : List<BLEntity_Ext> {
    return Query.make(BLEntity_Ext).select().toList().where(\elt -> elt.BLEntityType == BLEntityType_Ext.TC_COMMAND)
  }

}
