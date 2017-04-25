package gw.job.uw

uses gw.api.locale.DisplayKey

@Export
class UWIssueApprovalUtil {

  static function throughValue(bp : UWIssueBlockingPoint) : String {
    switch (bp) {
      case TC_BLOCKSQUOTERELEASE : return DisplayKey.get("Web.UWIssue.ThroughValue.Quote")
      case TC_BLOCKSBIND : return DisplayKey.get("Web.UWIssue.ThroughValue.QuoteRelease")
      case TC_BLOCKSISSUANCE : return DisplayKey.get("Web.UWIssue.ThroughValue.Bind")
      case TC_NONBLOCKING : return DisplayKey.get("Web.UWIssue.ThroughValue.Issuance")
      default : return null
    }
  }

  //
  // PRIVATE CONSTRUCTOR
  //
  private construct() {}
}
