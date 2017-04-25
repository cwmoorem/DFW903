package acc.pc.schedule.content

class SchedulePeople_EXt implements ISchedulePeople_Ext {

  protected var _owner : SchedulePeopleDelegate_Ext
  
  construct(inOwner : SchedulePeopleDelegate_Ext) {
    _owner = inOwner
  }
}
