package acc.pc.schedule.content.enhancement

enhancement ScheduleSumInsuredDelegate_ExtEnhancement : entity.ScheduleSumInsuredDelegate_Ext {

  public function generateSumInsuredXML() : acc.pc.schedule.content.model.schedulesuminsureddelegate_extmodel.ScheduleSumInsuredDelegate_Ext {
    var retVal = new acc.pc.schedule.content.model.schedulesuminsureddelegate_extmodel.ScheduleSumInsuredDelegate_Ext(this)
    return retVal
  }
  
  public function generateSumInsuredXML(inXML : gw.xml.XmlElement): acc.pc.schedule.content.model.schedulesuminsureddelegate_extmodel.ScheduleSumInsuredDelegate_Ext {
    var retVal = new acc.pc.schedule.content.model.schedulesuminsureddelegate_extmodel.ScheduleSumInsuredDelegate_Ext()
    retVal.SumInsuredType1   = inXML.getChild(inXML.$Namespace.qualify("SumInsuredType1")).$Text
    retVal.SumInsuredType2   = inXML.getChild(inXML.$Namespace.qualify("SumInsuredType2")).$Text
    retVal.SumInsuredType3   = inXML.getChild(inXML.$Namespace.qualify("SumInsuredType3")).$Text
    retVal.SumInsuredType4   = inXML.getChild(inXML.$Namespace.qualify("SumInsuredType4")).$Text
    retVal.SumInsuredType5   = inXML.getChild(inXML.$Namespace.qualify("SumInsuredType5")).$Text
    retVal.SumInsuredType6   = inXML.getChild(inXML.$Namespace.qualify("SumInsuredType6")).$Text
    retVal.SumInsuredType7   = inXML.getChild(inXML.$Namespace.qualify("SumInsuredType7")).$Text
    retVal.SumInsuredType8   = inXML.getChild(inXML.$Namespace.qualify("SumInsuredType8")).$Text
    retVal.SumInsuredType9   = inXML.getChild(inXML.$Namespace.qualify("SumInsuredType9")).$Text
    retVal.SumInsuredType10  = inXML.getChild(inXML.$Namespace.qualify("SumInsuredType10")).$Text
    retVal.SumInsured1       = acc.pc.schedule.util.ScheduleParseXML_Ext.parseMoney(inXML.getChild(inXML.$Namespace.qualify("SumInsured1")).$Text)
    retVal.SumInsured2       = acc.pc.schedule.util.ScheduleParseXML_Ext.parseMoney(inXML.getChild(inXML.$Namespace.qualify("SumInsured2")).$Text)
    retVal.SumInsured3       = acc.pc.schedule.util.ScheduleParseXML_Ext.parseMoney(inXML.getChild(inXML.$Namespace.qualify("SumInsured3")).$Text)
    retVal.SumInsured4       = acc.pc.schedule.util.ScheduleParseXML_Ext.parseMoney(inXML.getChild(inXML.$Namespace.qualify("SumInsured4")).$Text)
    retVal.SumInsured5       = acc.pc.schedule.util.ScheduleParseXML_Ext.parseMoney(inXML.getChild(inXML.$Namespace.qualify("SumInsured5")).$Text)
    retVal.SumInsured6       = acc.pc.schedule.util.ScheduleParseXML_Ext.parseMoney(inXML.getChild(inXML.$Namespace.qualify("SumInsured6")).$Text)
    retVal.SumInsured7       = acc.pc.schedule.util.ScheduleParseXML_Ext.parseMoney(inXML.getChild(inXML.$Namespace.qualify("SumInsured7")).$Text)
    retVal.SumInsured8       = acc.pc.schedule.util.ScheduleParseXML_Ext.parseMoney(inXML.getChild(inXML.$Namespace.qualify("SumInsured8")).$Text)
    retVal.SumInsured9       = acc.pc.schedule.util.ScheduleParseXML_Ext.parseMoney(inXML.getChild(inXML.$Namespace.qualify("SumInsured9")).$Text)
    retVal.SumInsured10      = acc.pc.schedule.util.ScheduleParseXML_Ext.parseMoney(inXML.getChild(inXML.$Namespace.qualify("SumInsured10")).$Text)
    return retVal
  }
  
  public function updateSumInsured(inXML : gw.xml.XmlElement){
    var MoneyXML    = generateSumInsuredXML(inXML)
    this.SumInsuredType1   = MoneyXML.SumInsuredType1
    this.SumInsuredType2   = MoneyXML.SumInsuredType2
    this.SumInsuredType3   = MoneyXML.SumInsuredType3
    this.SumInsuredType4   = MoneyXML.SumInsuredType4
    this.SumInsuredType5   = MoneyXML.SumInsuredType5
    this.SumInsuredType6   = MoneyXML.SumInsuredType6
    this.SumInsuredType7   = MoneyXML.SumInsuredType7
    this.SumInsuredType8   = MoneyXML.SumInsuredType8
    this.SumInsuredType9   = MoneyXML.SumInsuredType9
    this.SumInsuredType10  = MoneyXML.SumInsuredType10
    this.SumInsured1       = MoneyXML.SumInsured1
    this.SumInsured2       = MoneyXML.SumInsured2
    this.SumInsured3       = MoneyXML.SumInsured3
    this.SumInsured4       = MoneyXML.SumInsured4
    this.SumInsured5       = MoneyXML.SumInsured5
    this.SumInsured6       = MoneyXML.SumInsured6
    this.SumInsured7       = MoneyXML.SumInsured7
    this.SumInsured8       = MoneyXML.SumInsured8
    this.SumInsured9       = MoneyXML.SumInsured9
    this.SumInsured10      = MoneyXML.SumInsured10
  }
  
  
}
