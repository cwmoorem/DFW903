package gw.web.notes

uses gw.api.database.IQueryBeanResult

@Export
class NoteSearchUtil {
  private construct() {
  }

  private static function initRelatedTo(sc: NoteSearchCriteria, pp: PolicyPeriod) {
    if (sc.RelatedTo == null)
      sc.RelatedTo = Optional
          .ofNullable(sc.getRelatedToSearchCriteria(pp))
          .filter(\rlt -> !rlt.IsEmpty)
          .map(\rlt -> rlt.first())
          .orElse(null)
  }

  static function createSearchCriteria(acc: Account): NoteSearchCriteria {
    var sc = new NoteSearchCriteria(){:Account = acc}
    initRelatedTo(sc, null)
    return sc;
  }

  static function createSearchCriteria(pp: PolicyPeriod): NoteSearchCriteria {
    var sc = new NoteSearchCriteria(){:Policy = pp.Policy}
    initRelatedTo(sc, pp)
    return sc;
  }

  static function createSearchCriteria(acc: Account, pp: PolicyPeriod): NoteSearchCriteria {
    if (pp == null)
      return createSearchCriteria(acc)
    return createSearchCriteria(pp)
  }

  static function performSearch(sc: NoteSearchCriteria, pp: PolicyPeriod, act: Activity): IQueryBeanResult<Note> {
    initRelatedTo(sc, pp)
    sc.setSearchCriteria(act)
    return sc.performSearch()
  }
}