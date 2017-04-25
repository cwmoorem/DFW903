package acc.pc.schedule.content

class ScheduleStartEnd_Ext implements IScheduleStartEnd_Ext {

  protected var _owner : ScheduleStartEndDelegate_Ext
  
  construct(inOwner : ScheduleStartEndDelegate_Ext) {
    _owner = inOwner
  }

}
