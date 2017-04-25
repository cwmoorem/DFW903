package acc.pc.schedule.content.enhancement

enhancement ScheduleCardHolderDelegate_ExtEnhancement : entity.ScheduleCardHolderDelegate_Ext {

  public function generateAccountHolderXML() : acc.pc.schedule.content.model.schedulecardholderdelegate_extmodel.ScheduleCardHolderDelegate_Ext {
    var retVal = new acc.pc.schedule.content.model.schedulecardholderdelegate_extmodel.ScheduleCardHolderDelegate_Ext(this)
    return retVal
  }
  
  public function generateCardHolderXML(inXML : gw.xml.XmlElement): acc.pc.schedule.content.model.schedulecardholderdelegate_extmodel.ScheduleCardHolderDelegate_Ext {
    var retVal = new acc.pc.schedule.content.model.schedulecardholderdelegate_extmodel.ScheduleCardHolderDelegate_Ext()
    retVal.CardHolderFirstName = inXML.getChild(inXML.$Namespace.qualify("CardHolderFirstName")).$Text
    retVal.CardHolderLastName  = inXML.getChild(inXML.$Namespace.qualify("CardHolderLastName")).$Text
    retVal.CardHolderFullName  = inXML.getChild(inXML.$Namespace.qualify("CardHolderFullName")).$Text
    return retVal
  }
  
  public function updateCardHolder(inXML : gw.xml.XmlElement){
    var peopleXML               = generateCardHolderXML(inXML)
    this.CardHolderFirstName = peopleXML.CardHolderFirstName
    this.CardHolderLastName  = peopleXML.CardHolderLastName
    this.CardHolderFullName  = peopleXML.CardHolderFullName
  } 
  
}
