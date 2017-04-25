package gw.lob.ba

uses java.util.Date

/**
 * This class exists to aggregate the implementations of gw.api.domain.CoverableAdapter,
 * gw.api.domain.ModifiableAdapter, and gw.api.contact.AdditionalInterestContainer for BusinessVehicle. These interfaces
 * have overlapping methods, so they must be implemented via a single class.
 */
@Export
class BusinessVehicleAdditionalInterestContainerCoverableModifiableAdapter
    implements gw.api.domain.CoverableAdapter, gw.api.domain.ModifiableAdapter,
               gw.api.contact.AdditionalInterestContainer {
  delegate _coverableAdapter represents gw.api.domain.CoverableAdapter
  delegate _modifiableAdapter represents gw.api.domain.ModifiableAdapter
  delegate _additionalInterestContainer represents gw.api.contact.AdditionalInterestContainer

  construct(owner: BusinessVehicle) {
    _coverableAdapter = new gw.lob.ba.BusinessVehicleCoverableAdapter(owner)
    _modifiableAdapter = new gw.lob.ba.BusinessVehicleModifiableAdapter(owner)
    _additionalInterestContainer = new gw.lob.ba.contact.BAVehicleAdditionalInterestContainer(owner)
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

  override property get PolicyPeriod() : PolicyPeriod {
    return _modifiableAdapter.PolicyPeriod
  }

}