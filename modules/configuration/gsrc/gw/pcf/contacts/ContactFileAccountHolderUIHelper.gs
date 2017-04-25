package gw.pcf.contacts

uses java.util.Set
uses gw.web.contact.AccountHolderPolicyMetrics

/**
 *  UX Improvements
 */
@Export
class ContactFileAccountHolderUIHelper {

  /**
   * List of roles used determine which accounts will have access to the account holder info page, and to
   * better display the account metrics on the page itself.
   */
  final static var _roles : Set<Type<AccountContactRole>> as RolesAllowedToViewTheAccountHoldersPage =
      {
          AccountHolder
      }

  /**
   *  Determine if the account holder page can be displayed based on the permissions of the current user and the
   *  roles associated with the contact.
   */
  static function canViewAccountHolderPage(contact : Contact) : boolean {
    return AccountHolderPolicyMetrics.Instance.countAccountsFor(contact, RolesAllowedToViewTheAccountHoldersPage) > 0
  }
}