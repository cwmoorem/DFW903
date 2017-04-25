package acc.pc.schedule.functional

class ScheduleItemEffDate_Ext implements IScheduleItemEffDate_Ext {

  protected var _owner : ScheduleItemEffDateDelegate_Ext
  
  construct(inOwner : ScheduleItemEffDateDelegate_Ext) {
    _owner = inOwner
  }

}
