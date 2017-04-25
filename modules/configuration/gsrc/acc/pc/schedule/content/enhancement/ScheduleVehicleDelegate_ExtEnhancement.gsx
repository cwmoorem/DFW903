package acc.pc.schedule.content.enhancement

enhancement ScheduleVehicleDelegate_ExtEnhancement : entity.ScheduleVehicleDelegate_Ext {

  /**
   * Generate XML based on the current entity
   */
  public function generateVehicleXML() : acc.pc.schedule.content.model.schedulevehicledelegate_extmodel.ScheduleVehicleDelegate_Ext {
    var retVal = new acc.pc.schedule.content.model.schedulevehicledelegate_extmodel.ScheduleVehicleDelegate_Ext(this)
    return retVal
  }
  
  /**
   * Generate the Address XML from the incoming XML
   * @param inXML The incoming XML
   */
  public function generateVehicleXML(inXML : gw.xml.XmlElement): acc.pc.schedule.content.model.schedulevehicledelegate_extmodel.ScheduleVehicleDelegate_Ext {
    var retVal = new acc.pc.schedule.content.model.schedulevehicledelegate_extmodel.ScheduleVehicleDelegate_Ext()
    retVal.Make               = inXML.getChild(inXML.$Namespace.qualify("Make")).$Text
    retVal.RegistrationNumber = inXML.getChild(inXML.$Namespace.qualify("RegistrationNumber")).$Text
    retVal.VIN                = inXML.getChild(inXML.$Namespace.qualify("VIN")).$Text
    return retVal
  }
  
  /**
   * Update the address information from the incoming XML, this will just perform am overrite of the information
   * @param inXML The incoming XML to use for the update
   */
  public function updateVehicle(inXML : gw.xml.XmlElement){
    var vehicleXML     = generateVehicleXML(inXML)
    this.Make               = vehicleXML.Make
    this.RegistrationNumber = vehicleXML.RegistrationNumber
    this.VIN                = vehicleXML.VIN
  }
    
}
