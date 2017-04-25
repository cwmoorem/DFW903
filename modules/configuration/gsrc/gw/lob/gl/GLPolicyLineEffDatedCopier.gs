package gw.lob.gl

uses gw.lob.common.AbstractPolicyLineCopier

@Export
class GLPolicyLineEffDatedCopier extends AbstractPolicyLineCopier<GeneralLiabilityLine> {

  construct(line : GeneralLiabilityLine) {
    super(line)
  }
  
  override protected function copyLineSpecificFields(line : GeneralLiabilityLine) {
    _bean.LocationLimits = line.LocationLimits
    _bean.PollutionCleanupExp = line.PollutionCleanupExp
    _bean.ClaimsMadeOrigEffDate = line.ClaimsMadeOrigEffDate
    _bean.RetroactiveDate = line.RetroactiveDate
    _bean.SplitLimits = line.SplitLimits
  }

}
