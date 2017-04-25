package gw.plugin.billing.bc800

uses gw.api.locale.DisplayKey
uses gw.api.system.PCLoggerCategory
uses gw.api.util.DisplayableException
uses gw.api.util.LocaleUtil
uses gw.plugin.billing.AgencyBillPlanSummary
uses gw.plugin.billing.BillingAccountSearchCriteria
uses gw.plugin.billing.BillingAccountSearchCriteriaJava
uses gw.plugin.billing.BillingAccountSearchResult
uses gw.plugin.billing.BillingInvoiceStreamInfo
uses gw.plugin.billing.BillingPaymentInstrument
uses gw.plugin.billing.BillingPaymentInstrumentImpl
uses gw.plugin.billing.BillingPaymentsPreview
uses gw.plugin.billing.BillingUnappliedFundInfo
uses gw.plugin.billing.BillingUtilityMethods
uses gw.plugin.billing.CommissionPlanSummary
uses gw.plugin.billing.IBillingSystemPlugin
uses gw.plugin.billing.InstallmentPlanDataImpl
uses gw.plugin.billing.PaymentPlanData
uses gw.plugin.billing.PaymentPreviewItem
uses gw.plugin.billing.PaymentPreviewItemLocalizationHelper
uses gw.plugin.billing.PolicyPeriodBillingInfo
uses gw.plugin.billing.ReportingPlanCreator
uses wsi.remote.gw.webservice.bc.bc800.billingapi.BillingAPI
uses wsi.remote.gw.webservice.bc.bc800.billingapi.enums.InvoiceItemType
uses wsi.remote.gw.webservice.bc.bc800.billingapi.faults.AlreadyExecutedException
uses wsi.remote.gw.webservice.bc.bc800.billingapi.faults.BadIdentifierException
uses wsi.remote.gw.webservice.bc.bc800.billingapi.types.complex.BCAccountSearchCriteria
uses wsi.remote.gw.webservice.bc.bc800.billingapi.types.complex.InvoiceItemPreview
uses wsi.remote.gw.webservice.bc.bc800.entity.types.complex.CancelPolicyInfo
uses wsi.remote.gw.webservice.bc.bc800.entity.types.complex.FinalAuditInfo
uses wsi.remote.gw.webservice.bc.bc800.entity.types.complex.IssuePolicyInfo
uses wsi.remote.gw.webservice.bc.bc800.entity.types.complex.NewProducerCodeInfo
uses wsi.remote.gw.webservice.bc.bc800.entity.types.complex.PCAccountInfo
uses wsi.remote.gw.webservice.bc.bc800.entity.types.complex.PCContactInfo
uses wsi.remote.gw.webservice.bc.bc800.entity.types.complex.PCNewProducerInfo
uses wsi.remote.gw.webservice.bc.bc800.entity.types.complex.PCPolicyPeriodInfo
uses wsi.remote.gw.webservice.bc.bc800.entity.types.complex.PCProducerInfo
uses wsi.remote.gw.webservice.bc.bc800.entity.types.complex.PaymentPlanInfo
uses wsi.remote.gw.webservice.bc.bc800.entity.types.complex.PolicyChangeInfo
uses wsi.remote.gw.webservice.bc.bc800.entity.types.complex.PremiumReportInfo
uses wsi.remote.gw.webservice.bc.bc800.entity.types.complex.ProducerCodeInfo
uses wsi.remote.gw.webservice.bc.bc800.entity.types.complex.ReinstatementInfo
uses wsi.remote.gw.webservice.bc.bc800.entity.types.complex.RenewalInfo
uses wsi.remote.gw.webservice.bc.bc800.entity.types.complex.RewriteInfo

uses java.lang.IllegalArgumentException
uses java.lang.IllegalStateException
uses java.lang.Integer
uses java.lang.SuppressWarnings
uses java.util.ArrayList
uses java.util.Arrays
uses java.util.List

/**
* This is the implementation of IBillingSystemPlugin that connects to a 800
* Guidewire BillingCenter via SOAP
*/
@Export
@Deprecated(:value="800 inter-app integration packages will be removed in PC10.", :version="PC 9.0.0")
class BCBillingSystemPlugin implements IBillingSystemPlugin {

  private property get BillingAPIWithLanguage() : BillingAPI {
    var billingAPI = new BillingAPI()
    billingAPI.Config.Guidewire.Locale = LocaleUtil.CurrentLanguage.Code
    return billingAPI
  }

  protected function callUpdate<T>(call : block(api : BillingAPI) : T) : T {
    try {
      return call(BillingAPIWithLanguage)
    } catch(e : AlreadyExecutedException) {
      // already executed, just ignored this call
    }
    return null
  }

  override function createAccount(account : Account, transactionID : String) : String {
    var accountInfo = new PCAccountInfo()
    accountInfo.sync(account)
    PCLoggerCategory.BILLING_SYSTEM_PLUGIN.info("Sending account ${account} to Billing System")
    var currencyEnum = wsi.remote.gw.webservice.bc.bc800.billingapi.enums.Currency.forGosuValue(account.PreferredSettlementCurrency.Code)
    return callUpdate(\ b -> BillingAPIWithLanguage.createAccount(accountInfo,
        currencyEnum, transactionID))
  }

  override function retrieveAllPaymentPlans(policyPeriod : PolicyPeriod) : PaymentPlanData[] {
    return retrieveAllPaymentPlans(policyPeriod.BillingMethod, policyPeriod.AltBillingAccountNumber, policyPeriod.PreferredSettlementCurrency)
  }

  override function retrieveAllPaymentPlans(billingMethod : BillingMethod, altBillingAccountNumber : String, preferredSettlementCurrency : Currency) : PaymentPlanData[] {
    var bcPaymentPlans : PaymentPlanInfo[]
    if (billingMethod == TC_LISTBILL) {
      PCLoggerCategory.BILLING_SYSTEM_PLUGIN.info("Getting payment plans for account ${altBillingAccountNumber}")
      if(altBillingAccountNumber != null) {
        bcPaymentPlans = BillingAPIWithLanguage.getPaymentPlansForAccount(altBillingAccountNumber,
            getBCCurrencyEnumFor(preferredSettlementCurrency))
      } else {
        return {}
      }
    } else {
      PCLoggerCategory.BILLING_SYSTEM_PLUGIN.info("Getting all payment plans")
      bcPaymentPlans = BillingAPIWithLanguage.getAllPaymentPlans().where(\ plan ->
        plan.Currency == preferredSettlementCurrency.Code
      )
    }

    return convertBCPaymentPlansToPaymentPlanSummaries(bcPaymentPlans, null)
  }

  protected function convertBCPaymentPlansToPaymentPlanSummaries(paymentPlans : PaymentPlanInfo[], period : PolicyPeriod) : PaymentPlanData[] {
    return paymentPlans.flatMap(\ plan -> convertBCPaymentPlanToPaymentPlanSummary(plan, period))
  }

  protected function convertBCPaymentPlanToPaymentPlanSummary(bcPaymentPlan: PaymentPlanInfo, period : PolicyPeriod) : List<PaymentPlanData> {
    // If BC sends us a Reporting plan, we need to find all AuditSchedulePatterns in our system
    // whose PaymentPlanCode matches the PublicID of the BC (Reporting) PaymentPlan. Then,
    // we generate a PC PaymentPlanSummary object for each of these patterns.
    if (bcPaymentPlan.Reporting) {
      var allowedPaymentMethods = bcPaymentPlan.AllowedPaymentMethods.map(\ s ->
          BillingUtilityMethods.convertPaymentMethodToAccountPaymentMethod(s))?.toTypedArray()
      return ReportingPlanCreator.createReportingPlansForPlanId(bcPaymentPlan.PublicID, allowedPaymentMethods)
    }
    else { // if it's not a Reporting plan, it's an Installments plan.
      var installmentPlan = new InstallmentPlanDataImpl ()
      // Set the BillingId to the PublicID from BillingCenter
      installmentPlan.BillingId = bcPaymentPlan.PublicID
      installmentPlan.Name = bcPaymentPlan.Name
      installmentPlan.AllowedPaymentMethods = bcPaymentPlan.AllowedPaymentMethods.map(\ s ->
        BillingUtilityMethods.convertPaymentMethodToAccountPaymentMethod(s))?.toTypedArray()
      if (bcPaymentPlan.InvoiceFrequency != null) {
        installmentPlan.InvoiceFrequency = typekey.BillingPeriodicity.get(bcPaymentPlan.InvoiceFrequency)
      } // else use the default value from datamodel which is 'monthly'
      return {installmentPlan}
    }
  }

  override function accountExists(accountNumber: String) : boolean {
    return BillingAPIWithLanguage.isAccountExist(accountNumber)
  }

  @Deprecated("As of 8.0.1 use IBillingSystemPlugin#accountExists instead.", "PC8.0.1")
  override function isAccountExist(accountNumber: String) : boolean {
    return BillingAPIWithLanguage.isAccountExist(accountNumber)
  }

  override function getAvailableBillingMethods(producerCode : String, currency : typekey.Currency) : BillingMethod[] {
    var billingMethods = BillingAPIWithLanguage.getAvailableBillingMethods(producerCode, getBCCurrencyEnumFor(currency))
    var temp = new ArrayList<BillingMethod>()
    if (billingMethods != null) {
      billingMethods.each(\ b -> { temp.add(BillingMethod.get(b)) })
    } else {
      PCLoggerCategory.BILLING_SYSTEM_PLUGIN.error(DisplayKey.get("BillingSystemPlugin.Error.BillingMethodsNotAvailable", producerCode, currency))
    }
    temp.add(BillingMethod.TC_LISTBILL)
    return temp.toTypedArray()
  }

  override function retrieveInstallmentsPlanPreview(policyPeriod : PolicyPeriod) : BillingPaymentsPreview {
    throw new DisplayableException(DisplayKey.get("Web.Policy.Payment.PreviewPayments.Incompatibility"))
  }

  override function retrieveInstallmentsPlanPreview(policyPeriod : PolicyPeriod, paymentPlan : PaymentPlanData) : BillingPaymentsPreview {
    throw new DisplayableException(DisplayKey.get("Web.Policy.Payment.PreviewPayments.Incompatibility"))
  }

  private function createIssuePolicyInfoForPreview(policyPeriod : PolicyPeriod, paymentPlanBillingId : String) : IssuePolicyInfo {
    var issuePolicyInfo = new IssuePolicyInfo()
    issuePolicyInfo.syncForPreview(policyPeriod, paymentPlanBillingId)
    return issuePolicyInfo
  }

  private function convertToPolicyCenterPaymentPreviewItems(
      bcInvoiceItems : InvoiceItemPreview[], expectedCurrency : Currency) : PaymentPreviewItem[] {
    return bcInvoiceItems.map(\ invItem -> PaymentPreviewItemLocalizationHelper
        .localizeForDisplay(new PaymentPreviewItem(
            invItem.InvoiceDueDate, invItem.Amount.convertAmount(expectedCurrency),
            invItem.Type.GosuValue)))
  }

  private function convertToBillingPaymentsPreview(
      bcInvoiceItems : InvoiceItemPreview[], policyPeriod : PolicyPeriod) : BillingPaymentsPreview {
    return new BillingPaymentsPreview(true,
        convertToPolicyCenterPaymentPreviewItems(bcInvoiceItems, policyPeriod.PreferredSettlementCurrency))
  }

  /**
  * Issue a policy period in Billing Center
  * @param period: the policy period
  * @param transactionID: the unique transaction id to make this call idempotent
  */
  override function createPolicyPeriod(period: PolicyPeriod, transactionID : String) : String {
    var issuePolicyInfo = new IssuePolicyInfo()
    issuePolicyInfo.sync(period)
    PCLoggerCategory.BILLING_SYSTEM_PLUGIN.info("Sending policy ${period} to Billing System")
    return callUpdate(\ b -> b.issuePolicyPeriod(issuePolicyInfo, transactionID))
  }

  /**
  * Cancel a policy period in Billing Center
  * @param period: the policy period
  * @param transactionID: the unique transaction id to make this call idempotent
  */
  override function cancelPolicyPeriod(period: PolicyPeriod, transactionID : String) : void {
    var cancelInfo = new CancelPolicyInfo()
    cancelInfo.sync(period)
    callUpdate(\ b -> b.cancelPolicyPeriod(cancelInfo, transactionID))
  }

  /**
  * Issue a policy change in Billing Center
  * @param period: the policy period
  * @param transactionID: the unique transaction id to make this call idempotent
  */
  override function issuePolicyChange(period: PolicyPeriod, transactionID: String) : void {
    var policyChangeInfo = new PolicyChangeInfo()
    policyChangeInfo.syncPolicyChange(period)
    callUpdate(\ b -> b.changePolicyPeriod(policyChangeInfo,  transactionID))
  }

  override function issueReinstatement(period: PolicyPeriod, transactionID: String) : void {
    var reinstatementInfo = new ReinstatementInfo()
    reinstatementInfo.syncBasicPolicyInfo(period)
    reinstatementInfo.Description = period.Reinstatement.Description

    callUpdate(\ b -> b.reinstatePolicyPeriod(reinstatementInfo,  transactionID))
  }


  override function renewPolicyPeriod(period: PolicyPeriod, transactionID: String) : void {
    var renewalInfo = new RenewalInfo()
    renewalInfo.sync(period)
    renewalInfo.PriorTermNumber = period.BasedOn.TermNumber
    renewalInfo.PriorPolicyNumber = period.BasedOn.PolicyNumber
    callUpdate(\ b -> b.renewPolicyPeriod(renewalInfo,  transactionID))
  }

  override function issueFinalAudit(period: PolicyPeriod, transactionID: String) : void {
    var finalAuditInfo = new FinalAuditInfo()
    finalAuditInfo.syncBasicPolicyInfo(period)

    callUpdate(\ b -> b.issueFinalAudit(finalAuditInfo,  transactionID))
  }

  override function createProducer(organization: Organization, transactionId: String) : String {
    if (not organization.Producer) {
      throw new IllegalArgumentException("Cannot create producer from an non-producer organization")
    }
    var producerInfo = new PCNewProducerInfo()
    producerInfo.syncNew(organization)
    return callUpdate(\ b -> b.createProducer(producerInfo,  transactionId))
  }

  override function retrieveAllAgencyBillPlans() : AgencyBillPlanSummary[] {
    return BillingAPIWithLanguage.getAllAgencyBillPlans()
      .map(\ p -> {
        final var summary = new AgencyBillPlanSummary()
        summary.syncCurrency(p)
        return summary
      })
  }

  override function syncOrganization(organization : Organization) {
    if (organization.New) {
      return
    }

    var producerInfo : PCProducerInfo
    try {
      producerInfo = BillingAPIWithLanguage.getProducerInfo(organization.PublicID)
    } catch (e : BadIdentifierException) {
      return
    }
    final var syncedAgencyBillPlansByCurrency =
        producerInfo.AgencyBillPlanInfos.partitionUniquely(\ planInfo -> Currency.get(planInfo.Currency))
    // sync' each currency-specific AgencyBillPlan with the billing system...
    organization.AgencyBillPlans.each(\ billPlan -> {
      final var syncedAgencyBillPlanID = syncedAgencyBillPlansByCurrency[billPlan.Currency].PublicID
      if (billPlan.PlanID != syncedAgencyBillPlanID) {
        billPlan.PlanID = syncedAgencyBillPlanID
      }
    })
    // check for new AgencyBillPlans set by BillingCenter...
    final var newCurrencies = syncedAgencyBillPlansByCurrency.Keys
    newCurrencies.removeAll(Arrays.asList(organization.AgencyBillPlans*.Currency))
    newCurrencies.each(\ currency ->
      organization.addToAgencyBillPlans(new AgencyBillPlan() {
        : PlanID = syncedAgencyBillPlansByCurrency[currency].PublicID,
        : Currency = currency
      })
    )
  }

  override function updateProducer(organization: Organization, transactionId : String) : void {
    if (not organization.Producer) {
      throw new IllegalArgumentException("Cannot create producer from an non-producer organization")
    }
    var producerInfo = new PCProducerInfo()
    producerInfo.sync(organization)
    callUpdate(\ b -> b.updateProducer(producerInfo, transactionId))
  }

  override function producerExists(producerId: String) : boolean {
    return BillingAPIWithLanguage.isProducerExist(producerId)
  }

  @Deprecated("Use IBillingSystemPlugin#producerExists instead.", "PC8.0.1")
  override function isProducerExist(producerId: String) : boolean {
    return BillingAPIWithLanguage.isProducerExist(producerId)
  }

  override function createProducerCode(producerCode: ProducerCode, transactionId: String) : String {
    var producerCodeInfo = new NewProducerCodeInfo()
    producerCodeInfo.sync(producerCode)
    return callUpdate(\ b -> b.createProducerCode(producerCodeInfo, transactionId))
  }

  override function retrieveAllCommissionPlans() : CommissionPlanSummary[] {
    return BillingAPIWithLanguage.getAllCommissionPlans()
      .map(\ plan -> {
        var summary = new CommissionPlanSummary()
        summary.sync(plan)
        return summary
      })
  }

  override function syncProducerCode(producerCode : ProducerCode) {
    if (producerCode.New) {
      return
    }

    var producerCodeInfo : ProducerCodeInfo
    try {
      producerCodeInfo = BillingAPIWithLanguage.getProducerCodeInfo(producerCode.PublicID)
    } catch (e : BadIdentifierException) {
      return
    }
    final var syncedCommissionPlansByCurrency =
        producerCodeInfo.CommissionPlanInfos.partitionUniquely(\ planInfo -> Currency.get(planInfo.Currency))
    // sync' each currency-specific CommissionPlan with the billing system...
    producerCode.CommissionPlans.each(\ codePlan -> {
      final var syncedCommissionPlanID = syncedCommissionPlansByCurrency[codePlan.Currency].PublicID
      if (codePlan.CommissionPlanID != syncedCommissionPlanID) {
        codePlan.CommissionPlanID = syncedCommissionPlanID
      }
    })
  }

  override function updateProducerCode(producerCode: ProducerCode, transactionId : String) : void {
    var producerCodeInfo = new ProducerCodeInfo()
    producerCodeInfo.PublicID = producerCode.PublicID
    producerCodeInfo.Code = producerCode.Code
    producerCodeInfo.Currencies = producerCode.Currencies*.Code.toList()
    producerCodeInfo.CommissionPlanIDs = producerCode.CommissionPlanIDs.toList()
    var status = producerCode.ProducerStatus
    producerCodeInfo.Active = status == ProducerStatus.TC_ACTIVE or status ==  ProducerStatus.TC_LIMITED
    callUpdate(\ b -> b.updateProducerCode(producerCodeInfo, transactionId))
  }

  override function updateAccount(account: Account, transactionId: String) : void {
    var accountInfo = new PCAccountInfo()
    accountInfo.sync(account)
    callUpdate(\ b -> b.updateAccount(accountInfo, transactionId))
  }

  override function rewritePolicyPeriod(period: PolicyPeriod, transactionId: String) : void {
    var renewalInfo = new RewriteInfo()
    renewalInfo.sync(period)
    renewalInfo.PriorTermNumber = period.BasedOn.TermNumber
    renewalInfo.PriorPolicyNumber = period.BasedOn.PolicyNumber

    callUpdate(\ b -> b.rewritePolicyPeriod(renewalInfo, transactionId))
  }

  override function issuePremiumReport(period: PolicyPeriod, transactionId: String) : void {
    var premiumReportInfo = new PremiumReportInfo()
    premiumReportInfo.sync(period)
    callUpdate(\ b -> b.issuePremiumReport(premiumReportInfo, transactionId))
  }

  override function updateContact(contact: Contact, transactionId: String) : void {
    var updateContactInfo = new PCContactInfo()
    updateContactInfo.sync(contact)
    callUpdate(\ b -> b.updateContact(updateContactInfo, transactionId))
  }

  override function waiveFinalAudit(period: PolicyPeriod, transactionId: String) : void {
    var policyPeriodInfo = new PCPolicyPeriodInfo()
    policyPeriodInfo.PolicyNumber = period.PolicyNumber
    policyPeriodInfo.TermNumber = period.TermNumber
    policyPeriodInfo.PCPolicyPublicID = period.Policy.PublicID
    callUpdate(\ b -> b.waiveFinalAudit(policyPeriodInfo, transactionId))
  }

  override function scheduleFinalAudit(period: PolicyPeriod, transactionId: String) : void {
    var policyPeriodInfo = new PCPolicyPeriodInfo()
    policyPeriodInfo.PolicyNumber = period.PolicyNumber
    policyPeriodInfo.TermNumber = period.TermNumber
    policyPeriodInfo.PCPolicyPublicID = period.Policy.PublicID
    callUpdate(\ b -> b.scheduleFinalAudit(policyPeriodInfo, transactionId))
  }

  override function getPeriodInfo(period: PolicyPeriod) : PolicyPeriodBillingInfo {
    var policyPeriodInfo = new PCPolicyPeriodInfo()
    policyPeriodInfo.PolicyNumber = period.PolicyNumber
    policyPeriodInfo.TermNumber = period.TermNumber
    policyPeriodInfo.PCPolicyPublicID = period.Policy.PublicID
    var bcPeriod = BillingAPIWithLanguage.getPolicyPeriod(policyPeriodInfo)
    if (bcPeriod == null) {
      return null
    }
    return new PolicyPeriodBillingInfo() {
      :BillingMethod = typekey.BillingMethod.get(bcPeriod.BillingMethodCode),
      :PaymentPlanID = bcPeriod.PaymentPlanPublicId,
      :AltBillingAccountNumber = bcPeriod.AltBillingAccountNumber,
      :InvoiceStreamCode = bcPeriod.InvoiceStreamId
    }
  }

  override function transferPolicyPeriods(accountNumber : String,
                                  periods : PolicyPeriod[], transactionId : String) {
    var policyPeriodInfos = periods.map(\ p -> new PCPolicyPeriodInfo() {
      :TermNumber = p.TermNumber,
      :PolicyNumber = p.PolicyNumber,
      :PCPolicyPublicID = p.Policy.PublicID
    })
    callUpdate(\ b -> {
      b.transferPolicyPeriods(policyPeriodInfos, accountNumber, transactionId)
      return null
    })
  }

  override function setDownPaymentInstallmentTotalForAllInstallmentsPlans(period : PolicyPeriod, paymentPlans: PaymentPlanData[]) {
    paymentPlans.InstallmentPlans.each(\ paymentPlanData -> {
      try {
        var installmentPlan = paymentPlanData as InstallmentPlanDataImpl
        final var issuePolicyInfo = createIssuePolicyInfoForPreview(period, installmentPlan.BillingId)
        final var bcInvoiceItems = BillingAPIWithLanguage.previewInstallmentsPlanInvoices(issuePolicyInfo)
        final var billingPaymentsPreview = convertToBillingPaymentsPreview(bcInvoiceItems, period)
        installmentPlan.DownPayment = billingPaymentsPreview.getTypeTotal(InvoiceItemType.Deposit.GosuValue, period)
        installmentPlan.Installment = billingPaymentsPreview.getTypeAmount(InvoiceItemType.Installment.GosuValue, period)
        installmentPlan.Fee = null
        installmentPlan.TotalFees = null
        installmentPlan.Tax = null
        installmentPlan.Total = billingPaymentsPreview.getTotal(period)
      } catch (e : BadIdentifierException) {
        PCLoggerCategory.BILLING_SYSTEM_PLUGIN.error("Could not set down payment information for : " + paymentPlanData.getName(), e)
        throw new DisplayableException(DisplayKey.get("Web.Policy.Payment.PreviewPayments.Exception"))
      }
    })
  }

  override function getSubAccounts(parentAccountNumber: String) : BillingAccountSearchResult[] {
    if (parentAccountNumber == null) {
      throw new IllegalStateException("This method should never be called will null account number.")
    }
    return BillingAPIWithLanguage.getAllSubAccounts(parentAccountNumber)
        .map(\ b -> new BCBillingAccountSearchResult(b))
  }

  override function getSubAccounts(parentAccountNumber: String, currency : Currency) : BillingAccountSearchResult[] {
    // For BC8, there's no filtering according to currency. Just return all sub-accounts.
    return getSubAccounts(parentAccountNumber)
  }

  override function getInvoiceStreams(accountNumber : String, currency : Currency, paymentPlan : PaymentPlanData) : BillingInvoiceStreamInfo[] {
    if (accountNumber == null) {
      throw new IllegalStateException("This method should never be called will null account number.")
    }
    PCLoggerCategory.BILLING_SYSTEM_PLUGIN.info("Getting invoice streams for account: ${accountNumber}")
    var infos = BillingAPIWithLanguage.getAccountInvoiceStreams(accountNumber, getBCCurrencyEnumFor(currency))
    return infos.map(\ i -> new BCBillingInvoiceStreamInfo(i))
        .where(\stream -> stream.isCompatibleWith(paymentPlan))
  }

  /**
   * This method expect the specific BillingAccountSearchCriteria implementation of the
   * BillingAccountSearchCriteriaJava interface, not just some implementation.
   */
  override function searchForAccounts(criteria: BillingAccountSearchCriteriaJava, limit: Integer): BillingAccountSearchResult[] {
    if (criteria typeis BillingAccountSearchCriteria) {
      var bcCriteria = new BCAccountSearchCriteria() {
          :AccountName = criteria.AccountName,
          :AccountNameKanji = criteria.AccountNameKanji,
          :AccountNumber = criteria.AccountNumber,
          :IsListBill = criteria.ListBill,
          :Currency = getBCCurrencyEnumFor(criteria.Currency)
      }
      var bcResults = BillingAPIWithLanguage.searchForAccounts(bcCriteria, limit)
      return bcResults.map(\b -> new BCBillingAccountSearchResult(b))
    } else {
      throw new IllegalStateException("Criteria should be of gosu type: ${typeof BillingAccountSearchCriteria}")
    }
  }

  override function getExistingPaymentInstruments(accountNumber : String, currency : Currency) : BillingPaymentInstrument[] {
    if (accountNumber == null) {
      throw new IllegalStateException("This method should never be called will null account number.")
    }
    var instruments = BillingAPIWithLanguage.getAccountPaymentInstruments(accountNumber, getBCCurrencyEnumFor(currency))
    return instruments
      .where(\ p -> p.PaymentMethod != wsi.remote.gw.webservice.bc.bc800.billingapi.enums.PaymentMethod.Responsive) // filter out responsive
      .map(\ p -> createBillingPaymentInstrument(p))
  }

  @SuppressWarnings({"all"})
  override function addPaymentInstrumentTo(accountNumber : String, currency : Currency, paymentInstrument : BillingPaymentInstrument) : BillingPaymentInstrument {
    var accountExist = accountExists(accountNumber)
    if (not accountExist) {
      var account = Account.finder.findAccountByAccountNumber(accountNumber)
      createAccount(account, null)
    }

    if (paymentInstrument.PaymentMethod == AccountPaymentMethod.TC_UNSUPPORTED) {
      throw new IllegalStateException(DisplayKey.get("BillingSystemPlugin.Error.UnsupportedPaymentMethod"))
    }
    var bcInstrument = new wsi.remote.gw.webservice.bc.bc800.billingapi.types.complex.PaymentInstrumentRecord() {
      :PaymentMethod = wsi.remote.gw.webservice.bc.bc800.billingapi.enums.PaymentMethod.forGosuValue(paymentInstrument.PaymentMethod.Code),
      :OneTime = false,
      :Token = paymentInstrument.Token
    }
    bcInstrument = BillingAPIWithLanguage.createPaymentInstrumentOnAccount(accountNumber, getBCCurrencyEnumFor(currency), bcInstrument)
    return createBillingPaymentInstrument(bcInstrument)
  }

  override function updatePolicyPeriodTermConfirmed(policyNumber : String, termNumber : int,
                                           isConfirmed : boolean) : void{
    BillingAPIWithLanguage.updatePolicyPeriodTermConfirmed(policyNumber, termNumber, isConfirmed)
  }

  @Deprecated("Use updatePolicyPeriodTermConfirmed(String policyNumber, int termNumber, boolean isConfirmed) instead.", "PC8.0.1")
  override function updatePolicyPeriodTermConfirmed(policyNumber : String, termNumber : int,
                                                    isConfirmed : Boolean) : void{
    BillingAPIWithLanguage.updatePolicyPeriodTermConfirmed(policyNumber, termNumber, isConfirmed)
  }

  protected function createBillingPaymentInstrument(p : wsi.remote.gw.webservice.bc.bc800.billingapi.types.complex.PaymentInstrumentRecord) : BillingPaymentInstrument {
    var paymentMethod = p.PaymentMethod.GosuValue
    return new BillingPaymentInstrumentImpl(){
        :PublicID = p.PublicID,
        :PaymentMethod = BillingUtilityMethods.convertPaymentMethodToAccountPaymentMethod(paymentMethod),
        :OneTime = p.OneTime,
        :DisplayName = p.DisplayName,
        :Token = p.Token
    }
  }

  override function retrieveAccountUnappliedFunds(accountNumber : String, currency : Currency) : BillingUnappliedFundInfo[] {
    if (accountNumber == null) {
      throw new IllegalStateException("This method should never be called will null account number.")
    }
    var unappliedFundInfos = BillingAPIWithLanguage.getUnappliedFunds(accountNumber, getBCCurrencyEnumFor(currency))
    return unappliedFundInfos.map(\ info -> new BCUnappliedFundWrapper(info))
  }

  private function getBCCurrencyEnumFor(currency: typekey.Currency) : wsi.remote.gw.webservice.bc.bc800.billingapi.enums.Currency {
    return wsi.remote.gw.webservice.bc.bc800.billingapi.enums.Currency.forGosuValue(currency.Code)
  }
}
