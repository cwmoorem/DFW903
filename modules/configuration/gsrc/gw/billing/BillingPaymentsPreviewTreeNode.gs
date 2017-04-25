package gw.billing

uses gw.pl.currency.MonetaryAmount

uses java.util.Date

@Export
class BillingPaymentsPreviewTreeNode {

  var _dueDate : Date as DueDate
  var _type : String as Type
  var _chargeCategory : String as ChargeCategory
  var _amount : MonetaryAmount as Amount
  var _invoiceAmount : MonetaryAmount as InvoiceAmount
  var _changeAmount : MonetaryAmount as ChangeAmount

  construct(dueDate : Date, type : String, chargeCategory : String) {
    DueDate = dueDate
    Type = type
    ChargeCategory = chargeCategory
  }
}