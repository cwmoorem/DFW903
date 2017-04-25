package acc.pc.schedule.content.enhancement
uses java.lang.Integer
uses java.lang.Exception

enhancement ScheduleGenericIntegerDelegate_ExtEnhancement : entity.ScheduleGenericIntegerDelegate_Ext {

  public function generateGenericIntegerXML() : acc.pc.schedule.content.model.schedulegenericintegerdelegate_extmodel.ScheduleGenericIntegerDelegate_Ext {
    var retVal = new acc.pc.schedule.content.model.schedulegenericintegerdelegate_extmodel.ScheduleGenericIntegerDelegate_Ext(this)
    return retVal
  }
  
  public function generateGenericIntegerXML(inXML : gw.xml.XmlElement): acc.pc.schedule.content.model.schedulegenericintegerdelegate_extmodel.ScheduleGenericIntegerDelegate_Ext {
    var retVal = new acc.pc.schedule.content.model.schedulegenericintegerdelegate_extmodel.ScheduleGenericIntegerDelegate_Ext()
    retVal.IntegerValue1   = acc.pc.schedule.util.ScheduleParseXML_Ext.parseInteger(inXML.getChild(inXML.$Namespace.qualify("IntegerValue1")).$Text)
    retVal.IntegerValue2   = acc.pc.schedule.util.ScheduleParseXML_Ext.parseInteger(inXML.getChild(inXML.$Namespace.qualify("IntegerValue2")).$Text)
    retVal.IntegerValue3   = acc.pc.schedule.util.ScheduleParseXML_Ext.parseInteger(inXML.getChild(inXML.$Namespace.qualify("IntegerValue3")).$Text)
    retVal.IntegerValue4   = acc.pc.schedule.util.ScheduleParseXML_Ext.parseInteger(inXML.getChild(inXML.$Namespace.qualify("IntegerValue4")).$Text)
    retVal.IntegerValue5   = acc.pc.schedule.util.ScheduleParseXML_Ext.parseInteger(inXML.getChild(inXML.$Namespace.qualify("IntegerValue5")).$Text)
    retVal.IntegerValue6   = acc.pc.schedule.util.ScheduleParseXML_Ext.parseInteger(inXML.getChild(inXML.$Namespace.qualify("IntegerValue6")).$Text)
    retVal.IntegerValue7   = acc.pc.schedule.util.ScheduleParseXML_Ext.parseInteger(inXML.getChild(inXML.$Namespace.qualify("IntegerValue7")).$Text)
    retVal.IntegerValue8   = acc.pc.schedule.util.ScheduleParseXML_Ext.parseInteger(inXML.getChild(inXML.$Namespace.qualify("IntegerValue8")).$Text)
    retVal.IntegerValue9   = acc.pc.schedule.util.ScheduleParseXML_Ext.parseInteger(inXML.getChild(inXML.$Namespace.qualify("IntegerValue9")).$Text)
    retVal.IntegerValue10  = acc.pc.schedule.util.ScheduleParseXML_Ext.parseInteger(inXML.getChild(inXML.$Namespace.qualify("IntegerValue10")).$Text)
    return retVal
  }
  
  public function updateInteger(inXML : gw.xml.XmlElement){
    var IntegerXML    = generateGenericIntegerXML(inXML)
    this.IntegerValue1   = IntegerXML.IntegerValue1
    this.IntegerValue2   = IntegerXML.IntegerValue2
    this.IntegerValue3   = IntegerXML.IntegerValue3
    this.IntegerValue4   = IntegerXML.IntegerValue4
    this.IntegerValue5   = IntegerXML.IntegerValue5
    this.IntegerValue6   = IntegerXML.IntegerValue6
    this.IntegerValue7   = IntegerXML.IntegerValue7
    this.IntegerValue8   = IntegerXML.IntegerValue8
    this.IntegerValue9   = IntegerXML.IntegerValue9
    this.IntegerValue10  = IntegerXML.IntegerValue10
  }
  
 
  
}
