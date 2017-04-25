package acc.pc.schedule.functional
uses acc.pc.schedule.importexport.import.common.GenericFileReader

interface IScheduleUpdate_Ext {
  
  public function findItemArray(inScheduleItem : gw.xml.XmlElement) : ScheduleItemUpdateDelegate_Ext
  public function findItemQuery(inScheduleItem : gw.xml.XmlElement) : ScheduleItemUpdateDelegate_Ext
  public function updateItem(inScheduleItem : gw.xml.XmlElement)
  public function addNewItem(inScheduleItem : gw.xml.XmlElement)
  public function deleteItem(inScheduleItem : gw.xml.XmlElement)
  public function deleteItems()
  public function import(inFile : GenericFileReader)
 
}
