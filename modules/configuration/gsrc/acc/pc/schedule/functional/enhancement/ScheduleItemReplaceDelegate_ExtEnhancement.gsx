package acc.pc.schedule.functional.enhancement

enhancement ScheduleItemReplaceDelegate_ExtEnhancement : entity.ScheduleItemReplaceDelegate_Ext {

  /**
   * Generate XML based on the current entity
   */
  public function generateReplaceXML() : acc.pc.schedule.functional.model.scheduleitemreplacedelegate_extmodel.ScheduleItemReplaceDelegate_Ext {
    var retVal = new  acc.pc.schedule.functional.model.scheduleitemreplacedelegate_extmodel.ScheduleItemReplaceDelegate_Ext(this)
    return retVal
  }
  
  /**
   * Generate the Address XML from the incoming XML
   * @param inXML The incoming XML
   */
  public function generateItemReplaceXML(inXML : gw.xml.XmlElement) :  acc.pc.schedule.functional.model.scheduleitemreplacedelegate_extmodel.ScheduleItemReplaceDelegate_Ext {
    var retVal = new  acc.pc.schedule.functional.model.scheduleitemreplacedelegate_extmodel.ScheduleItemReplaceDelegate_Ext()
    return retVal
  }
  
  /**
   * Update the address information from the incoming XML, this will just perform am overrite of the information
   * @param inXML The incoming XML to use for the update
   */
  public function updateItemReplace(inXML : gw.xml.XmlElement){
    var updateXML         = generateItemReplaceXML(inXML)
  }  
  
}
