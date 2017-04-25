package acc.pc.schedule.functional
uses gw.xml.XmlElement
uses acc.pc.schedule.util.ScheduleItemUtil_Ext

class ScheduleItemReplace_Ext implements IScheduleItemReplace_Ext {

  protected var _owner : ScheduleItemReplaceDelegate_Ext
  
  construct(inOwner : ScheduleItemReplaceDelegate_Ext) {
    _owner = inOwner
  }

/**
   * Update scans the item for the parts that is constructed from and updates
   * the individual parts one at a time, if the item is made up of People and Address parts
   * these are identified and then updated
   * @param inScheduleItem XML of the incoming item
   */
  override function update(inScheduleItem : gw.xml.XmlElement){
    _owner.updateItemReplace(inScheduleItem)
    ScheduleItemUtil_Ext.updateItem(_owner, inScheduleItem)
  }

  override function setVersion(version : long) {
    _owner.Version = version
  }


  override function updateLocal(inScheduleItem : XmlElement) {
    //## todo Implement me
  }

}
