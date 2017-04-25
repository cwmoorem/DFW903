package acc.pc.schedule.content.enhancement

enhancement ScheduleGenericStringShortDelegate_ExtEnhancement : entity.ScheduleGenericStringShortDelegate_Ext {

  public function generateShortStringXML() : acc.pc.schedule.content.model.schedulegenericstringshortdelegate_extmodel.ScheduleGenericStringShortDelegate_Ext {
    var retVal = new acc.pc.schedule.content.model.schedulegenericstringshortdelegate_extmodel.ScheduleGenericStringShortDelegate_Ext(this)
    return retVal
  }
  
  public function generateShortStringXML(inXML : gw.xml.XmlElement): acc.pc.schedule.content.model.schedulegenericstringshortdelegate_extmodel.ScheduleGenericStringShortDelegate_Ext {
    var retVal = new acc.pc.schedule.content.model.schedulegenericstringshortdelegate_extmodel.ScheduleGenericStringShortDelegate_Ext()
    retVal.StringValue1  = inXML.getChild(inXML.$Namespace.qualify("StringValue1")).$Text
    retVal.StringValue2  = inXML.getChild(inXML.$Namespace.qualify("StringValue2")).$Text
    retVal.StringValue3  = inXML.getChild(inXML.$Namespace.qualify("StringValue3")).$Text
    retVal.StringValue4  = inXML.getChild(inXML.$Namespace.qualify("StringValue4")).$Text
    retVal.StringValue5  = inXML.getChild(inXML.$Namespace.qualify("StringValue5")).$Text
    retVal.StringValue6  = inXML.getChild(inXML.$Namespace.qualify("StringValue6")).$Text
    retVal.StringValue7  = inXML.getChild(inXML.$Namespace.qualify("StringValue7")).$Text
    retVal.StringValue8  = inXML.getChild(inXML.$Namespace.qualify("StringValue8")).$Text
    retVal.StringValue9  = inXML.getChild(inXML.$Namespace.qualify("StringValue9")).$Text
    retVal.StringValue10 = inXML.getChild(inXML.$Namespace.qualify("StringValue10")).$Text
    return retVal
  }
  
  public function updateShort(inXML : gw.xml.XmlElement){
    var stringXML     = generateShortStringXML(inXML)
    this.StringValue1  = stringXML.StringValue1
    this.StringValue2  = stringXML.StringValue2
    this.StringValue3  = stringXML.StringValue3
    this.StringValue4  = stringXML.StringValue4
    this.StringValue5  = stringXML.StringValue5
    this.StringValue6  = stringXML.StringValue6
    this.StringValue7  = stringXML.StringValue7
    this.StringValue8  = stringXML.StringValue8
    this.StringValue9  = stringXML.StringValue9
    this.StringValue10 = stringXML.StringValue10
  }
  
}
