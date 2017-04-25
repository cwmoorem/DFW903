package acc.pc.schedule.content.enhancement

enhancement ScheduleGenericMoneyDelegate_ExtEnhancement : entity.ScheduleGenericMoneyDelegate_Ext {
  
  public function generateGenericMoneyXML() : acc.pc.schedule.content.model.schedulegenericmoneydelegate_extmodel.ScheduleGenericMoneyDelegate_Ext {
    var retVal = new acc.pc.schedule.content.model.schedulegenericmoneydelegate_extmodel.ScheduleGenericMoneyDelegate_Ext(this)
    return retVal
  }
  
  public function generateGenericMoneyXML(inXML : gw.xml.XmlElement): acc.pc.schedule.content.model.schedulegenericmoneydelegate_extmodel.ScheduleGenericMoneyDelegate_Ext {
    var retVal = new acc.pc.schedule.content.model.schedulegenericmoneydelegate_extmodel.ScheduleGenericMoneyDelegate_Ext()
    retVal.MoneyValue1   = acc.pc.schedule.util.ScheduleParseXML_Ext.parseMoney(inXML.getChild(inXML.$Namespace.qualify("MoneyValue1")).$Text)
    retVal.MoneyValue2   = acc.pc.schedule.util.ScheduleParseXML_Ext.parseMoney(inXML.getChild(inXML.$Namespace.qualify("MoneyValue2")).$Text)
    retVal.MoneyValue3   = acc.pc.schedule.util.ScheduleParseXML_Ext.parseMoney(inXML.getChild(inXML.$Namespace.qualify("MoneyValue3")).$Text)
    retVal.MoneyValue4   = acc.pc.schedule.util.ScheduleParseXML_Ext.parseMoney(inXML.getChild(inXML.$Namespace.qualify("MoneyValue4")).$Text)
    retVal.MoneyValue5   = acc.pc.schedule.util.ScheduleParseXML_Ext.parseMoney(inXML.getChild(inXML.$Namespace.qualify("MoneyValue5")).$Text)
    retVal.MoneyValue6   = acc.pc.schedule.util.ScheduleParseXML_Ext.parseMoney(inXML.getChild(inXML.$Namespace.qualify("MoneyValue6")).$Text)
    retVal.MoneyValue7   = acc.pc.schedule.util.ScheduleParseXML_Ext.parseMoney(inXML.getChild(inXML.$Namespace.qualify("MoneyValue7")).$Text)
    retVal.MoneyValue8   = acc.pc.schedule.util.ScheduleParseXML_Ext.parseMoney(inXML.getChild(inXML.$Namespace.qualify("MoneyValue8")).$Text)
    retVal.MoneyValue9   = acc.pc.schedule.util.ScheduleParseXML_Ext.parseMoney(inXML.getChild(inXML.$Namespace.qualify("MoneyValue9")).$Text)
    retVal.MoneyValue10  = acc.pc.schedule.util.ScheduleParseXML_Ext.parseMoney(inXML.getChild(inXML.$Namespace.qualify("MoneyValue10")).$Text)
    return retVal
  }
  
  public function updateMoney(inXML : gw.xml.XmlElement){
    var MoneyXML    = generateGenericMoneyXML(inXML)
    this.MoneyValue1   = MoneyXML.MoneyValue1
    this.MoneyValue2   = MoneyXML.MoneyValue2
    this.MoneyValue3   = MoneyXML.MoneyValue3
    this.MoneyValue4   = MoneyXML.MoneyValue4
    this.MoneyValue5   = MoneyXML.MoneyValue5
    this.MoneyValue6   = MoneyXML.MoneyValue6
    this.MoneyValue7   = MoneyXML.MoneyValue7
    this.MoneyValue8   = MoneyXML.MoneyValue8
    this.MoneyValue9   = MoneyXML.MoneyValue9
    this.MoneyValue10  = MoneyXML.MoneyValue10
  }
  
  
  
}
