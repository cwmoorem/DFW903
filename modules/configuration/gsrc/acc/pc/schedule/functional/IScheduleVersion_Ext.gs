package acc.pc.schedule.functional

interface IScheduleVersion_Ext {

  public function findLastItemQuery(inScheduleItem : gw.xml.XmlElement) : ScheduleItemVersionDelegate_Ext
  public function findLastItemInArray(inScheduleItem : gw.xml.XmlElement) : ScheduleItemVersionDelegate_Ext
  public function updateItem(inScheduleItem : gw.xml.XmlElement)

}
