package acc.pc.schedule.functional.enhancement
uses java.lang.Long
uses java.lang.Exception

enhancement ScheduleItemVersionDelegate_ExtEnhancement : entity.ScheduleItemVersionDelegate_Ext {
  /**
   * Generate XML based on the current entity
   */
  public function generateVersionXML() : acc.pc.schedule.functional.model.scheduleitemversiondelegate_extmodel.ScheduleItemVersionDelegate_Ext {
    var retVal = new  acc.pc.schedule.functional.model.scheduleitemversiondelegate_extmodel.ScheduleItemVersionDelegate_Ext(this)
    return retVal
  }
  
  /**
   * Generate the Version XML from the incoming XML
   * @param inXML The incoming XML
   */
  public function generateItemVersionXML(inXML : gw.xml.XmlElement) :  acc.pc.schedule.functional.model.scheduleitemversiondelegate_extmodel.ScheduleItemVersionDelegate_Ext {
    var retVal = new  acc.pc.schedule.functional.model.scheduleitemversiondelegate_extmodel.ScheduleItemVersionDelegate_Ext()
    
    try{
      retVal.Version  = Long.getLong(inXML.getChild(inXML.$Namespace.qualify("Version")).$Text)
    } catch (e : Exception){
      retVal.Version = null
    }
    return retVal
  }
  
  /**
   * Update the version information from the incoming XML, this will just perform am overrite of the information
   * @param inXML The incoming XML to use for the update
   */
  public function updateItemVersion(inXML : gw.xml.XmlElement){
    var updateXML         = generateItemVersionXML(inXML)
    this.Version       = updateXML.Version
  }    
}
