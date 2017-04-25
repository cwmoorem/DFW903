package gw.plugin.billing.impl

uses gw.api.database.Query
uses gw.api.database.Relop
uses gw.api.databuilder.UniqueKeyGenerator
uses gw.api.locale.DisplayKey
uses gw.api.system.PCLoggerCategory
uses gw.api.util.CurrencyUtil
uses gw.api.util.MonetaryAmounts
uses gw.lang.reflect.ReflectUtil
uses gw.lang.reflect.TypeSystem
uses gw.pl.currency.MonetaryAmount
uses gw.plugin.billing.AgencyBillPlanSummary
uses gw.plugin.billing.BillingAccountSearchCriteria
uses gw.plugin.billing.BillingAccountSearchCriteriaJava
uses gw.plugin.billing.BillingAccountSearchResult
uses gw.plugin.billing.BillingInvoiceStreamInfo
uses gw.plugin.billing.BillingPaymentInstrument
uses gw.plugin.billing.BillingPaymentInstrumentImpl
uses gw.plugin.billing.BillingPaymentsPreview
uses gw.plugin.billing.BillingUnappliedFundInfo
uses gw.plugin.billing.CommissionPlanSummary
uses gw.plugin.billing.IBillingSystemPlugin
uses gw.plugin.billing.InstallmentPlanDataImpl
uses gw.plugin.billing.PaymentPlanData
uses gw.plugin.billing.PaymentPreviewItem
uses gw.plugin.billing.PaymentPreviewItemLocalizationHelper
uses gw.plugin.billing.PolicyPeriodBillingInfo
uses gw.plugin.billing.ReportingPlanCreator

uses java.lang.Double
uses java.lang.Integer
uses java.util.ArrayList
uses java.util.Collections
uses java.lang.IllegalStateException
uses java.lang.SuppressWarnings
uses java.util.Date
uses java.util.List

/**
 * This is a demo implementation of the BillingSystemPlugin.
 */
@Export
class StandAloneBillingSystemPlugin implements IBillingSystemPlugin {
  static private var _commissionPlanSummaries: List<CommissionPlanSummary> = null
  static private var _agencyBillPlanSummaries: List<AgencyBillPlanSummary> = null

  private property get COMMISSION_PLAN_SUMMARIES() : List<CommissionPlanSummary> {
    if (_commissionPlanSummaries == null) {
      _commissionPlanSummaries = {newCommissionPlanSummary(CurrencyUtil.DefaultCurrency)}
    }
    return _commissionPlanSummaries
  }

  private property get AGENCY_BILL_PLAN_SUMMARIES() : List<AgencyBillPlanSummary> {
    if (_agencyBillPlanSummaries == null) {
      final var plans = { newAgencyBillingPlanSummary(TC_USD, "1") }
      plans.add(newAgencyBillingPlanSummary(TC_USD, "2"))
      plans.add(newAgencyBillingPlanSummary(TC_USD, "3"))
      if (CurrencyUtil.MultiCurrencyMode){
        plans.add(newAgencyBillingPlanSummary(TC_JPY, "ichi"))
        plans.add(newAgencyBillingPlanSummary(TC_JPY, "ni"))
        plans.add(newAgencyBillingPlanSummary(TC_JPY, "san"))
        plans.add(newAgencyBillingPlanSummary(TC_EUR, "ein"))
        plans.add(newAgencyBillingPlanSummary(TC_EUR, "dos"))
        plans.add(newAgencyBillingPlanSummary(TC_EUR, "trois"))
      }
      _agencyBillPlanSummaries = Collections.unmodifiableList(plans)
    }
    return _agencyBillPlanSummaries
  }

  override function createAccount( account: Account, txnId : String ) : String {
    return "BCAccountPublicID"
  }

  override function accountExists(p0: String ) : boolean {
    return false
  }

  @Deprecated("As of 8.0.1 use IBillingSystemPlugin#accountExists instead.", "PC8.0.1")
  override function isAccountExist(p0: String ) : boolean {
    return false
  }

  override function getAvailableBillingMethods( p0: String, currency : Currency ) : BillingMethod[] {
    return BillingMethod.getTypeKeys(false).toTypedArray()
  }

  override function createPolicyPeriod( p0: PolicyPeriod, txnId : String ) : String {
    return "BCPolicyPeriodPublicID"
  }

  override function retrieveAllPaymentPlans(policyPeriod : PolicyPeriod) : PaymentPlanData[] {
    return retrieveAllPaymentPlans(policyPeriod.BillingMethod, policyPeriod.AltBillingAccountNumber, policyPeriod.PreferredSettlementCurrency)
  }

  override function retrieveAllPaymentPlans(billingMethod : BillingMethod, altBillingAccountNumber : String, preferredSettlementCurrency : Currency) : PaymentPlanData[] {
    if (billingMethod == BillingMethod.TC_LISTBILL && altBillingAccountNumber == null) {
      return {}
    }

    var allPaymentMethods = AccountPaymentMethod.getTypeKeys(false)

    var plan1 = new InstallmentPlanDataImpl()
    plan1.BillingId = "pctest:2"
    plan1.Name = DisplayKey.get("Web.Demo.Billing.SixPaymentsDemo")
    plan1.AllowedPaymentMethods = allPaymentMethods.where(\ a -> a != TC_RESPONSIVE).toTypedArray()
    plan1.Notes = DisplayKey.get("Web.Demo.Billing.SendInvoiceNotAllowed")
    plan1.InvoiceFrequency = BillingPeriodicity.TC_EVERYOTHERMONTH

    var plan2 = new InstallmentPlanDataImpl()
    plan2.BillingId = "pctest:3"
    plan2.Name = DisplayKey.get("Web.Demo.Billing.ThreePaymentsDemo")
    plan2.InvoiceFrequency = BillingPeriodicity.TC_EVERYFOURMONTHS
    plan2.AllowedPaymentMethods = allPaymentMethods.toTypedArray()

    var reportingPlans = ReportingPlanCreator.createReportingPlansForPlanId("ReportingPlanId", allPaymentMethods.toTypedArray())

    var plan4 = new InstallmentPlanDataImpl()
    plan4.BillingId = "pctest:4"
    plan4.Name = DisplayKey.get("Web.Demo.Billing.FullPay")
    plan4.InvoiceFrequency = BillingPeriodicity.TC_EVERYYEAR
    plan4.AllowedPaymentMethods = allPaymentMethods.toTypedArray()

    var plan5 = new InstallmentPlanDataImpl()
    plan5.BillingId = "pctest:5"
    plan5.Name = DisplayKey.get("Web.Demo.Billing.TwicePerMonthDemo")
    plan5.Notes = DisplayKey.get("Web.Demo.Billing.SendInvoiceNotAllowed")
    plan5.AllowedPaymentMethods = allPaymentMethods.where(\ a -> a != TC_RESPONSIVE).toTypedArray()
    plan5.InvoiceFrequency = BillingPeriodicity.TC_TWICEPERMONTH

    var createdPlans : List<PaymentPlanData> = {plan1, plan2}

    if (billingMethod != BillingMethod.TC_LISTBILL) {
      createdPlans.addAll(reportingPlans)
      createdPlans.addAll({plan4, plan5})
    } else {
      createdPlans.add(reportingPlans.first())
    }

    return createdPlans.toTypedArray()
  }

  override function cancelPolicyPeriod( p0: PolicyPeriod, txnId : String ) : void {
  }

  override function retrieveInstallmentsPlanPreview(period : PolicyPeriod) : BillingPaymentsPreview {
    return new BillingPaymentsPreview(true, generatePreviewFor(period, period.SelectedPaymentPlan.asPaymentPlanData()))
  }

  override function retrieveInstallmentsPlanPreview(period : PolicyPeriod, paymentPlan: PaymentPlanData) : BillingPaymentsPreview {
    return new BillingPaymentsPreview(true, generatePreviewFor(period, paymentPlan))
  }

  override function issuePolicyChange( p0: PolicyPeriod, p1: String ) : void {
  }

  override function issueReinstatement( p0: PolicyPeriod, p1: String ) : void {
  }

  override function renewPolicyPeriod( p0: PolicyPeriod, p1: String ) : void {
  }

  override function issueFinalAudit( p0: PolicyPeriod, p1: String ) : void {
  }

  override function createProducer( p0: Organization, p1: String ) : String {
    return "pc:1"
  }

  override function retrieveAllAgencyBillPlans(): AgencyBillPlanSummary[] {
    return AGENCY_BILL_PLAN_SUMMARIES.toTypedArray()
  }

  override function producerExists(p0: String ) : boolean {
    return false
  }

  @Deprecated("Use IBillingSystemPlugin#producerExists instead.", "PC8.0.1")
  override function isProducerExist(p0: String ) : boolean {
    return false
  }

  override function createProducerCode( p0: ProducerCode, p1: String ) : String {
    return "pctest:1"
  }

  override function retrieveAllCommissionPlans() : CommissionPlanSummary[] {
    return COMMISSION_PLAN_SUMMARIES.toTypedArray()
  }

  override function syncProducerCode(producerCode : ProducerCode) {
    producerCode.CommissionPlans.each(\ codePlan -> {
      // CommissionPlan is required; billing system will have defaulted it...
      if (codePlan.CommissionPlanID == null) {
        codePlan.CommissionPlanID = getCommissionPlanSummaryFor(codePlan.Currency).Id
      }
    })
  }

  override function updateProducerCode( p0: ProducerCode, txnId : String ) : void {
  }

  override function syncOrganization(organization : Organization) {
    // null AgencyBillPlan is allowed; do nothing
  }

  override function updateProducer( p0: Organization, txnId : String ) : void {
  }

  override function updateAccount( p0: Account, p1: String ) : void {
  }

  override function rewritePolicyPeriod( p0: PolicyPeriod, p1: String ) : void {
  }

  override function issuePremiumReport( p0: PolicyPeriod, p1: String ) : void {
  }

  override function updateContact( p0: Contact, p1: String ) : void {
  }

  override function waiveFinalAudit( p0: PolicyPeriod, p1: String ) : void {
  }

  override function scheduleFinalAudit( p0: PolicyPeriod, p1: String ) : void {
  }

  override function getPeriodInfo( period: PolicyPeriod ) : PolicyPeriodBillingInfo {
    return new PolicyPeriodBillingInfo(){
      :BillingMethod = period.BillingMethod,
      :PaymentPlanID = period.SelectedPaymentPlan.BillingId,
      :AltBillingAccountNumber = period.AltBillingAccountNumber,
      :InvoiceStreamCode = period.InvoiceStreamCode
    }
  }

  override function transferPolicyPeriods(p0 : String, p1 : PolicyPeriod[], p2 : String) {
  }

  override function setDownPaymentInstallmentTotalForAllInstallmentsPlans(policyPeriod : PolicyPeriod, paymentPlans: PaymentPlanData[]) {
    paymentPlans.InstallmentPlans.each(\ paymentPlanData -> {
      var installmentPlan = paymentPlanData as InstallmentPlanDataImpl
      final var billingPaymentsPreview = new BillingPaymentsPreview(true, generatePreviewFor(policyPeriod, installmentPlan))
      installmentPlan.DownPayment = billingPaymentsPreview.getTypeTotal(DepositKey, policyPeriod)
      installmentPlan.Installment = billingPaymentsPreview.getTypeAmount(InstallmentKey, policyPeriod)
      installmentPlan.Fee = billingPaymentsPreview.getCategoryAmount(FeeKey, policyPeriod)
      installmentPlan.TotalFees = billingPaymentsPreview.getCategoryTotal(FeeKey, policyPeriod)
      installmentPlan.Tax = billingPaymentsPreview.getOneTimeCategoryAmount(TaxKey, policyPeriod)
      installmentPlan.Total = billingPaymentsPreview.getTotal(policyPeriod)
    })
  }

  override function getSubAccounts(parentAccountNumber: String) : BillingAccountSearchResult[] {
    return createSearchResultFromActualAccounts(getSampleSubAccounts())
  }

  override function getSubAccounts(parentAccountNumber : String, currency : Currency) : BillingAccountSearchResult[] {
    return createSearchResultFromActualAccounts(getSampleSubAccounts(currency))
  }

  override function getInvoiceStreams(accountNumber : String, currency : Currency, paymentPlan : PaymentPlanData) : BillingInvoiceStreamInfo[] {
    PCLoggerCategory.BILLING_SYSTEM_PLUGIN.info("Getting invoice streams for account: ${accountNumber}")
    return createInvoiceStreams(accountNumber, paymentPlan)
  }

  private function createInvoiceStreams(accountNumber : String, paymentPlan : PaymentPlanData) : BillingInvoiceStreamInfo[] {
    var id = accountNumber.hashCode() >> 114 // append the account number to the description for testing purpose
    return new BillingInvoiceStreamInfo[]{
      new StandAloneBillingInvoiceStreamInfo(){
        :PublicID = "1:" + id,
        :Description = "PA (57493074, 5738982)",
        :PaymentInstrumentName = "Visa xxxx-7288",
        :Interval = BillingPeriodicity.TC_MONTHLY,
        :DueDateBilling = false,
        :Days = "1",
        :PaymentMethod = AccountPaymentMethod.TC_CREDITCARD
      },
      new StandAloneBillingInvoiceStreamInfo(){
        :PublicID = "2:" + id,
        :Description = "BOP (478389838), CA (57383829)",
        :PaymentInstrumentName  = "Manual Payment",
        :Interval = BillingPeriodicity.TC_MONTHLY,
        :DueDateBilling = false,
        :Days = "15",
        :PaymentMethod = AccountPaymentMethod.TC_RESPONSIVE
      },
      new StandAloneBillingInvoiceStreamInfo(){
        :PublicID = "3:" + id,
        :Description = "IM",
        :PaymentInstrumentName  = "Amex xxxx-7287",
        :Interval = BillingPeriodicity.TC_TWICEPERMONTH,
        :DueDateBilling = true,
        :Days = "1, 15",
        :PaymentMethod = AccountPaymentMethod.TC_CREDITCARD
      },
      new StandAloneBillingInvoiceStreamInfo(){
        :PublicID = "5:" + id,
        :Description = "PA",
        :PaymentInstrumentName  = "Manual Payment",
        :Interval = BillingPeriodicity.TC_MONTHLY,
        :DueDateBilling = false,
        :Days = "15",
        :PaymentMethod = AccountPaymentMethod.TC_RESPONSIVE
      }
    }.where(\stream -> stream.isCompatibleWith(paymentPlan))
  }

  /**
   * Search for accounts attempts to mimic what would be returned from a billing system.  There are two sorts of queries
   * normally received: single account, and general.  For a single account, the system is often looking to verify the
   * account is of a particular type or has certain attributes.  Since most of these sorts will be looking for a
   * single, non-list bill account, if there's a query for one, we mock it and return it.  For a single list bill account,
   * the tester will need to use the TestBillingSystemPlugin and return a mock result for themselves.
   * The more general case is that the UI is looking to display a collection of accounts.  If the query does not have
   * a specific account number, we return three mock accounts.
   * @param searchCriteria the search for accounts
   * @param p1 the max number to return
   * @return
   */
  override function searchForAccounts(searchCriteria: BillingAccountSearchCriteriaJava, p1 : Integer) : BillingAccountSearchResult[] {
    if (searchCriteria typeis BillingAccountSearchCriteria and searchCriteria.AccountNumber != null) {
      if (!searchCriteria.ListBill) {
        var localAccountQuery = Query.make(Account)
        localAccountQuery.compare(Account.ACCOUNTNUMBER_PROP.get(), Relop.Equals, searchCriteria.AccountNumber)
        var results = createSearchResultFromActualAccounts(localAccountQuery.select().toTypedArray() as Account[])
        if (results.HasElements) {
          return results
        }
      }
    }

    var result1 = createSearchResult("1", searchCriteria)
    var result2 = createSearchResult("2", searchCriteria)
    var result3 = createSearchResult("3", searchCriteria)
    return {result1, result2, result3}
  }

  private function createSearchResultFromActualAccounts(accounts : Account[]) : BillingAccountSearchResult[]{

    var results = new ArrayList<BillingAccountSearchResult>()

    accounts.each(\ a -> {
     results.add( new StandAloneBillingAccountSearchResult(){
        :AccountNumber = a.AccountNumber,
        :AccountName = a.AccountHolderContact.DisplayName,
        :PrimaryPayer = "Payer",
        :Currency = a.PreferredSettlementCurrency
     })
    })

    return results.toTypedArray()
  }

  private function createSearchResult(id : String, criteria : BillingAccountSearchCriteriaJava) : BillingAccountSearchResult{
    var result = new StandAloneBillingAccountSearchResult(){
      :AccountNumber = id,
      :AccountName = UniqueKeyGenerator.get().nextID(),
      :PrimaryPayer = "Payer " + id}
    if (criteria typeis BillingAccountSearchCriteria) {
      if (criteria.AccountName.NotBlank) {
        result.AccountName = criteria.AccountName
      }
      result.AccountNameKanji = criteria.AccountNameKanji
    }
    return result
  }

  override function getExistingPaymentInstruments(accountNumber : String, currency : Currency) : BillingPaymentInstrument[] {
    return {new BillingPaymentInstrumentImpl(){
        :PublicID = "bctest:1",
        :DisplayName = "Visa xxxx-3452",
        :PaymentMethod = TC_CREDITCARD,
        :OneTime = false
      },
      new BillingPaymentInstrumentImpl(){
        :PublicID = "bctest:2",
        :DisplayName = "ACH/EFT xxxx-3857",
        :PaymentMethod = TC_ACH,
        :OneTime = false
      }
    }
  }

  @SuppressWarnings({"all"})
  override function addPaymentInstrumentTo(accountNumber : String, currency : Currency, paymentInstrument : BillingPaymentInstrument) : BillingPaymentInstrument {
    if (paymentInstrument.PaymentMethod == AccountPaymentMethod.TC_UNSUPPORTED) {
      throw new IllegalStateException(DisplayKey.get("BillingSystemPlugin.Error.UnsupportedPaymentMethod"))
    }
    return new BillingPaymentInstrumentImpl(){
        :PublicID = "bctest:1",
        :DisplayName = "Visa xxxx-3452",
        :PaymentMethod = paymentInstrument.PaymentMethod,
        :OneTime = paymentInstrument.OneTime,
        :Token = paymentInstrument.Token
      }
  }

  override function updatePolicyPeriodTermConfirmed(policyNumber : String, termNumber : int,
                                           isConfirmed : boolean) : void {
  }

  @Deprecated("Use updatePolicyPeriodTermConfirmed(String policyNumber, int termNumber, boolean isConfirmed) instead.", "PC8.0.1")
  override function updatePolicyPeriodTermConfirmed(policyNumber : String, termNumber : int,
                                                    isConfirmed : Boolean) : void {
  }

  /** Create or return existing sub accounts
   *
   */
  private function getSampleSubAccounts(currency : Currency = null) : Account[] {
    //TODO-dp cannot use test code in production module
    var query = Query.make(Account).compareIn("PublicId", {"pctest:bc:1", "pctest:bc:2", "pctest:bc:3"})
    if (currency != null) {
      query.compare(Account#PreferredSettlementCurrency, Relop.Equals, currency)
    }
    var results = query.select()
    if(results.HasElements){
      return results.toTypedArray()
    }

    var helper = TypeSystem.getByFullNameIfValid("gw.plugin.billing.impl.StandAloneBillingSystemPluginHelper")
    if(helper != null) {
      return ReflectUtil.invokeStaticMethod("gw.plugin.billing.impl.StandAloneBillingSystemPluginHelper", "init", {}) as Account[]
    } else {
      return new Account[0]
    }
  }

  override function retrieveAccountUnappliedFunds(accountNumber : String, currency : Currency) : BillingUnappliedFundInfo[] {
    return {}
  }

  private function getCommissionPlanSummaryFor(currency : Currency) : CommissionPlanSummary {
    var planSummary =
        COMMISSION_PLAN_SUMMARIES.firstWhere(\ planSummary -> planSummary.Currency == currency)
    if (planSummary == null) {
      planSummary = newCommissionPlanSummary(currency)
      COMMISSION_PLAN_SUMMARIES.add(planSummary)
    }
    return planSummary
  }

  private static function newAgencyBillingPlanSummary(currency: Currency, id: String): AgencyBillPlanSummary {
    var summary = new AgencyBillPlanSummary()
    var suffix = " (${id})"
    summary.Id = "pctest:" + currency.Ordinal + suffix
    summary.Name = DisplayKey.get("Web.Demo.Billing.StandardAgencyBillPlan") + suffix
    summary.Currency = currency
    return summary
  }

  private function newCommissionPlanSummary(currency : Currency) : CommissionPlanSummary {
    final var planSummary = new CommissionPlanSummary()
    planSummary.Name = DisplayKey.get("Web.Demo.Billing.StandardCommissionPlan") + currency.Code
    planSummary.Id = "pctest:" + currency.Ordinal
    planSummary.Currency = currency
    planSummary.AllowedTiers = new Tier[] {TC_BRONZE}
    return planSummary
  }

  private static property get DepositKey() : String {
    return "deposit"
  }

  private static property get InstallmentKey() : String {
    return "installment"
  }

  private static property get OneTimeKey() : String {
    return "onetime"
  }

  private static property get PremiumKey() : String {
    return "premium"
  }

  private static property get FeeKey() : String {
    return "fee"
  }

  private static property get TaxKey() : String {
    return "tax"
  }

  private static function generatePreviewFor(policyPeriod : PolicyPeriod, plan: PaymentPlanData): PaymentPreviewItem[] {
    final var planDescriptor = makePlanDescriptorForPlan(plan, policyPeriod.TotalPremiumRPT)
    final var installmentAmount = planDescriptor.Installment
    final var installmentFee = planDescriptor.InstallmentFee
    final var dates = generatePaymentDates(policyPeriod, planDescriptor)
    return dates.flatMap( \ date -> {
      if (date.before(policyPeriod.EditEffectiveDate)) {
        return {
            generatePreviewFor(date, planDescriptor.Deposit, DepositKey, PremiumKey),
            generatePreviewFor(date, policyPeriod.AllCosts.TaxSurcharges.AmountSum(policyPeriod.PreferredSettlementCurrency), OneTimeKey, TaxKey)
          }
      } else {
        // installmentAmount...
        final var installmentPreview = generatePreviewFor(date, installmentAmount,
            InstallmentKey, PremiumKey)
        return installmentFee.IsZero
            ? {installmentPreview}
            : {installmentPreview,
                generatePreviewFor(date, installmentFee, OneTimeKey, FeeKey)
            }
      }
    })
  }

  private static function generatePreviewFor(dueDate : Date, amount : MonetaryAmount,
      typeKey : String, chargeCategoryKey : String) : PaymentPreviewItem {
    return PaymentPreviewItemLocalizationHelper
        .localizeForDisplay(new PaymentPreviewItem(dueDate, amount, typeKey, chargeCategoryKey))
  }

  private static function generatePaymentDates(
      policyPeriod : PolicyPeriod, planDescriptor : PlanDescriptor) : Date[] {
    final var dates = new Date[planDescriptor.NumberOfPayments]
    if (planDescriptor.DepositPercent > 0) {
      dates[0] = policyPeriod.EditEffectiveDate.addDays(-25)
    }
    if (dates.Count > 1) {
      var startDate = policyPeriod.EditEffectiveDate
      final var daySpan = startDate.differenceInDays(policyPeriod.EndOfCoverageDate)
          / planDescriptor.NumberOfInstallments
      for (i in 1..|dates.length) {
        dates[i] = startDate
        startDate = startDate.addDays(daySpan)
      }
    }
    return dates
  }

  private static function makePlanDescriptorForPlan(paymentPlan : PaymentPlanData, totalCost : MonetaryAmount) : PlanDescriptor {
    switch (paymentPlan.BillingId) {
      case "pctest:2":   // 6 Pay --> Down payment + 5 installments
          return new PlanDescriptor(
            : depositPercent = 0.18,
            : numberOfInstallments = 5,
            : installmentPercent = 0.03,
            : totalCost = totalCost)
      case "pctest:3":   // 3 Pay --> Down payment + 2 installments
          return new PlanDescriptor(
            : depositPercent = 0.40,
            : numberOfInstallments = 2,
            : installmentPercent = 0.02,
            : totalCost = totalCost)
      case "pctest:4":   // Full Pay --> Down payment only
          return new PlanDescriptor(
            : depositPercent = 1.00,
            : numberOfInstallments = 0,
            : installmentPercent = 0,
            : totalCost = totalCost)
      case "pctest:5":   // Twice Per Month --> Down payment + 10 installments
          return new PlanDescriptor(
            : depositPercent = 0.20,
            : numberOfInstallments = 8,
            : installmentPercent = 0.10,
            : totalCost = totalCost)
      default:           // A default which generates a partial down payment and installments with no add-on fees
          return new PlanDescriptor(
            : depositPercent = 0.40,
            : numberOfInstallments = 2,
            : installmentPercent = 0,
            : totalCost = totalCost)
    }
  }

  static private class PlanDescriptor {
    private var _depositPercent : Double as readonly DepositPercent
    private var _installmentCount : int as readonly NumberOfInstallments
    private var _installmentPercent : Double as readonly InstallmentPercent
    private var _numberOfPayments : int as readonly NumberOfPayments
    private var _deposit : MonetaryAmount as readonly Deposit
    private var _installment : MonetaryAmount as readonly Installment
    private var _installmentFee : MonetaryAmount as readonly InstallmentFee
    private var _total : MonetaryAmount as readonly Total

    construct(depositPercent : Double, numberOfInstallments : int, installmentPercent : Double, totalCost : MonetaryAmount) {
      _depositPercent = depositPercent
      _installmentCount = numberOfInstallments
      _installmentPercent = installmentPercent
      calculate(totalCost)
    }

    private function calculate(totalCost : MonetaryAmount) {
      _numberOfPayments = DepositPercent == 0 ? NumberOfInstallments : 1 + NumberOfInstallments

      _deposit = MonetaryAmounts.roundToCurrencyScale(totalCost.Amount * DepositPercent, totalCost.Currency, HALF_EVEN)

      _installment = NumberOfInstallments > 0
          ? MonetaryAmounts.roundToCurrencyScale((totalCost - Deposit)/NumberOfInstallments, totalCost.Currency, CEILING)
          : 0bd.ofCurrency(totalCost.Currency)

      // Correct any excess created by the rounding in previous step
      _deposit = totalCost.subtract(Installment * NumberOfInstallments)

      _installmentFee = MonetaryAmounts.roundToCurrencyScale(Installment * InstallmentPercent, HALF_EVEN)

      _total = (InstallmentPercent == 0)
          ? MonetaryAmounts.roundToCurrencyScale(totalCost)  // Avoid any rounding issues when no fees are applied
          : // Calc as sum of the down payment + installments
          MonetaryAmounts.roundToCurrencyScale(
              (Deposit + (NumberOfInstallments * Installment)).Amount,
                  totalCost.Currency, HALF_EVEN)
    }
  }
}
