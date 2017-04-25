package acc.pc.schedule.functional

class ScheduleBase_Ext implements IScheduleBase_Ext {
  
  private var _linkID : long

  construct() {

  }


  override property set linkID(inLinkID : long) {
    _linkID = inLinkID
  }

  override property get linkID() : long {
    return _linkID
  }

}
