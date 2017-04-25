package gw.webservice.pc.pc900.policy

@Export
@gw.xml.ws.annotation.WsiExportable("http://guidewire.com/pc/ws/gw/webservice/pc/pc900/policy/ProducerCodeInfo")
final class ProducerCodeInfo {

  var _publicId : String as PublicID

  var _commissionPlanInfos : CommissionPlanInfo[] as CommissionPlanInfos
}