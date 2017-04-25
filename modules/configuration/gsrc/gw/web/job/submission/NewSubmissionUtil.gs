package gw.web.job.submission

uses gw.api.util.JurisdictionMappingUtil
uses gw.api.web.job.submission.SubmissionUtil
uses gw.api.locale.DisplayKey
uses pcf.JobForward

@Export
class NewSubmissionUtil {

  /**
   * Returns the a valid {@link ProducerSelection}, either from the session or from the account.
   * @return a {@link ProducerSelection} in the web session
   */
  static function getOrCreateProducerSelection (account : Account) : ProducerSelection {
    return SubmissionUtil.getOrCreateProducerSelection(account, \ a -> JurisdictionMappingUtil.getJurisdiction(a))
  }

  static function createOneSubmission(offer : acc.pc.job.AvailableProduct, producerSelection : ProducerSelection, account : Account,
      quoteType : QuoteType) {
    if( producerSelection.DefaultPPEffDate == null ) {
      throw new gw.api.util.DisplayableException(DisplayKey.get('Web.SubmissionManagerLV.DefaultPPEffDateRequired'))
    }
    var availOffer = account.getAvailableProduct( producerSelection.SubmissionPolicyProductRoot, offer.productSelection.Product )
    if( availOffer == null )
    {
      throw new gw.api.util.DisplayableException( DisplayKey.get('Web.SubmissionManagerLV.UnavailableProduct',  offer.productSelection.Product ) )
    }
    if( producerSelection.ProducerCode == null )
    {
      throw new gw.api.util.DisplayableException( DisplayKey.get('Web.SubmissionManagerLV.ProducerCodeRequired') )
    }
    gw.api.web.job.submission.SubmissionUtil.setLastProducerSelection( producerSelection )
    offer.productSelection.NumToCreate = 1
    var submission = gw.api.web.job.submission.SubmissionUtil.createSubmission( offer.productSelection, account, producerSelection, quoteType )
    // For one new submission - go straight to Submission view
    var policyPeriod = submission.LatestPeriod
    gw.transaction.Transaction.runWithNewBundle( \ bun -> {
      policyPeriod = bun.add( policyPeriod )
      if(offer.variation != null){
        policyPeriod.Policy.VirtualProduct_Ext = offer.variation
        policyPeriod.VirtualProductFlavour_Ext = policyPeriod.Policy.VirtualProduct_Ext.VirtualProductFlavours.firstWhere(\elt -> elt.DefaultFlavour == true)
        if(policyPeriod.VirtualProductFlavour_Ext.Scheme != null){
          policyPeriod.Scheme = policyPeriod.VirtualProductFlavour_Ext.Scheme
        }
      }
      policyPeriod.SubmissionProcess.beginEditing()
    } )
    JobForward.go(submission, policyPeriod)
  }

  static function makeNumberRange( max : int ) : java.util.List<java.lang.Integer> {
    var result = new java.util.ArrayList<java.lang.Integer>()
    var count = 0
    while( count <= max ) {
      result.add( count )
      count = count + 1
    }
    return result
  }
}

