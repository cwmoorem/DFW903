package acc.pc.schedule.functional
uses gw.xml.XmlElement
uses acc.pc.schedule.util.ScheduleItemUtil_Ext

class ScheduleItemVersion_Ext implements IScheduleItemVersion_Ext {

  protected var _owner : ScheduleItemVersionDelegate_Ext
  
  construct(inOwner : ScheduleItemVersionDelegate_Ext) {
    _owner = inOwner
  }

/**
   * Update scans the item for the parts that is constructed from and updates
   * the individual parts one at a time, if the item is made up of People and Address parts
   * these are identified and then updated
   * @param inScheduleItem XML of the incoming item
   */
  override function update(inScheduleItem : gw.xml.XmlElement){
    _owner.updateItemVersion(inScheduleItem)
    ScheduleItemUtil_Ext.updateItem(this, inScheduleItem)
  }

  override function incrementVersion(version : long) {
    _owner.Version = version + 1
  }


  override function updateLocal(inScheduleItem : XmlElement) {
  }

}
