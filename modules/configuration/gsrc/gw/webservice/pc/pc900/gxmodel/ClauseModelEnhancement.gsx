package gw.webservice.pc.pc900.gxmodel
uses entity.Clause
uses gw.api.productmodel.CovTermPattern
uses java.lang.IllegalArgumentException
uses gw.api.productmodel.CovTermPatternLookup

enhancement ClauseModelEnhancement : gw.webservice.pc.pc900.gxmodel.clausemodel.types.complex.Clause {
  function populateCoverage(cov : Clause){
    for(ct in this.CovTerms.Entry){
      var pattern = CovTermPatternLookup.getByCode(ct.PatternCode)
      if(pattern == null){
        throw new IllegalArgumentException("Invalid coverage term pattern :" + ct.PatternCode)
      }
      var covTerm = cov.getCovTerm(pattern)
      if(covTerm == null){
        throw new IllegalArgumentException("Coverage ${cov.Pattern.Code} does not have cov term: ${ct.PatternCode}")
      }
      covTerm.setValueFromString(ct.DisplayValue)
    }
  }
}
