package acc.pc.schedule.content

class ScheduleContact_Ext implements IScheduleContact_Ext {

  protected var _owner : ScheduleContactDelegate_Ext
  
  construct(inOwner : ScheduleContactDelegate_Ext) {
    _owner = inOwner
  }
  

}
