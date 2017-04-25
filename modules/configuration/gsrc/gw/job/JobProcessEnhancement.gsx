package gw.job

enhancement JobProcessEnhancement : gw.job.JobProcess {
  
  function requestQuote(skipValidation : boolean) {
    requestQuote(skipValidation, false)
  }

  function requestQuote(skipValidation : boolean, skipEvaluation : boolean) {
    doMaybeSkippingValidationAndEvaluation(skipValidation, skipEvaluation, \ -> this.requestQuote())  
  }
  
  function bindOnly(skipValidation : boolean) {
    bindOnly(skipValidation, false)
  }

  function bindOnly(skipValidation : boolean, skipEvaluation : boolean) {
    doMaybeSkippingValidationAndEvaluation(skipValidation, skipEvaluation, \ -> (this as SubmissionProcess).bindOnly())
  }

  function bind(skipValidation : boolean) {
    bind(skipValidation, false)
  }
  
  function bind(skipValidation : boolean, skipEvaluation : boolean) {
    doMaybeSkippingValidationAndEvaluation(skipValidation, skipEvaluation, \ -> this.bind())
  }
  
  protected function doMaybeSkippingValidationAndEvaluation(skipValidation : boolean, skipEvaluation : boolean, action()) {
    var prevValidator = this.JobProcessValidator
    var prevEvaluator = this.JobProcessEvaluator
    try {
      if (skipValidation) {
        this.JobProcessValidator = JobProcessValidator.NO_OP_VALIDATOR
      }
      if (skipEvaluation) {
        this.JobProcessEvaluator = JobProcessUWIssueEvaluator.NO_OP_EVALUATOR
      }
      action()
    } finally {
      this.JobProcessValidator = prevValidator
      this.JobProcessEvaluator = prevEvaluator
    }  
  }
  
}
