package gw.plugin.quoting

uses gw.api.database.Query

uses java.io.ByteArrayInputStream
uses java.io.InputStream
uses java.lang.Integer
uses java.nio.charset.StandardCharsets
uses java.util.concurrent.atomic.AtomicInteger

@Export
class StandAloneQuotingDataPlugin implements QuotingDataPlugin {

  static var _idCounter = new AtomicInteger(-1)
  
  // Just get any Account with Person in CA as the AccountContact and with producer codes.
  override function getAccount(requestData : Object) : Account {
    var accountsWithAccountProducerCode = Query.make(Account).join(AccountProducerCode, "Account")
    var accounts = accountsWithAccountProducerCode.select().toList()
    var account = accounts.where(\ a -> a.AccountHolder.AccountContact.Person 
        and a.AccountHolder.AccountContact.Contact.PrimaryAddress.State == TC_CA).first()
    return account
  }

  override function sendQuotingData(data : String) : Integer {
    return sendQuotingData(new ByteArrayInputStream(data.getBytes(StandardCharsets.UTF_8)))
  }

  override function sendQuotingData(is : InputStream) : Integer {
    return _idCounter.incrementAndGet()
  }
}
