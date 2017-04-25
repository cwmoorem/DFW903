package acc.pc.schedule.functional
uses gw.xml.XmlElement
uses acc.pc.schedule.util.ScheduleItemUtil_Ext


class ScheduleItemUpdate_Ext implements IScheduleItemUpdate_Ext {

  protected var _owner : ScheduleItemUpdateDelegate_Ext
  
  construct(inOwner : ScheduleItemUpdateDelegate_Ext) {
    _owner = inOwner
  }
  
  /**
   * Update scans the item for the parts that is constructed from and updates
   * the individual parts one at a time, if the item is made up of People and Address parts
   * these are identified and then updated
   * @param inScheduleItem XML of the incoming item
   */
  override function update(inScheduleItem : gw.xml.XmlElement){
    _owner.updateItemUpdate(inScheduleItem)
    ScheduleItemUtil_Ext.updateItem(this, inScheduleItem)
  }
  
  /**
   * Update the attributes that are defined locally on the concrete implementation
   * of the schedule item
   * @param inScheduleItem XML of the incoming item
   */
  override function updateLocal(inScheduleItem : XmlElement) {
  }

}
