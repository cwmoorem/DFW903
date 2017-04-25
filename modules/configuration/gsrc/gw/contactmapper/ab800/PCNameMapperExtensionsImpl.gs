package gw.contactmapper.ab800

uses gw.webservice.contactapi.NameMapper

@Export
@Deprecated(:value="800 inter-app integration packages will be removed in PC10.", :version="PC 9.0.0")
class PCNameMapperExtensionsImpl implements IPCNameMapperExtensions {
  override property get Instance(): NameMapper {
    return PCNameMapper.Instance
  }
}