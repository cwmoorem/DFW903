package gw.bizrules.provisioning.contexts

uses gw.bizrules.IRuleContext
uses gw.lang.reflect.IType
uses gw.policy.PolicyEvalContext

@Export
abstract public class AbstractUWRuleContextDefinition implements UWRuleContextDefinition {
  public final static var PARAM_POLICYPERIOD: String = "policyPeriod"
  public final static var PARAM_LIB: String = "util"
  public final static var PARAM_UTIL : String = "Util"
  final var _symbols: Map<String, IType>
  final var _extractionMap: Map<String, block(evalContext: PolicyEvalContext): Object>
  var _iterativeSymbol: String

  construct() {
    _symbols = {}
    _extractionMap = {}
    addSymbol(PARAM_POLICYPERIOD, PolicyPeriod, \ec -> ec.Period)
    addSymbol(PARAM_LIB, PolicyContextDefinitionLibrary, \p -> new PolicyContextDefinitionLibrary())
    addSymbol(PARAM_UTIL, PolicyContextDefinitionLibrary, \p -> new PolicyContextDefinitionLibrary())
  }

  override property get SymbolNames(): Set<String> {
    return _symbols.keySet()
  }

  override function getSymbolType(symbolName: String): IType {
    return _symbols.get(symbolName)
  }

  override function generateContexts(evalContext: PolicyEvalContext): List<IRuleContext> {
    var contextBuilder: ContextBuilder
    if (_iterativeSymbol == null) {
      // noniterative context
      contextBuilder = new ContextBuilder(this)
    } else {
      // iterative context
      contextBuilder = new IterativeContextBuilder(this, _iterativeSymbol, _extractionMap.get(_iterativeSymbol)(evalContext))
    }
    return populateContextBuilder(contextBuilder, evalContext).create()
  }

  protected final function addSymbol(name: String, type: IType, extractor: block(evalContext: PolicyEvalContext): Object) {
    _symbols.put(name, type)
    _extractionMap.put(name, extractor)
  }

  protected final function addIterativeSymbol(name: String, type: IType, arrayExtractor: block(evalContext: PolicyEvalContext): Object) {
    assert _iterativeSymbol == null
    _iterativeSymbol = name
    addSymbol(name, type, arrayExtractor)
  }

  private function populateContextBuilder(contextBuilder: ContextBuilder, evalContext: PolicyEvalContext): ContextBuilder {
    SymbolNames.each(\symbol -> {
      if (symbol != _iterativeSymbol) {
        contextBuilder.withValue(symbol, _extractionMap.get(symbol)(evalContext))
      }
    })
    return contextBuilder
  }
}