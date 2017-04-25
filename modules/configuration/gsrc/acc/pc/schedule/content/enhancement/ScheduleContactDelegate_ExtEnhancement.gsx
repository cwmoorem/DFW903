package acc.pc.schedule.content.enhancement

enhancement ScheduleContactDelegate_ExtEnhancement : entity.ScheduleContactDelegate_Ext {

  /**
   * Generate XML based on the current entity
   */
  public function generateContactXML() : acc.pc.schedule.content.model.schedulecontactdelegate_extmodel.ScheduleContactDelegate_Ext {
    var retVal = new acc.pc.schedule.content.model.schedulecontactdelegate_extmodel.ScheduleContactDelegate_Ext(this)
    return retVal
  }
  
  /**
   * Generate the Address XML from the incoming XML
   * @param inXML The incoming XML
   */
  public function generateContactXML(inXML : gw.xml.XmlElement): acc.pc.schedule.content.model.schedulecontactdelegate_extmodel.ScheduleContactDelegate_Ext {
    var retVal = new acc.pc.schedule.content.model.schedulecontactdelegate_extmodel.ScheduleContactDelegate_Ext()
    retVal.EmailAddress = inXML.getChild(inXML.$Namespace.qualify("EmailAddress")).$Text
    return retVal
  }
  
  /**
   * Update the address information from the incoming XML, this will just perform am overrite of the information
   * @param inXML The incoming XML to use for the update
   */
  public function updateContact(inXML : gw.xml.XmlElement){
    var contactXML     = generateContactXML(inXML)
    this.EmailAddress = contactXML.EmailAddress
  }
  
  
}
