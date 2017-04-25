package gw.contactmapper.ab900

uses gw.webservice.contactapi.NameMapper

@Export
class PCNameMapperExtensionsImpl implements IPCNameMapperExtensions {
  override property get Instance(): NameMapper {
    return PCNameMapper.Instance
  }
}