package acc.pc.schedule.functional
uses gw.xml.XmlElement
uses acc.pc.schedule.importexport.import.common.GenericFileReader


class ScheduleReplace_Ext implements IScheduleReplace_Ext {

  protected var _owner : ScheduleReplaceDelegate_Ext
  
  construct(inOwner : ScheduleReplaceDelegate_Ext) {
    _owner = inOwner
  }

  override function updateItem(inScheduleItem : XmlElement) {
  }


  override function findItemArray(inScheduleItem : XmlElement) : ScheduleItemUpdateDelegate_Ext {
    return null //## todo: Implement me
  }

  override function findItemQuery(inScheduleItem : XmlElement) : ScheduleItemUpdateDelegate_Ext {
    return null //## todo: Implement me
  }

  override function deleteItem(inScheduleItem : XmlElement) {
    //## todo: Implement me
  }

  override function deleteItems() {
    //## todo: Implement me
  }

  override function import(inFile : GenericFileReader) {
    //## todo: Implement me
  }
}
