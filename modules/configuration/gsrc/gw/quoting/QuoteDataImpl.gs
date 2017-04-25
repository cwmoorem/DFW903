package gw.quoting

uses gw.xml.XmlElement

/**
 * This class contains an XML representation of a quoting request and the associated costs from the quote.
 * It has the ID of the PolicyQuote persisted in the database.
 */
@Export
class QuoteDataImpl implements gw.plugin.quoting.QuoteData {

  var _policyQuoteID : Object as PolicyQuoteID
  var _policyPeriod : XmlElement as PolicyPeriod

}
