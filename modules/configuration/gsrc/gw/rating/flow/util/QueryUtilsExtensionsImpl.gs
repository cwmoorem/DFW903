package gw.rating.flow.util

uses gw.api.database.Query

@Export
class QueryUtilsExtensionsImpl implements IQueryUtilsExtensions {

  override function getPreviousCalcRoutineVersion(routine: CalcRoutineDefinition): CalcRoutineDefinition {
    var previousRoutine : CalcRoutineDefinition = null
    if (routine.Version > 1) {
      var versions = Query.make(CalcRoutineDefinition)
          .compare("Code", Equals, routine.Code)
          .compare("Version", Equals, routine.Version - 1)
          .compare("Jurisdiction", Equals, routine.Jurisdiction)
          .select()
      previousRoutine = versions.first()
    }
    return previousRoutine
  }
}