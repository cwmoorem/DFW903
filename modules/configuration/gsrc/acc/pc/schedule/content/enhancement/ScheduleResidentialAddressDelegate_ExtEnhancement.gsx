package acc.pc.schedule.content.enhancement

enhancement ScheduleResidentialAddressDelegate_ExtEnhancement : entity.ScheduleResidentialAddressDelegate_Ext {

  /**
   * Generate XML based on the current entity
   */
  public function generateResidentialAddressXML() : acc.pc.schedule.content.model.scheduleresidentialaddressdelegate_extmodel.ScheduleResidentialAddressDelegate_Ext {
    var retVal = new acc.pc.schedule.content.model.scheduleresidentialaddressdelegate_extmodel.ScheduleResidentialAddressDelegate_Ext(this)
    return retVal
  }
  
  /**
   * Generate the Address XML from the incoming XML
   * @param inXML The incoming XML
   */
  public function generateResidentialAddressXML(inXML : gw.xml.XmlElement): acc.pc.schedule.content.model.scheduleresidentialaddressdelegate_extmodel.ScheduleResidentialAddressDelegate_Ext {
    var retVal                           = new acc.pc.schedule.content.model.scheduleresidentialaddressdelegate_extmodel.ScheduleResidentialAddressDelegate_Ext()
    retVal.ResidentialCity            = inXML.getChild(inXML.$Namespace.qualify("ResidentialCity")).$Text
    retVal.ResidentialPostalCode      = inXML.getChild(inXML.$Namespace.qualify("ResidentialPostalCode")).$Text
    retVal.ResidentialAddressLine1    = inXML.getChild(inXML.$Namespace.qualify("ResidentialAddressLine1")).$Text
    retVal.ResidentialAddressLine2    = inXML.getChild(inXML.$Namespace.qualify("ResidentialAddressLine2")).$Text
    retVal.ResidentialAddressLine3    = inXML.getChild(inXML.$Namespace.qualify("ResidentialAddressLine3")).$Text
    if(inXML.getChild(inXML.$Namespace.qualify("ResidentialCountry")).$Text != null) {
      retVal.ResidentialCountry = Country.get(inXML.getChild(inXML.$Namespace.qualify("ResidentialCountry")).$Text)
    }
    retVal.ResidentialDescription     = inXML.getChild(inXML.$Namespace.qualify("ResidentialDescription")).$Text
    return retVal
  }
  
  /**
   * Update the address information from the incoming XML, this will just perform am overrite of the information
   * @param inXML The incoming XML to use for the update
   */
  public function updateResidentialAddress(inXML : gw.xml.XmlElement){
    var addressXML                  = generateResidentialAddressXML(inXML)
    this.ResidentialCity         = addressXML.ResidentialCity
    this.ResidentialPostalCode   = addressXML.ResidentialPostalCode
    this.ResidentialAddressLine1 = addressXML.ResidentialAddressLine1
    this.ResidentialAddressLine2 = addressXML.ResidentialAddressLine2
    this.ResidentialAddressLine3 = addressXML.ResidentialAddressLine3
    this.ResidentialCountry      = addressXML.ResidentialCountry
    this.ResidentialDescription  = addressXML.ResidentialDescription
  }
  
}
