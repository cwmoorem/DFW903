package acc.pc.schedule.content.enhancement

enhancement ScheduleGenericDecimalDelegate_ExtEnhancement : entity.ScheduleGenericDecimalDelegate_Ext {

  public function generateGenericDecimalXML() : acc.pc.schedule.content.model.schedulegenericdecimaldelegate_extmodel.ScheduleGenericDecimalDelegate_Ext {
    var retVal = new acc.pc.schedule.content.model.schedulegenericdecimaldelegate_extmodel.ScheduleGenericDecimalDelegate_Ext(this)
    return retVal
  }
  
  public function generateGenericDecimalXML(inXML : gw.xml.XmlElement): acc.pc.schedule.content.model.schedulegenericdecimaldelegate_extmodel.ScheduleGenericDecimalDelegate_Ext {
    var retVal = new acc.pc.schedule.content.model.schedulegenericdecimaldelegate_extmodel.ScheduleGenericDecimalDelegate_Ext()
    retVal.DecimalValue1   = acc.pc.schedule.util.ScheduleParseXML_Ext.parseDecimal(inXML.getChild(inXML.$Namespace.qualify("DecimalValue1")).$Text)
    retVal.DecimalValue2   = acc.pc.schedule.util.ScheduleParseXML_Ext.parseDecimal(inXML.getChild(inXML.$Namespace.qualify("DecimalValue2")).$Text)
    retVal.DecimalValue3   = acc.pc.schedule.util.ScheduleParseXML_Ext.parseDecimal(inXML.getChild(inXML.$Namespace.qualify("DecimalValue3")).$Text)
    retVal.DecimalValue4   = acc.pc.schedule.util.ScheduleParseXML_Ext.parseDecimal(inXML.getChild(inXML.$Namespace.qualify("DecimalValue4")).$Text)
    retVal.DecimalValue5   = acc.pc.schedule.util.ScheduleParseXML_Ext.parseDecimal(inXML.getChild(inXML.$Namespace.qualify("DecimalValue5")).$Text)
    retVal.DecimalValue6   = acc.pc.schedule.util.ScheduleParseXML_Ext.parseDecimal(inXML.getChild(inXML.$Namespace.qualify("DecimalValue6")).$Text)
    retVal.DecimalValue7   = acc.pc.schedule.util.ScheduleParseXML_Ext.parseDecimal(inXML.getChild(inXML.$Namespace.qualify("DecimalValue7")).$Text)
    retVal.DecimalValue8   = acc.pc.schedule.util.ScheduleParseXML_Ext.parseDecimal(inXML.getChild(inXML.$Namespace.qualify("DecimalValue8")).$Text)
    retVal.DecimalValue9   = acc.pc.schedule.util.ScheduleParseXML_Ext.parseDecimal(inXML.getChild(inXML.$Namespace.qualify("DecimalValue9")).$Text)
    retVal.DecimalValue10  = acc.pc.schedule.util.ScheduleParseXML_Ext.parseDecimal(inXML.getChild(inXML.$Namespace.qualify("DecimalValue10")).$Text)
    return retVal
  }
  
  public function updateDecimal(inXML : gw.xml.XmlElement){
    var DecimalXML    = generateGenericDecimalXML(inXML)
    this.DecimalValue1   = DecimalXML.DecimalValue1
    this.DecimalValue2   = DecimalXML.DecimalValue2
    this.DecimalValue3   = DecimalXML.DecimalValue3
    this.DecimalValue4   = DecimalXML.DecimalValue4
    this.DecimalValue5   = DecimalXML.DecimalValue5
    this.DecimalValue6   = DecimalXML.DecimalValue6
    this.DecimalValue7   = DecimalXML.DecimalValue7
    this.DecimalValue8   = DecimalXML.DecimalValue8
    this.DecimalValue9   = DecimalXML.DecimalValue9
    this.DecimalValue10  = DecimalXML.DecimalValue10
  }
}
