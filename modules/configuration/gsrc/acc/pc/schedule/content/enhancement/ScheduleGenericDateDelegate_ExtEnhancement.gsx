package acc.pc.schedule.content.enhancement

enhancement ScheduleGenericDateDelegate_ExtEnhancement : entity.ScheduleGenericDateDelegate_Ext {

  public function generateGenericDateXML() : acc.pc.schedule.content.model.schedulegenericdatedelegate_extmodel.ScheduleGenericDateDelegate_Ext {
    var retVal = new acc.pc.schedule.content.model.schedulegenericdatedelegate_extmodel.ScheduleGenericDateDelegate_Ext(this)
    return retVal
  }
  
  public function generateGenericDateXML(inXML : gw.xml.XmlElement): acc.pc.schedule.content.model.schedulegenericdatedelegate_extmodel.ScheduleGenericDateDelegate_Ext {
    var retVal = new acc.pc.schedule.content.model.schedulegenericdatedelegate_extmodel.ScheduleGenericDateDelegate_Ext()
    retVal.DateValue1   = acc.pc.schedule.util.ScheduleParseXML_Ext.parseDate(inXML.getChild(inXML.$Namespace.qualify("DateValue1")).$Text)
    retVal.DateValue2   = acc.pc.schedule.util.ScheduleParseXML_Ext.parseDate(inXML.getChild(inXML.$Namespace.qualify("DateValue2")).$Text)
    retVal.DateValue3   = acc.pc.schedule.util.ScheduleParseXML_Ext.parseDate(inXML.getChild(inXML.$Namespace.qualify("DateValue3")).$Text)
    retVal.DateValue4   = acc.pc.schedule.util.ScheduleParseXML_Ext.parseDate(inXML.getChild(inXML.$Namespace.qualify("DateValue4")).$Text)
    retVal.DateValue5   = acc.pc.schedule.util.ScheduleParseXML_Ext.parseDate(inXML.getChild(inXML.$Namespace.qualify("DateValue5")).$Text)
    retVal.DateValue6   = acc.pc.schedule.util.ScheduleParseXML_Ext.parseDate(inXML.getChild(inXML.$Namespace.qualify("DateValue6")).$Text)
    retVal.DateValue7   = acc.pc.schedule.util.ScheduleParseXML_Ext.parseDate(inXML.getChild(inXML.$Namespace.qualify("DateValue7")).$Text)
    retVal.DateValue8   = acc.pc.schedule.util.ScheduleParseXML_Ext.parseDate(inXML.getChild(inXML.$Namespace.qualify("DateValue8")).$Text)
    retVal.DateValue9   = acc.pc.schedule.util.ScheduleParseXML_Ext.parseDate(inXML.getChild(inXML.$Namespace.qualify("DateValue9")).$Text)
    retVal.DateValue10  = acc.pc.schedule.util.ScheduleParseXML_Ext.parseDate(inXML.getChild(inXML.$Namespace.qualify("DateValue10")).$Text)
    return retVal
  }
  
  public function updateDate(inXML : gw.xml.XmlElement){
    var dateXML    = generateGenericDateXML(inXML)
    this.DateValue1   = dateXML.DateValue1
    this.DateValue2   = dateXML.DateValue2
    this.DateValue3   = dateXML.DateValue3
    this.DateValue4   = dateXML.DateValue4
    this.DateValue5   = dateXML.DateValue5
    this.DateValue6   = dateXML.DateValue6
    this.DateValue7   = dateXML.DateValue7
    this.DateValue8   = dateXML.DateValue8
    this.DateValue9   = dateXML.DateValue9
    this.DateValue10  = dateXML.DateValue10
  } 
}
