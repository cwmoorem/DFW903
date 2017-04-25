package acc.pc.schedule.content.enhancement

enhancement ScheduleAccountHolderDelegate_ExtEnhancement : entity.ScheduleAccountHolderDelegate_Ext {
  
  public function generateAccountHolderXM() : acc.pc.schedule.content.model.scheduleaccountholderdelegate_extmodel.ScheduleAccountHolderDelegate_Ext {
    var retVal = new acc.pc.schedule.content.model.scheduleaccountholderdelegate_extmodel.ScheduleAccountHolderDelegate_Ext(this)
    return retVal
  }
  
  public function generateAccountHolderXML(inXML : gw.xml.XmlElement): acc.pc.schedule.content.model.scheduleaccountholderdelegate_extmodel.ScheduleAccountHolderDelegate_Ext {
    var retVal = new acc.pc.schedule.content.model.scheduleaccountholderdelegate_extmodel.ScheduleAccountHolderDelegate_Ext()
    retVal.AccountHolderFirstName = inXML.getChild(inXML.$Namespace.qualify("AccountHolderFirstName")).$Text
    retVal.AccountHolderLastName  = inXML.getChild(inXML.$Namespace.qualify("AccountHolderLastName")).$Text
    retVal.AccountHolderFullName  = inXML.getChild(inXML.$Namespace.qualify("AccountHolderFullName")).$Text
    retVal.AccountHolderIDNumber  = inXML.getChild(inXML.$Namespace.qualify("AccountHolderIDNumber")).$Text
    return retVal
  }
  
  public function updateAccountHolder(inXML : gw.xml.XmlElement){
    var peopleXML                  = generateAccountHolderXML(inXML)
    this.AccountHolderFirstName = peopleXML.AccountHolderFirstName
    this.AccountHolderLastName  = peopleXML.AccountHolderLastName
    this.AccountHolderFullName  = peopleXML.AccountHolderFullName
    this.AccountHolderIDNumber  = peopleXML.AccountHolderIDNumber
  }  
  
}
