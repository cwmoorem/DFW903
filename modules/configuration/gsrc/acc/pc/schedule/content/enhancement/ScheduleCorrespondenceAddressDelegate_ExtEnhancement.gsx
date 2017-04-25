package acc.pc.schedule.content.enhancement

enhancement ScheduleCorrespondenceAddressDelegate_ExtEnhancement : entity.ScheduleCorrespondenceAddressDelegate_Ext {

  public function generateAddressXML() : acc.pc.schedule.content.model.schedulecorrespondenceaddressdelegate_extmodel.ScheduleCorrespondenceAddressDelegate_Ext {
    var retVal = new acc.pc.schedule.content.model.schedulecorrespondenceaddressdelegate_extmodel.ScheduleCorrespondenceAddressDelegate_Ext(this)
    return retVal
  }
  
  /**
   * Generate the Address XML from the incoming XML
   * @param inXML The incoming XML
   */
  public function generateCorrespondenceAddressXML(inXML : gw.xml.XmlElement): acc.pc.schedule.content.model.schedulecorrespondenceaddressdelegate_extmodel.ScheduleCorrespondenceAddressDelegate_Ext {
    var retVal                              = new acc.pc.schedule.content.model.schedulecorrespondenceaddressdelegate_extmodel.ScheduleCorrespondenceAddressDelegate_Ext()
    retVal.CorrespondenceCity            = inXML.getChild(inXML.$Namespace.qualify("CorrespondenceCity")).$Text
    retVal.CorrespondencePostalCode      = inXML.getChild(inXML.$Namespace.qualify("CorrespondencePostalCode")).$Text
    retVal.CorrespondenceAddressLine1    = inXML.getChild(inXML.$Namespace.qualify("CorrespondenceAddressLine1")).$Text
    retVal.CorrespondenceAddressLine2    = inXML.getChild(inXML.$Namespace.qualify("CorrespondenceAddressLine2")).$Text
    retVal.CorrespondenceAddressLine3    = inXML.getChild(inXML.$Namespace.qualify("CorrespondenceAddressLine3")).$Text
    if(inXML.getChild(inXML.$Namespace.qualify("CorrespondenceCountry")).$Text != null) {
      retVal.CorrespondenceCountry = Country.get(inXML.getChild(inXML.$Namespace.qualify("CorrespondenceCountry")).$Text)
    }
    retVal.CorrespondenceDescription     = inXML.getChild(inXML.$Namespace.qualify("CorrespondenceDescription")).$Text
    return retVal
  }
  
  /**
   * Update the address information from the incoming XML, this will just perform am overrite of the information
   * @param inXML The incoming XML to use for the update
   */
  public function updateCorrespondenceAddress(inXML : gw.xml.XmlElement){
    var addressXML                     = generateCorrespondenceAddressXML(inXML)
    this.CorrespondenceCity         = addressXML.CorrespondenceCity
    this.CorrespondencePostalCode   = addressXML.CorrespondencePostalCode
    this.CorrespondenceAddressLine1 = addressXML.CorrespondenceAddressLine1
    this.CorrespondenceAddressLine2 = addressXML.CorrespondenceAddressLine2
    this.CorrespondenceAddressLine3 = addressXML.CorrespondenceAddressLine3
    this.CorrespondenceCountry      = addressXML.CorrespondenceCountry
    this.CorrespondenceDescription  = addressXML.CorrespondenceDescription
  }
  
}
