package acc.pc.schedule.content

class ScheduleAddress_Ext implements IScheduleAddress_Ext {
  
  protected var _owner : ScheduleAddressDelegate_Ext
  
  construct(inOwner : ScheduleAddressDelegate_Ext) {
    _owner = inOwner
  }


}
