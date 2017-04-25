package acc.pc.schedule.content.enhancement

uses acc.pc.schedule.content.model.scheduleaddressdelegate_extmodel.*

enhancement ScheduleAddressDelegate_ExtEnhancement : entity.ScheduleAddressDelegate_Ext {

  /**
   * Generate XML based on the current entity
   */
  public function generateAddressXML() : acc.pc.schedule.content.model.scheduleaddressdelegate_extmodel.ScheduleAddressDelegate_Ext {
    var retVal = new acc.pc.schedule.content.model.scheduleaddressdelegate_extmodel.ScheduleAddressDelegate_Ext(this)
    return retVal
  }
  
  /**
   * Generate the Address XML from the incoming XML
   * @param inXML The incoming XML
   */
  public function generateAddressXML(inXML : gw.xml.XmlElement): acc.pc.schedule.content.model.scheduleaddressdelegate_extmodel.ScheduleAddressDelegate_Ext {
    var retVal                = new acc.pc.schedule.content.model.scheduleaddressdelegate_extmodel.ScheduleAddressDelegate_Ext()
    retVal.City            = inXML.getChild(inXML.$Namespace.qualify("City")).$Text
    retVal.PostalCode      = inXML.getChild(inXML.$Namespace.qualify("PostalCode")).$Text
    retVal.AddressLine1    = inXML.getChild(inXML.$Namespace.qualify("AddressLine1")).$Text
    retVal.AddressLine2    = inXML.getChild(inXML.$Namespace.qualify("AddressLine2")).$Text
    retVal.AddressLine3    = inXML.getChild(inXML.$Namespace.qualify("AddressLine3")).$Text
    if(inXML.getChild(inXML.$Namespace.qualify("Country")).$Text != null) {
      retVal.Country = Country.get(inXML.getChild(inXML.$Namespace.qualify("Country")).$Text)
    }
    retVal.Description     = inXML.getChild(inXML.$Namespace.qualify("Description")).$Text
    return retVal
  }
  
  /**
   * Update the address information from the incoming XML, this will just perform am overrite of the information
   * @param inXML The incoming XML to use for the update
   */
  public function updateAddress(inXML : gw.xml.XmlElement){
    var addressXML       = generateAddressXML(inXML)
    this.City         = addressXML.City
    this.PostalCode   = addressXML.PostalCode
    this.AddressLine1 = addressXML.AddressLine1
    this.AddressLine2 = addressXML.AddressLine2
    this.AddressLine3 = addressXML.AddressLine3
    this.Country      = addressXML.Country
    this.Description  = addressXML.Description
  }
  
}
