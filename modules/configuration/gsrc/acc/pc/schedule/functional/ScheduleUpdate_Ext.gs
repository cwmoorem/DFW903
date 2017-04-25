package acc.pc.schedule.functional
uses gw.xml.XmlElement
uses acc.pc.schedule.importexport.import.common.GenericFileReader

class ScheduleUpdate_Ext implements IScheduleUpdate_Ext {

  protected var _owner : ScheduleUpdateDelegate_Ext
  
  construct(inOwner : ScheduleUpdateDelegate_Ext) {
    _owner = inOwner
  }

  override function findItemArray(inScheduleItem : gw.xml.XmlElement) : ScheduleItemUpdateDelegate_Ext{
    return null
  }
  
  override function findItemQuery(inScheduleItem : gw.xml.XmlElement) : ScheduleItemUpdateDelegate_Ext {
    
    return null
  }
  
  override function updateItem(inScheduleItem : gw.xml.XmlElement){
  }


  override function deleteItem(inScheduleItem : XmlElement) {
  }


  override function deleteItems() {
  }


  override function import(inFile : GenericFileReader) {
  }


  override function addNewItem(inScheduleItem : XmlElement) {
  }

}
