package gw.plugin.contact.ab800
uses gw.plugin.contact.ContactResult
uses java.lang.IllegalStateException
uses gw.plugin.contact.ContactCreator
uses gw.plugin.Plugins
uses gw.plugin.contact.ContactSystemPlugin
uses gw.plugin.contact.impl.AbstractContactResult
uses gw.contactmapper.ab800.ContactIntegrationMapperFactory

/**
 * Abstract class to represent an implementation of the ContactResult interface generated from
 * some external source.  All sub-classes of this class are guaranteed to return true for
 * the External property.  Handles some generic conversion of AB Contact Types to PC Contact
 * Types, as well as a default implementation of the convertToContact method.
 */
@Export
@Deprecated(:value="800 inter-app integration packages will be removed in PC10.", :version="PC 9.0.0")
abstract class AbstractContactResultExternal extends AbstractContactResult implements ContactResult {

  protected final function translateContactType(rawContactType : String) : typekey.Contact {
    var convertedContactType = ContactIntegrationMapperFactory.ContactIntegrationMapper.getNameMapper().getLocalEntityName(rawContactType)
    if (convertedContactType == null) {
      throw new IllegalStateException("Unrecognized contact type : ${rawContactType}")
    }
    return typekey.Contact.get(convertedContactType)
  }

  override function convertToContact(creator : ContactCreator) : Contact {
    return Plugins.get(ContactSystemPlugin).retrieveContact(ContactAddressBookUID, creator)
  }

  override final property get External() : boolean {
    return true
  }
}
