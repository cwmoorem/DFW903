package acc.pc.schedule.functional.enhancement
uses java.text.SimpleDateFormat
uses java.lang.Exception
uses java.lang.Long

enhancement ScheduleItemUpdateDelegate_ExtEnhancement : entity.ScheduleItemUpdateDelegate_Ext {

  /**
   * Generate XML based on the current entity
   */
  public function generateUpdateXML() : acc.pc.schedule.functional.model.scheduleitemupdatedelegate_extmodel.ScheduleItemUpdateDelegate_Ext {
    var retVal = new  acc.pc.schedule.functional.model.scheduleitemupdatedelegate_extmodel.ScheduleItemUpdateDelegate_Ext(this)
    return retVal
  }
  
  /**
   * Generate the Address XML from the incoming XML
   * @param inXML The incoming XML
   */
  public function generateItemUpdateXML(inXML : gw.xml.XmlElement) :  acc.pc.schedule.functional.model.scheduleitemupdatedelegate_extmodel.ScheduleItemUpdateDelegate_Ext {
    var retVal = new  acc.pc.schedule.functional.model.scheduleitemupdatedelegate_extmodel.ScheduleItemUpdateDelegate_Ext()
   
    try {
      retVal.StartDate  = new SimpleDateFormat("yyyy-MM-dd").parse(inXML.getChild(inXML.$Namespace.qualify("StartDate")).$Text)
    } catch (e : Exception){
      retVal.StartDate = null
    }
    
    try{
      retVal.EndDate    = new SimpleDateFormat("yyyy-MM-dd").parse(inXML.getChild(inXML.$Namespace.qualify("EndDate")).$Text)
    } catch (e : Exception){
      retVal.EndDate = null
    }
    
    try{
      retVal.FixedId  = Long.getLong(inXML.getChild(inXML.$Namespace.qualify("FixedId")).$Text)
    } catch (e : Exception){
      retVal.FixedId = null
    }
    return retVal
  }
  
  /**
   * Update the address information from the incoming XML, this will just perform am overrite of the information
   * @param inXML The incoming XML to use for the update
   */
  public function updateItemUpdate(inXML : gw.xml.XmlElement){
    var updateXML         = generateItemUpdateXML(inXML)
    this.EndDate       = updateXML.EndDate
    this.StartDate     = updateXML.StartDate
    this.FixedId       = updateXML.FixedId
  }  

}
