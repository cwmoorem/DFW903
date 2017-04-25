package acc.pc.schedule.content.enhancement

enhancement ScheduleStartEndDelegate_ExtEnhancement : entity.ScheduleStartEndDelegate_Ext {
  
  /**
   * Generate XML based on the current entity
   */
  public function generateStartEndXML() : acc.pc.schedule.content.model.schedulestartenddelegate_extmodel.ScheduleStartEndDelegate_Ext {
    var retVal = new acc.pc.schedule.content.model.schedulestartenddelegate_extmodel.ScheduleStartEndDelegate_Ext(this)
    return retVal
  }
  
  /**
   * Generate the Start End XML from the incoming XML
   * @param inXML The incoming XML
   */
  public function generateStartEndXML(inXML : gw.xml.XmlElement): acc.pc.schedule.content.model.schedulestartenddelegate_extmodel.ScheduleStartEndDelegate_Ext {
    var retVal = new acc.pc.schedule.content.model.schedulestartenddelegate_extmodel.ScheduleStartEndDelegate_Ext()
    
    retVal.StartDate = acc.pc.schedule.util.ScheduleParseXML_Ext.parseDate(inXML.getChild(inXML.$Namespace.qualify("StartDate")).$Text)
    retVal.EndDate = acc.pc.schedule.util.ScheduleParseXML_Ext.parseDate(inXML.getChild(inXML.$Namespace.qualify("EndDate")).$Text)
    return retVal
  }
  
  /**
   * Update the start end information from the incoming XML, this will just perform am overrite of the information
   * @param inXML The incoming XML to use for the update
   */
  public function updateStartEnd(inXML : gw.xml.XmlElement){
    var startEndXML    = generateStartEndXML(inXML)
    this.StartDate  = startEndXML.StartDate
    this.EndDate    = startEndXML.EndDate
  }
  
}
