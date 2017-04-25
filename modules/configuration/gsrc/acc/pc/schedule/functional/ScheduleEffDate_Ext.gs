package acc.pc.schedule.functional

class ScheduleEffDate_Ext implements IScheduleEffDate_Ext {

  protected var _owner : ScheduleEffDateDelegate_Ext
  
  construct(inOwner : ScheduleEffDateDelegate_Ext) {
    _owner = inOwner
  }

}
