package acc.pc.apa.actions

uses acc.pc.apa.APAAction_Ext
uses gw.api.database.Query
uses gw.api.database.Relop

class APAStartSubmission_Ext extends APAAction_Ext {

  construct(){
    super()
  }

  override function run() {
    setup()
    MacroParameters.Submission = gw.api.web.job.submission.SubmissionUtil.createSubmission( MacroParameters.Offer, MacroParameters.Account, MacroParameters.ProducerSelection, MacroParameters.QuoteType )
    MacroParameters.PolicyPeriod = MacroParameters.Job.LatestPeriod

    gw.transaction.Transaction.runWithNewBundle( \ bun -> {
      MacroParameters.PolicyPeriod = bun.add( MacroParameters.PolicyPeriod )
      MacroParameters.PolicyPeriod.SubmissionProcess.beginEditing()
    })
  }

  private function setup(){
    //
    //Setup the Offer (Product Selection)
    //
    MacroParameters.Offer = new ProductSelection()
    if(MacroParameters.Product != null) {
      MacroParameters.Offer.Product = MacroParameters.Product
      MacroParameters.Offer.ProductCode = MacroParameters.Product.PublicID
    } else {
      MacroParameters.Offer.ProductCode = MacroParameters.ProductCode
    }
    //
    // Setup the number of offers to create - at the moment only 1
    //
    MacroParameters.Offer.NumToCreate = 1
    //
    // Get the Account if only got the Account Number
    //
    if(MacroParameters.Account == null and MacroParameters.AccountNumber != null){
      var query = Query.make(Account).compare("AccountNumber", Relop.Equals, MacroParameters.AccountNumber)
      MacroParameters.Account = query.select().first()
    }
    //
    // Setup the producer Selection
    //
    MacroParameters.ProducerSelection = new ProducerSelection()
    MacroParameters.ProducerSelection.Account = MacroParameters.Account
    MacroParameters.ProducerSelection.ProducerCode = MacroParameters.Account.ProducerCodes.first().getProducerCode()
    MacroParameters.ProducerSelection.Producer = MacroParameters.ProducerSelection.ProducerCode.Organization
    MacroParameters.ProducerSelection.DefaultPPEffDate = MacroParameters.TransactionEffectiveDate
  }

}