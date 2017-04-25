package acc.pc.bl

uses pcf.BLMain

/**
 * Created by cwmoorem on 25/01/2017.
 */
class BLEntityDetailPageProcess_Ext {

  private var _blentity : BLEntity_Ext as BLEntity

  construct(inBLEntity : BLEntity_Ext, inClone : boolean, inEntityType : BLEntityType_Ext){
    if(inBLEntity == null){
      _blentity = createBLEntity()
      _blentity.BLEntityType = inEntityType
    } else {
      if(inClone == true){
        _blentity = createBLEntity()
        _blentity.EntityName = inBLEntity.EntityName + "-Copy"
        _blentity.EntityPath = inBLEntity.EntityPath.split("\n").where(\elt -> elt != "@Protected").join("\n")
        _blentity.BLEntityType = inBLEntity.BLEntityType
      } else {
        _blentity = inBLEntity
      }
    }

  }

  public function createBLEntity() : BLEntity_Ext {
    var newBLEntity = new BLEntity_Ext(gw.transaction.Transaction.getCurrent())
    return newBLEntity
  }

  public function editEnable() : boolean {
    var retVal = true
    if(_blentity != null) {
      if (_blentity.EntityPath != null) {
        if (_blentity.EntityPath.indexOf("@Protected") >= 0) {
          retVal = false
        }
      }
    }
    return retVal
  }

  public function removeBLEntity(inBLEntity : BLEntity_Ext){
    inBLEntity.remove()
    gw.transaction.Transaction.Current.commit()
    BLMain.go()
  }

}