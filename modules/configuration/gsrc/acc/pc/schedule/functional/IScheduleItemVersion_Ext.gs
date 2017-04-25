package acc.pc.schedule.functional

interface IScheduleItemVersion_Ext {
  
  public function update(inScheduleItem : gw.xml.XmlElement)
  public function incrementVersion(version : long)
  public function updateLocal(inScheduleItem : gw.xml.XmlElement)
}
