package gw.plugin.billing.bc800

uses gw.pl.currency.MonetaryAmount
uses gw.xml.ws.annotation.WsiExportable

/**
 * A PaymentReceiptRecord is a data transfer object POGO for passing the details of a PaymentReceipt
 * to and from a web service.  When the record is used to pass the details of a new PaymentReceipt to a
 * web service, the PublicID may be be null.
 *
 * Customer configuration: modify this to add a variable for each extension column you added to PaymentReceipt.
 */
@WsiExportable ("http://guidewire.com/pc/ws/gw/plugin/billing/bc800/PaymentReceiptRecord")
@Export
@Deprecated(:value="800 inter-app integration packages will be removed in PC10.", :version="PC 9.0.0")
final class PaymentReceiptRecord {

  // The PublicID may be null if the PaymentReceipt does not yet exist.
  private var _publicID : String as PublicID
  private var _currencyAmount : MonetaryAmount as MonetaryAmount
  private var _paymentInstrumentRecord : PaymentInstrumentRecord as PaymentInstrumentRecord

}
