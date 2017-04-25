package acc.pc.schedule.content.enhancement

enhancement SchedulePremiumDelegate_ExtEnhancement : entity.SchedulePremiumDelegate_Ext {

  public function generatePremiumXML() : acc.pc.schedule.content.model.schedulepremiumdelegate_extmodel.SchedulePremiumDelegate_Ext {
    var retVal = new acc.pc.schedule.content.model.schedulepremiumdelegate_extmodel.SchedulePremiumDelegate_Ext(this)
    return retVal
  }
  
  public function generatePremiumXML(inXML : gw.xml.XmlElement): acc.pc.schedule.content.model.schedulepremiumdelegate_extmodel.SchedulePremiumDelegate_Ext {
    var retVal = new acc.pc.schedule.content.model.schedulepremiumdelegate_extmodel.SchedulePremiumDelegate_Ext()
    retVal.PremiumType1   = inXML.getChild(inXML.$Namespace.qualify("PremiumType1")).$Text
    retVal.PremiumType2   = inXML.getChild(inXML.$Namespace.qualify("PremiumType2")).$Text
    retVal.PremiumType3   = inXML.getChild(inXML.$Namespace.qualify("PremiumType3")).$Text
    retVal.PremiumType4   = inXML.getChild(inXML.$Namespace.qualify("PremiumType4")).$Text
    retVal.PremiumType5   = inXML.getChild(inXML.$Namespace.qualify("PremiumType5")).$Text
    retVal.PremiumType6   = inXML.getChild(inXML.$Namespace.qualify("PremiumType6")).$Text
    retVal.PremiumType7   = inXML.getChild(inXML.$Namespace.qualify("PremiumType7")).$Text
    retVal.PremiumType8   = inXML.getChild(inXML.$Namespace.qualify("PremiumType8")).$Text
    retVal.PremiumType9   = inXML.getChild(inXML.$Namespace.qualify("PremiumType9")).$Text
    retVal.PremiumType10  = inXML.getChild(inXML.$Namespace.qualify("PremiumType10")).$Text
    retVal.Premium1       = acc.pc.schedule.util.ScheduleParseXML_Ext.parseMoney(inXML.getChild(inXML.$Namespace.qualify("Premium1")).$Text)
    retVal.Premium2       = acc.pc.schedule.util.ScheduleParseXML_Ext.parseMoney(inXML.getChild(inXML.$Namespace.qualify("Premium2")).$Text)
    retVal.Premium3       = acc.pc.schedule.util.ScheduleParseXML_Ext.parseMoney(inXML.getChild(inXML.$Namespace.qualify("Premium3")).$Text)
    retVal.Premium4       = acc.pc.schedule.util.ScheduleParseXML_Ext.parseMoney(inXML.getChild(inXML.$Namespace.qualify("Premium4")).$Text)
    retVal.Premium5       = acc.pc.schedule.util.ScheduleParseXML_Ext.parseMoney(inXML.getChild(inXML.$Namespace.qualify("Premium5")).$Text)
    retVal.Premium6       = acc.pc.schedule.util.ScheduleParseXML_Ext.parseMoney(inXML.getChild(inXML.$Namespace.qualify("Premium6")).$Text)
    retVal.Premium7       = acc.pc.schedule.util.ScheduleParseXML_Ext.parseMoney(inXML.getChild(inXML.$Namespace.qualify("Premium7")).$Text)
    retVal.Premium8       = acc.pc.schedule.util.ScheduleParseXML_Ext.parseMoney(inXML.getChild(inXML.$Namespace.qualify("Premium8")).$Text)
    retVal.Premium9       = acc.pc.schedule.util.ScheduleParseXML_Ext.parseMoney(inXML.getChild(inXML.$Namespace.qualify("Premium9")).$Text)
    retVal.Premium10      = acc.pc.schedule.util.ScheduleParseXML_Ext.parseMoney(inXML.getChild(inXML.$Namespace.qualify("Premium10")).$Text)
    return retVal
  }
  
  public function updatePremium(inXML : gw.xml.XmlElement){
    var MoneyXML    = generatePremiumXML(inXML)
    this.PremiumType1   = MoneyXML.PremiumType1
    this.PremiumType2   = MoneyXML.PremiumType2
    this.PremiumType3   = MoneyXML.PremiumType3
    this.PremiumType4   = MoneyXML.PremiumType4
    this.PremiumType5   = MoneyXML.PremiumType5
    this.PremiumType6   = MoneyXML.PremiumType6
    this.PremiumType7   = MoneyXML.PremiumType7
    this.PremiumType8   = MoneyXML.PremiumType8
    this.PremiumType9   = MoneyXML.PremiumType9
    this.PremiumType10  = MoneyXML.PremiumType10
    this.Premium1       = MoneyXML.Premium1
    this.Premium2       = MoneyXML.Premium2
    this.Premium3       = MoneyXML.Premium3
    this.Premium4       = MoneyXML.Premium4
    this.Premium5       = MoneyXML.Premium5
    this.Premium6       = MoneyXML.Premium6
    this.Premium7       = MoneyXML.Premium7
    this.Premium8       = MoneyXML.Premium8
    this.Premium9       = MoneyXML.Premium9
    this.Premium10      = MoneyXML.Premium10
  }
  
}
