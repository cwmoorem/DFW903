package acc.pc.schedule.content.enhancement

enhancement SchedulePeopleDelegate_ExtEnhancement : entity.SchedulePeopleDelegate_Ext {
  
  public function generatePeopleXML() : acc.pc.schedule.content.model.schedulepeopledelegate_extmodel.SchedulePeopleDelegate_Ext {
    var retVal = new acc.pc.schedule.content.model.schedulepeopledelegate_extmodel.SchedulePeopleDelegate_Ext(this)
    return retVal
  }
  
  public function generatePeopleXML(inXML : gw.xml.XmlElement): acc.pc.schedule.content.model.schedulepeopledelegate_extmodel.SchedulePeopleDelegate_Ext {
    var retVal = new acc.pc.schedule.content.model.schedulepeopledelegate_extmodel.SchedulePeopleDelegate_Ext()
    retVal.FirstName = inXML.getChild(inXML.$Namespace.qualify("FirstName")).$Text
    retVal.LastName  = inXML.getChild(inXML.$Namespace.qualify("LastName")).$Text
    retVal.FullName  = inXML.getChild(inXML.$Namespace.qualify("FullName")).$Text
    return retVal
  }
  
  public function updatePeople(inXML : gw.xml.XmlElement){
    var peopleXML     = generatePeopleXML(inXML)
    this.FirstName = peopleXML.FirstName
    this.LastName  = peopleXML.LastName
    this.FullName  = peopleXML.FullName
  }
  
}
