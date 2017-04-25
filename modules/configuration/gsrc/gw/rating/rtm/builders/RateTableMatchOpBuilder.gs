package gw.rating.rtm.builders

uses gw.api.builder.BuilderArrayPopulator
uses gw.api.databuilder.DataBuilder
uses gw.entity.IArrayPropertyInfo
uses java.util.ArrayList
uses java.util.List

@Export
class RateTableMatchOpBuilder extends DataBuilder<RateTableMatchOp, RateTableMatchOpBuilder> {

  var columns : List<RateTableColumnBuilder>

  construct() {
    super(RateTableMatchOp)
    this.columns = new ArrayList<RateTableColumnBuilder>()
    withDefinition(RateTableMatchOpDefinitionBuilder.ExactMatchOp)
    withOpName("op name")
    withMatchOpName("match op name")
  }

  final function belongsTo(table : RateTableDefinitionBuilder) {
    columns.each(\ c -> c.addPopulator(new RateColumnPopulator(table)))  
  }

  final function withRateTableDefinition(rateTableDef : RateTableDefinition) : RateTableMatchOpBuilder {
    set(RateTableMatchOp.Type.TypeInfo.getProperty("Definition"), rateTableDef.ID)
    return this
  }

  // TODO: Consider renaming withDefinition to with withMatchOpDefinition as Definition is the property
  // name for rate table definition... a bit confusing
  final function withDefinition(matchOpDef : RateTableMatchOpDefinition) : RateTableMatchOpBuilder {
    set(RateTableMatchOp.Type.TypeInfo.getProperty("MatchOpDefinition"), matchOpDef.ID)
    return this
  }
  final function withDefinition(matchOpDef : RateTableMatchOpDefinitionBuilder) : RateTableMatchOpBuilder {
    set(RateTableMatchOp.Type.TypeInfo.getProperty("MatchOpDefinition"), matchOpDef)
    return this
  }

  final function withRateTableArgumentSource(bld : RateTableArgumentSourceBuilder) : RateTableMatchOpBuilder {
    addPopulator(new BuilderArrayPopulator<RateTableMatchOp>(RateTableMatchOp.Type.TypeInfo.getProperty("ArgumentSources") as IArrayPropertyInfo, bld))
    return this
  }

  final function addParam(column : RateTableColumnBuilder) : RateTableMatchOpBuilder {
    addArrayElement(RateTableMatchOp.Type.TypeInfo.getProperty("Params"), column)
    columns.add(column)
    return this
  }   
  
  final function withOpName(name : String) : RateTableMatchOpBuilder {
    set(RateTableMatchOp.Type.TypeInfo.getProperty("Name"), name)
    withMatchOpName(name)
    return this  
  }

  final function withMatchOpName(name : String) : RateTableMatchOpBuilder {
    set(RateTableMatchOp.Type.TypeInfo.getProperty("DisplayText"), name)
    setForAllLanguages(RateTableMatchOp#DisplayText.PropertyInfo, name)
    return this
  }
}
