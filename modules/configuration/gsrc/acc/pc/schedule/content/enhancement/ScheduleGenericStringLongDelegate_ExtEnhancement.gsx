package acc.pc.schedule.content.enhancement

enhancement ScheduleGenericStringLongDelegate_ExtEnhancement : entity.ScheduleGenericStringLongDelegate_Ext {

  public function generateLongStringXML() : acc.pc.schedule.content.model.schedulegenericstringlongdelegate_extmodel.ScheduleGenericStringLongDelegate_Ext {
    var retVal = new acc.pc.schedule.content.model.schedulegenericstringlongdelegate_extmodel.ScheduleGenericStringLongDelegate_Ext(this)
    return retVal
  }
  
  public function generateLongStringXML(inXML : gw.xml.XmlElement): acc.pc.schedule.content.model.schedulegenericstringlongdelegate_extmodel.ScheduleGenericStringLongDelegate_Ext {
    var retVal = new acc.pc.schedule.content.model.schedulegenericstringlongdelegate_extmodel.ScheduleGenericStringLongDelegate_Ext()
    retVal.LongStringValue1  = inXML.getChild(inXML.$Namespace.qualify("LongStringValue1")).$Text
    retVal.LongStringValue2  = inXML.getChild(inXML.$Namespace.qualify("LongStringValue2")).$Text
    retVal.LongStringValue3  = inXML.getChild(inXML.$Namespace.qualify("LongStringValue3")).$Text
    retVal.LongStringValue4  = inXML.getChild(inXML.$Namespace.qualify("LongStringValue4")).$Text
    retVal.LongStringValue5  = inXML.getChild(inXML.$Namespace.qualify("LongStringValue5")).$Text
    retVal.LongStringValue6  = inXML.getChild(inXML.$Namespace.qualify("LongStringValue6")).$Text
    retVal.LongStringValue7  = inXML.getChild(inXML.$Namespace.qualify("LongStringValue7")).$Text
    retVal.LongStringValue8  = inXML.getChild(inXML.$Namespace.qualify("LongStringValue8")).$Text
    retVal.LongStringValue9  = inXML.getChild(inXML.$Namespace.qualify("LongStringValue9")).$Text
    retVal.LongStringValue10 = inXML.getChild(inXML.$Namespace.qualify("LongStringValue10")).$Text
    return retVal
  }
  
  public function updateLong(inXML : gw.xml.XmlElement){
    var stringXML     = generateLongStringXML(inXML)
    this.LongStringValue1  = stringXML.LongStringValue1
    this.LongStringValue2  = stringXML.LongStringValue2
    this.LongStringValue3  = stringXML.LongStringValue3
    this.LongStringValue4  = stringXML.LongStringValue4
    this.LongStringValue5  = stringXML.LongStringValue5
    this.LongStringValue6  = stringXML.LongStringValue6
    this.LongStringValue7  = stringXML.LongStringValue7
    this.LongStringValue8  = stringXML.LongStringValue8
    this.LongStringValue9  = stringXML.LongStringValue9
    this.LongStringValue10 = stringXML.LongStringValue10
  }
  
}
