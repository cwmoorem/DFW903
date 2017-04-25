package gw.lob.ba

uses java.util.Date

/**
 * This class exists to aggregate the implementations of gw.api.domain.CoverableAdapter,
 * gw.api.domain.ModifiableAdapter, and gw.api.domain.CoverageSymbolGroupAdapter for BusinessAutoLine. These interfaces
 * have overlapping methods, so they must be implemented via a single class.
 */
@Export
class BALineCoverableModifiableCoverageSymbolGroupAdapter
    implements gw.api.domain.CoverableAdapter, gw.api.domain.ModifiableAdapter,
               gw.api.domain.CoverageSymbolGroupAdapter {
  delegate _coverableAdapter represents gw.api.domain.CoverableAdapter
  delegate _modifiableAdapter represents gw.api.domain.ModifiableAdapter
  delegate _coverageSymbolGroupAdapter represents gw.api.domain.CoverageSymbolGroupAdapter

  construct(owner: entity.BusinessAutoLine) {
    _coverableAdapter = new gw.lob.ba.BALineCoverableAdapter (owner)
    _modifiableAdapter = new gw.lob.ba.BALineModifiableAdapter (owner)
    _coverageSymbolGroupAdapter = new gw.lob.ba.BALineCoverageSymbolGroupAdapter (owner)
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