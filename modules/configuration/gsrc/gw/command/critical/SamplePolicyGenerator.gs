package gw.command.critical

uses gw.api.builder.AccountBuilder
uses gw.api.builder.AccountContactBuilder
uses gw.api.builder.AccountLocationBuilder
uses gw.api.builder.CoverageBuilder
uses gw.api.builder.DriverBuilder
uses gw.api.builder.PersonBuilder
uses gw.api.builder.PolicyLineBuilderBase
uses gw.api.builder.PolicyLocationBuilder
uses gw.api.builder.ProducerCodeBuilder
uses gw.api.builder.SubmissionBuilder
uses gw.api.builder.TerritoryCodeBuilder
uses gw.api.database.Query
uses gw.api.database.QuerySelectColumns
uses gw.api.databuilder.ba.BAJurisdictionBuilder
uses gw.api.databuilder.ba.BAVehicleBuilder
uses gw.api.databuilder.ba.BusinessAutoLineBuilder
uses gw.api.databuilder.bop.BOPBuildingBuilder
uses gw.api.databuilder.bop.BOPLineBuilder
uses gw.api.databuilder.bop.BOPLocationBuilder
uses gw.api.databuilder.cp.CPBuildingBuilder
uses gw.api.databuilder.cp.CPLocationBuilder
uses gw.api.databuilder.cp.CommercialPropertyLineBuilder
uses gw.api.databuilder.cpp.CPPSubmissionBuilder
uses gw.api.databuilder.gl.GLExposureBuilder
uses gw.api.databuilder.gl.GeneralLiabilityLineBuilder
uses gw.api.databuilder.im.IMLocationBuilder
uses gw.api.databuilder.im.IMSignBuilder
uses gw.api.databuilder.im.IMSignPartBuilder
uses gw.api.databuilder.im.InlandMarineLineBuilder
uses gw.api.databuilder.pa.PAVehicleBuilder
uses gw.api.databuilder.pa.PersonalAutoLineBuilder
uses gw.api.databuilder.pa.PolicyDriverBuilder
uses gw.api.databuilder.pa.VehicleDriverBuilder
uses gw.api.databuilder.wc.WCCoveredEmployeeBuilder
uses gw.api.databuilder.wc.WCSubmissionBuilder
uses gw.api.databuilder.wc.WorkersCompLineBuilder
uses gw.api.path.Paths
uses gw.api.productmodel.PolicyLinePattern
uses gw.pl.persistence.core.Bundle
uses gw.transaction.Transaction
uses gw.api.builder.BuildingBuilder
uses gw.api.upgrade.PCCoercions
uses gw.api.productmodel.CoveragePattern

@Export
class SamplePolicyGenerator {
  
  construct() {
  }
  
  public static function getProducerCode() : ProducerCode {
    var query = Query.make(ProducerCode).join(CommissionPlan, "ProducerCode").compare("Currency", Equals, Currency.TC_USD)
    var results = query.select().orderByDescending(QuerySelectColumns.path(Paths.make(ProducerCode#CreateTime)))
    var producerCode = results.first()
    if(producerCode == null){
      Transaction.runWithNewBundle(\ bundle -> {
        producerCode = new ProducerCodeBuilder()
          .withPublicId("pctest:1")
          .withCode("Test Code")
          .create(bundle)
      })
    }
    return producerCode
  }
  
  static function wPALine() : PolicyPeriod {
    var period : PolicyPeriod
    Transaction.runWithNewBundle(\ bundle -> {
      var accountLocationBuilder = new AccountLocationBuilder()
      var driverBuilder = new DriverBuilder()
      var driverAccountContact = new AccountContactBuilder()
        .withDefaultContact()
        .withRole(driverBuilder)
      var account = new AccountBuilder()
        .withAccountLocation(accountLocationBuilder)
        .withAccountContact(driverAccountContact)
      var vehicleDriverBuilder = new VehicleDriverBuilder().withPercentageDriven(100)
      var vehicleBuilder = new PAVehicleBuilder().withVehicleDriver(vehicleDriverBuilder)
      var policyDriverBuilder = new PolicyDriverBuilder()
         .withAccountContactRole(driverBuilder)
         .withVehicleDriver(vehicleDriverBuilder)
      var lineBuilder = new PersonalAutoLineBuilder()
          .withVehicle(vehicleBuilder)
          .withPolicyDriver(policyDriverBuilder)
      period = new SubmissionBuilder()
        .withAccount(account)
        .withProduct("PersonalAuto")
        .withBillingMethod(BillingMethod.TC_DIRECTBILL)
        .withProducerCodeOfRecord(getProducerCode())
        .withPolicyContactRole(policyDriverBuilder)
        .withPolicyLine(lineBuilder)
        .withPaymentPlanID("pctest:2")
        .isDraft()
        .create(bundle)
    })
    return period
  }
  
  static function wWCLine() : PolicyPeriod {
    var period : PolicyPeriod
    Transaction.runWithNewBundle(\ bundle -> {
      var wcLineBuilder = new WorkersCompLineBuilder()
        .withWCCoveredEmployee(new WCCoveredEmployeeBuilder())
      var account = new AccountBuilder()
        .withAccountNumber(KeyGenerator.nextString())
        .create(bundle)
      period = new WCSubmissionBuilder()
          .withAccount(account)
          .withBillingMethod(BillingMethod.TC_DIRECTBILL)
          .withReportingPattern("ReportCalendarMonthExclLast")
          .withPolicyLine(wcLineBuilder)
          .withProducerCodeOfRecord(getProducerCode())
          .isDraft()
          .create(bundle)
    })
    return period
  }
  
  static function wBALine() : PolicyPeriod {
    var period : PolicyPeriod
    Transaction.runWithNewBundle(\ bundle -> {
      var vehicleBuilder = new BAVehicleBuilder().withVIN("1").withClassCode("0420").withVehicleType(TC_PP)
      var lineBuilder = new BusinessAutoLineBuilder()
        .withJurisdiction(new BAJurisdictionBuilder()
        .withState(TC_CA))
        .withCoverage(new CoverageBuilder(BAOwnedLiabilityCov)
          .withPatternCode("BAOwnedLiabilityCov"))
        .withFleet(TC_NONFLEET).withVehicle(vehicleBuilder)
      var account = new AccountBuilder()
        .withAccountLocation(new AccountLocationBuilder())
        .withAccountNumber(KeyGenerator.nextString())
        .create(bundle)
      period = createPolicyPeriod(bundle, account, "BusinessAuto", lineBuilder)
    })
    return period
  }
  
  static function wBOPLine() : PolicyPeriod {
    var period : PolicyPeriod
    Transaction.runWithNewBundle(\ bundle -> {
      var contactBuilder = new PersonBuilder()
        .withFirstName(KeyGenerator.getFirstName())
        .withLastName(KeyGenerator.getLastName())
      var account = new AccountBuilder(false)
        .withAccountHolderContact(contactBuilder)
        .withAccountNumber(KeyGenerator.getAccountNumber())
        .create(bundle)
      var lineBuilder = new BOPLineBuilder()
         .withSmallBusinessType(SmallBusinessType.TC_APARTMENT)
         .withOnlyBOPLocation(new BOPLocationBuilder()
         .withBuilding(new BOPBuildingBuilder().withBuilding(new BuildingBuilder())))
      period = createPolicyPeriod(bundle, account, "BusinessOwners", lineBuilder)
    })
    return period
  }
  
  static function wCPLine() : PolicyPeriod {
    var period : PolicyPeriod
    Transaction.runWithNewBundle(\ bundle -> {
      var primaryLocation = new AccountLocationBuilder().withLocationNumber(0001).withCode("0001").withName("Location 0001")
      var otherLocation = new AccountLocationBuilder().withLocationNumber(0002).withCode("0002").withName("Location 0002")
      var territoryCode = new TerritoryCodeBuilder().withPolicyLinePattern(PCCoercions.makeProductModel<PolicyLinePattern>("CPLine")).withCode("30")
      var policyLocationBldr = new PolicyLocationBuilder().withAccountLocation(otherLocation).withTerritoryCode(territoryCode)
      var account = new AccountBuilder()
        .withAccountNumber(KeyGenerator.nextString())
        .withPrimaryLocation(primaryLocation)
        .withAccountLocation(otherLocation)
        .create(bundle)
      
      var buildingBldr : BuildingBuilder
      var cpbuildingBldr : gw.api.databuilder.cp.CPBuildingBuilder
      var locationBldr : gw.api.databuilder.cp.CPLocationBuilder
      var lineBuilder : gw.api.databuilder.cp.CommercialPropertyLineBuilder
      
      lineBuilder = new CommercialPropertyLineBuilder()
      for (i in 0..1) { // to increase the number of locations, you must add an AccountLocation and a PolicyLocation and hook them up
        var locationNum = i + 1
        locationBldr = new CPLocationBuilder()
        for (j in 0..1) { // OK to increase the number of buildings by adjusting the count
          var buildingNum = j + 1
          buildingBldr = new BuildingBuilder().withDescription("Building ${locationNum}-${buildingNum}")
          cpbuildingBldr = new CPBuildingBuilder().withBuilding(buildingBldr)
          locationBldr.withBuilding(cpbuildingBldr)
          if (i==0) {
            ; // takes the default PolicyLocation that is created with the Submission
          } else {
            locationBldr.withLocation(policyLocationBldr)
          }
        }
        lineBuilder.withCPLocation(locationBldr)
      }
      period = new SubmissionBuilder()
        .withAccount(account)
        .withProduct("CommercialProperty")
        .withPolicyLine(lineBuilder)
        .withProducerCodeOfRecord(getProducerCode())
        .withPolicyLocation(policyLocationBldr)
        .withPaymentPlanID("pctest:2")
        .isDraft()
        .create(bundle)

      // rberlin make coverages on the buildings distinct
      period.AllCoverables.whereTypeIs(CPBuilding).eachWithIndex(\ c, i -> {
        c.CoveragesFromCoverable.each(\ coverage -> {
          switch (typeof coverage) {
            // Rating engine only creates Costs for these two.
            case CPBldgCov:
                coverage.CPBldgCovLimitTerm.Value += 100000*i ;
                break
            case CPBPPCov:
                coverage.CPBPPCovLimitTerm.Value  += 100000*i ;
                break

            default: break;
          }
        })
      })
    })
    return period
  }

  static function wGLLine() : PolicyPeriod {
    var period : PolicyPeriod
    Transaction.runWithNewBundle(\ bundle -> {
      var account = new AccountBuilder()
        .withAccountNumber(KeyGenerator.nextString())
        .create(bundle)
      var lineBuilder = new GeneralLiabilityLineBuilder()
        .withGLCoverageForm(GLCoverageFormType.TC_OCCURRENCE)
        .withExposure(new GLExposureBuilder().withClassCodeAndBasis("0012", 1000000))
      period = createPolicyPeriod(bundle, account, "GeneralLiability", lineBuilder)
    })
    return period
  }
  
  static function wIMLine() : PolicyPeriod{
    var period : PolicyPeriod
    Transaction.runWithNewBundle(\ bundle -> {
      var account = new AccountBuilder()
        .withAccountNumber(KeyGenerator.nextString())
        .create(bundle)
    var policyLocationBldr1 = new PolicyLocationBuilder()
    var imLocationBldr1 = new IMLocationBuilder().withLocation(policyLocationBldr1)
      var partBuilder = new IMSignPartBuilder()
        .withSign(new IMSignBuilder()
          .withIMLocation(imLocationBldr1)
          .withCoverage(new CoverageBuilder(entity.IMSignCov)
            .withPattern(PCCoercions.makeProductModel<CoveragePattern>("IMSignCov"))
            .withDirectTerm("IMSignLimit", 150000)))
      var lineBuilder = new InlandMarineLineBuilder()
        .withIMLocation(imLocationBldr1)
        .withPart(partBuilder)
        
      period = new SubmissionBuilder()
      .withPolicyLocation(policyLocationBldr1)
      .withAccount(account)
      .withProduct("InlandMarine")
      .withPolicyLine(lineBuilder)
      .withProducerCodeOfRecord(getProducerCode())
      .withPaymentPlanID("pctest:2")
      .isDraft()
      .create(bundle)
    })
    
    return period
  }

  static function wCPPLine(withCP : boolean, withGL : boolean, withIM : boolean) : PolicyPeriod {
    // Create CPP with three lines
    var period : PolicyPeriod
    Transaction.runWithNewBundle(\ bundle -> {
      period = new CPPSubmissionBuilder(true, withCP, withGL, withIM)
        .isDraft().withPaymentPlanID("pctest:2").create(bundle)
      // Explicitly remove unwanted lines so domain code is executed correctly (e.g., removing territory codes)
      createOrRemoveLine(period, PCCoercions.makeProductModel<PolicyLinePattern>("CPLine"), withCP)
      createOrRemoveLine(period, PCCoercions.makeProductModel<PolicyLinePattern>("GLLine"), withGL)
      createOrRemoveLine(period, PCCoercions.makeProductModel<PolicyLinePattern>("IMLine"), withIM)
    })
    return period
  }

  static function createPolicyPeriod(bundle : Bundle, account : Account, 
                                     product : String, lineBuilder : PolicyLineBuilderBase) : PolicyPeriod {
    var period = new SubmissionBuilder()
      .withAccount(account)
      .withProduct(product)
      .withPolicyLine(lineBuilder)
      .withProducerCodeOfRecord(getProducerCode())
      .withPaymentPlanID("pctest:2")
      .isDraft()
      .create(bundle)
    return period
  }

  static function createOrRemoveLine(period : PolicyPeriod, linePattern : PolicyLinePattern, shouldCreate : boolean) {
    if(shouldCreate and not period.getLineExists(linePattern)) {
      period.createPolicyLine(linePattern)
    } else if (not shouldCreate and period.getLineExists(linePattern)) {
      period.removeFromLines(period.getLine(linePattern))
    }
  }
}
