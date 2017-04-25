package gw.webservice.pc.pc800.gxmodel
uses gw.api.database.Query
uses gw.pl.persistence.core.Bundle

@Deprecated(:value="800 inter-app integration packages will be removed in PC10.", :version="PC 9.0.0")
enhancement AccountModelEnhancement : gw.webservice.pc.pc800.gxmodel.accountmodel.types.complex.Account {
  
  function createAccount(bundle : Bundle) : Account{
    var contact = this.AccountHolderContact.$TypeInstance.createContact(bundle)
    var account = Account.createAccountForContact(contact)
    SimpleValuePopulator.populate(this, account)
    var iCodeQuery = Query.make(IndustryCode)
          .compare("Code", Equals, this.IndustryCode.Code)
          .compare("Domain", Equals, this.IndustryCode.Domain)
          .select()
    account.IndustryCode = iCodeQuery.AtMostOneRow
    for (entry in this.ProducerCodes.Entry) {
      var producerCode = Query.make(ProducerCode)
            .compare("Code", Equals, entry.ProducerCode.Code)
            .select().AtMostOneRow
      account.addProducerCode(producerCode)
    }
    return account
  }

}
