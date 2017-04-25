package acc.pc.schedule.content.enhancement

enhancement ScheduleIdentityDelegate_ExtEnhancement : entity.ScheduleIdentityDelegate_Ext {

  public function generateIdentityXML() : acc.pc.schedule.content.model.scheduleidentitydelegate_extmodel.ScheduleIdentityDelegate_Ext {
    var retVal = new acc.pc.schedule.content.model.scheduleidentitydelegate_extmodel.ScheduleIdentityDelegate_Ext(this)
    return retVal
  }
  
  public function generateIdentityXML(inXML : gw.xml.XmlElement): acc.pc.schedule.content.model.scheduleidentitydelegate_extmodel.ScheduleIdentityDelegate_Ext {
    var retVal = new acc.pc.schedule.content.model.scheduleidentitydelegate_extmodel.ScheduleIdentityDelegate_Ext()
    retVal.IdentityString   = inXML.getChild(inXML.$Namespace.qualify("IdentityString")).$Text
    retVal.IdentityDecimal  = acc.pc.schedule.util.ScheduleParseXML_Ext.parseDecimal(inXML.getChild(inXML.$Namespace.qualify("IdentityDecimal")).$Text)
    retVal.IdentityInteger  = acc.pc.schedule.util.ScheduleParseXML_Ext.parseInteger(inXML.getChild(inXML.$Namespace.qualify("IdentityInteger")).$Text)
    return retVal
  }
  
  public function updateIdentity(inXML : gw.xml.XmlElement){
    var stringXML     = generateIdentityXML(inXML)
    this.IdentityString   = stringXML.IdentityString
    this.IdentityDecimal  = stringXML.IdentityDecimal
    this.IdentityInteger  = stringXML.IdentityInteger
  }
  
}
