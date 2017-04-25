package gw.webservice.pc.pc900.policy

@Export
@gw.xml.ws.annotation.WsiExportable("http://guidewire.com/pc/ws/gw/webservice/pc/pc900/policy/CommissionPlanInfo")
final class CommissionPlanInfo {

  var _currency : String as Currency

  var _publicId : String as PublicID

}