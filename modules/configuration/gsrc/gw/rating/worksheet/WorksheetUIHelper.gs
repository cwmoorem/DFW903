package gw.rating.worksheet
uses gw.api.tree.RowTreeRootNode
uses gw.rating.worksheet.treenode.WorksheetTreeNodeUtil
uses java.math.BigDecimal
uses gw.api.util.NumberUtil
uses java.lang.Double
uses java.lang.Float

@Export
class WorksheetUIHelper {
  public static var MAXIMUM_SCALE : int = 8
  public static var ELLIPSES : String = "..."

  static function getWorksheetRootNode(line : PolicyLine, showConditionals: boolean) : RowTreeRootNode {
    if (line.Branch.ValidQuote) {
      return line.getWorksheetRootNode(showConditionals)
    } else {
      var diagWorksheets = line.Branch.Lines*.DiagnosticRatingWorksheets.toList()
      return WorksheetTreeNodeUtil.buildRootNodeForDiagWorksheets(diagWorksheets, showConditionals)
    }
  }

  static function canViewWorksheets(policyLine : PolicyLine) : boolean {
    return canViewRegularWorksheet(policyLine) || canViewDiagnosticWorksheet(policyLine)
  }

  static function canViewRegularWorksheet(policyLine : PolicyLine) : boolean {
    return isAuthorized() && policyLine.Branch.HasWorksheets == AVAILABLE
  }

  static function canViewDiagnosticWorksheet(policyLine : PolicyLine) : boolean {
    return isAuthorized() && policyLine.DiagnosticRatingWorksheets.HasElements
  }

  static function isAuthorized() : boolean {
    return perm.System.ratingworksheetview
  }

  static function format(obj : Object) : String {
    if (obj typeis BigDecimal or obj typeis Double or obj typeis Float) {
      return formatBigDecimal(obj as BigDecimal)
    }
    if (obj typeis java.lang.Number) {
      return NumberUtil.render(obj)
    }
    return obj as String
  }

  static function formatBigDecimal(bd : BigDecimal) : String{
    if (bd.scale() > MAXIMUM_SCALE)  {
      var bigDecimalFormatted = NumberUtil.renderForInput(bd.setScale(MAXIMUM_SCALE, BigDecimal.ROUND_DOWN), false)
      return bigDecimalFormatted + ELLIPSES
    }
    else if (bd.scale() < 0) {
      return NumberUtil.renderForInput(bd.setScale(0, BigDecimal.ROUND_HALF_UP), false)
    } else {
      return NumberUtil.renderForInput(bd, false)
    }

  }

}
