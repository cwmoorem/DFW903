package gw.contactmapper.ab800

uses gw.api.system.PCLoggerCategory


/**
 * Returns the <b>ContactIntegrationMapper</b> to be used by PolicyCenter
 * for integration.  It's @Export so customers can make the get() method return
 * a different ContactIntegrationMapper.
 */
@Export
@Deprecated(:value="800 inter-app integration packages will be removed in PC10.", :version="PC 9.0.0")
class ContactIntegrationMapperFactory {
  private static var _logger = PCLoggerCategory.CONTACT_API

  public static property get ContactIntegrationMapper() : ContactIntegrationMapper {
    var mapper = new ContactMapper()
    _logger.trace("ContactIntegrationMapperFactory.get() returned a " + mapper.IntrinsicType.Name)

    return mapper
  }
}
