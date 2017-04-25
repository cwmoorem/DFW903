package gw.lob.cp

uses java.util.Date

/**
 * This class exists to aggregate the implementations of gw.api.domain.CoverableAdapter and
 * gw.api.domain.ModifiableAdapter for CommericalPropertyLine. These interfaces have overlapping methods, so they must
 * be implemented via a single class.
 */
@Export
class CPLineCoverableModifiableAdapter
    implements gw.api.domain.CoverableAdapter, gw.api.domain.ModifiableAdapter {
  delegate _coverableAdapter represents gw.api.domain.CoverableAdapter
  delegate _modifiableAdapter represents gw.api.domain.ModifiableAdapter

  construct(owner: entity.CommercialPropertyLine) {
    _coverableAdapter = new gw.lob.cp.CPLineCoverableAdapter (owner)
    _modifiableAdapter = new gw.lob.cp.CPLineModifiableAdapter (owner)
  }

  override property get PolicyLine() : PolicyLine {
    return _coverableAdapter.PolicyLine
  }

  override property  get State() : Jurisdiction {
    return _coverableAdapter.State
  }

  override property get ReferenceDateInternal() : Date {
    return _coverableAdapter.ReferenceDateInternal
  }

  override property set ReferenceDateInternal(d : Date)  {
    _coverableAdapter.ReferenceDateInternal = d
  }
}