package acc.pc.schedule.content.enhancement

enhancement ScheduleExternalPolicyDelegate_ExtEnhancement : entity.ScheduleExternalPolicyDelegate_Ext {

  public function generateExternalPolicyXML() : acc.pc.schedule.content.model.scheduleexternalpolicydelegate_extmodel.ScheduleExternalPolicyDelegate_Ext {
    var retVal = new acc.pc.schedule.content.model.scheduleexternalpolicydelegate_extmodel.ScheduleExternalPolicyDelegate_Ext(this)
    return retVal
  }
  
  public function generateExternalPolicyXML(inXML : gw.xml.XmlElement): acc.pc.schedule.content.model.scheduleexternalpolicydelegate_extmodel.ScheduleExternalPolicyDelegate_Ext {
    var retVal = new acc.pc.schedule.content.model.scheduleexternalpolicydelegate_extmodel.ScheduleExternalPolicyDelegate_Ext()
    retVal.ExternalPolicyEndDate              = acc.pc.schedule.util.ScheduleParseXML_Ext.parseDate(inXML.getChild(inXML.$Namespace.qualify("ExternalPolicyEndDate")).$Text)
    retVal.ExternalPolicyNumber               = inXML.getChild(inXML.$Namespace.qualify("ExternalPolicyNumber")).$Text
    retVal.ExternalPolicyPremium              = acc.pc.schedule.util.ScheduleParseXML_Ext.parseMoney(inXML.getChild(inXML.$Namespace.qualify("ExternalPolicyPremium")).$Text)
    retVal.ExternalPolicyStartDate            = acc.pc.schedule.util.ScheduleParseXML_Ext.parseDate(inXML.getChild(inXML.$Namespace.qualify("ExternalPolicyStartDate")).$Text)
    retVal.ExternalVariant                    = inXML.getChild(inXML.$Namespace.qualify("ExternalVariant")).$Text
    return retVal
  }
  
  public function updateExternalPolicy(inXML : gw.xml.XmlElement){
    var policyXML                              = generateExternalPolicyXML(inXML)
    this.ExternalPolicyEndDate              = policyXML.ExternalPolicyEndDate
    this.ExternalPolicyNumber               = policyXML.ExternalPolicyNumber
    this.ExternalPolicyPremium              = policyXML.ExternalPolicyPremium
    this.ExternalPolicyStartDate            = policyXML.ExternalPolicyStartDate
    this.ExternalVariant                    = policyXML.ExternalVariant
  }  
  
}
