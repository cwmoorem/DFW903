package gw.web.billing

uses java.lang.IllegalStateException
uses java.lang.SuppressWarnings
uses gw.api.locale.DisplayKey

@Export
class PaymentInstrumentUIHelper {

  static function checkForError(jobNumber : String, jobToFind : Job) : String{
    if (jobNumber == null)
      return DisplayKey.get("Web.Errors.MissingUrlParameter", "JobNumber")
    if (jobToFind == null)
      return DisplayKey.get("Web.Errors.InvalidUrlParameter", "JobNumber", jobNumber)
    var currentUser: User = User.util.CurrentUser
    if (not currentUser.canView(jobToFind))
      return DisplayKey.get("Java.Error.Permission.View", "job")
    return null
  }

  /**
   * @deprecated Deprecated in PC 8.0.2. Use PolicyPeriod#createPaymentInstrument instead.
   */
  @SuppressWarnings({"all"})
  @Deprecated(:value="Use PolicyPeriod#createPaymentInstrument instead.", :version="8.0.2")
  function createPaymentInstrument(jobToFind : Job, paymentMethod : String, token : String) {
    if (paymentMethod != null) {
      if (paymentMethod == AccountPaymentMethod.TC_UNSUPPORTED as String) {
        throw new IllegalStateException(DisplayKey.get("BillingSystemPlugin.Error.UnsupportedPaymentMethod"))
      }
      var plugin = gw.plugin.Plugins.get(gw.plugin.billing.IBillingSystemPlugin)
      var paymentInstrument = new gw.plugin.billing.BillingPaymentInstrumentImpl()
      paymentInstrument.PaymentMethod = typekey.AccountPaymentMethod.get(paymentMethod)
      paymentInstrument.Token = token
      var accountNumber = jobToFind.Policy.Account.AccountNumber
      plugin.addPaymentInstrumentTo(accountNumber, jobToFind.Periods.first()?.PreferredSettlementCurrency, paymentInstrument)
    }
  }
}
