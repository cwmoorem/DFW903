package acc.pc.schedule.content

class ScheduleVehicle_Ext implements IScheduleVehicle_Ext {

  protected var _owner : ScheduleVehicleDelegate_Ext
  
  construct(inOwner : ScheduleVehicleDelegate_Ext) {
    _owner = inOwner
  }
}
