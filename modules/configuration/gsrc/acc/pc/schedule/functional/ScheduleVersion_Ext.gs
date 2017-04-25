package acc.pc.schedule.functional
uses gw.xml.XmlElement

class ScheduleVersion_Ext implements IScheduleVersion_Ext {

  protected var _owner : ScheduleVersionDelegate_Ext
  
  construct(inOwner : ScheduleVersionDelegate_Ext) {
    _owner = inOwner
  }
  
  public function maybeAddItem(inScheduleItem : gw.xml.XmlElement) : boolean {
    var retVal = false
    if(findLastItemQuery(inScheduleItem) == null){
      retVal = true
    }
    return retVal
  }
 
  override function findLastItemQuery(inScheduleItem : gw.xml.XmlElement) : ScheduleItemVersionDelegate_Ext {
    return null
  }
  
  override function updateItem(inScheduleItem : gw.xml.XmlElement){
  }


  override function findLastItemInArray(inScheduleItem : XmlElement) : ScheduleItemVersionDelegate_Ext {
    return null
  }

}
