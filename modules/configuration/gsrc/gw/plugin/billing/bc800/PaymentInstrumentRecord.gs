package gw.plugin.billing.bc800

uses gw.xml.ws.annotation.WsiExportable

/**
 * A PaymentInstrumentRecord is a data transfer object POGO for passing the details of a PaymentInstrument
 * to and from a web service.
 *
 * If the PaymentInstrumentRecord describes a new PaymentInstrument that has not been saved to the database,
 * the properties DisplayName and PublicID can be null.
 *
 * Customer configuration: modify this to add a variable for each extension column you added to PaymentInstrument.
 */
@WsiExportable("http://guidewire.com/pc/ws/gw/plugin/billing/bc800/PaymentInstrumentRecord")
@Export
@Deprecated(:value="800 inter-app integration packages will be removed in PC10.", :version="PC 9.0.0")
final class PaymentInstrumentRecord {

   // The PublicID is the PublicID for the existing PaymentInstrument entity.
   // This can also be set if the record is for a new PaymentInstrument.  In that case the PublicID
   // must be unique and will be used to set the PublicID of the new PaymentInstrument.
    var _publicID: String as PublicID

    // The DisplayName of the PaymentInstrument for the current locale. Can be null if the record
    // is for a new PaymentInstrument.
    var _displayName: String as DisplayName


    // The token is a string used by external systems to identify this PaymentInstrument
    var _token : String as Token

    var _paymentMethod: AccountPaymentMethod as PaymentMethod
    var _oneTime: Boolean as OneTime
}