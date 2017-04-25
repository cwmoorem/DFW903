package gw.sampledata.tiny

uses gw.api.builder.UWRuleBuilder
uses gw.api.system.PCLoggerCategory
uses gw.bizrules.databuilder.ExpressionFragmentBuilders
uses gw.bizrules.databuilder.RuleConditionBuilder
uses gw.pl.persistence.core.Bundle

/**
 * Sample UWIssue Rules
 */
@Export
class TinySampleUWRuleData {
  construct() {
  }

  static function load() {
    if (not AlreadyLoaded) {
      gw.transaction.Transaction.runWithNewBundle(\bundle -> {
        PCLoggerCategory.SAMPLE_DATA.info("  - loading Tiny UWIssueTypeData ...")
        load(bundle)
      })
    }
  }

  private static property get AlreadyLoaded(): boolean {
    return UWIssueType.finder.findUWIssueTypeByCode("PANumberOfVehicles") != null
  }

  private static function load(bundle: Bundle) {
    DefaultBuilder
        .withCode("PANumberOfVehicles")
        .withComparator(TC_NUMERIC_LE)
        .withDefaultDurationType(TC_ENDOFTERM)
        .withDefaultEditBeforeBind(true)
        .withDefaultValueAssignmentType(TC_OFFSETAMOUNT)
        .withDefaultValueOffsetAmount(1)
        .withDescription("PA: The number of vehicles on the policy requires approval")
        .withName("PA: Number of vehicles")
        .withValueFormatter(TC_INTEGER)
        .withRuleContextDefinitionKey(TC_PAPOLICY)
        .withPolicyLine(TC_PERSONALAUTOLINE)
        .withRuleCondition(new RuleConditionBuilder()
            .addRuleConditionLine("paVehicles.length", RuleOperator.TC_GREATERTHANOREQUAL, "5"))
        .withIssueKeyParam("PANumberOfVehicles")

            // populate Engish for all languages first, then override other languages
        .withShortDescParam("Five or more vehicles on Personal Auto policy")
        .withLongDescParam("Policy contains \${paVehicles.length} vehicles")

        .withShortDescParam("Cinq véhicules ou plus sur le contrat Automobile personnelle", "fr_FR")
        .withLongDescParam("Le contrat contient \${paVehicles.length} véhicules", "fr_FR")

        .withShortDescParam("Cinq véhicules ou plus sur le contrat Automobile personnelle", "fr_CA")
        .withLongDescParam("Le contrat contient \${paVehicles.length} véhicules", "fr_CA")

        .withShortDescParam("個人用自動車保険に 5 台以上の車両が含まれています", "ja")
        .withLongDescParam("保険契約に \${paVehicles.length} 台の車両が含まれています", "ja")

        .withValueParam("\${paVehicles.length}")
        .withAvailableToRun(true)
        .create(bundle)

    DefaultBuilder
        .withCode("PAGaragingZip")
        .withDefaultApprovalBlockingPoint(TC_BLOCKSISSUANCE)
        .withDefaultDurationType(TC_ONEYEAR)
        .withDescription("PA: The zip of principle garaging doesn't match the address of the primary insured")
        .withName("PA: Zip of principal garaging mismatch")
        .withPolicyLine(TC_PERSONALAUTOLINE)
        .withRuleContextDefinitionKey(TC_PAPOLICYVEHICLEITERATIVE)
        .withRuleCondition(new RuleConditionBuilder()
            .withRuleConditionType(TC_ALLOR)
            .addHasValueRuleConditionLine("paVehicle.GarageLocation.PostalCode", TC_HASNOVALUE)
            .addRuleConditionLine("paVehicle.GarageLocation.PostalCode.split(\"-\").first()", TC_NOTEQUALS,
                "policyPeriod.PrimaryNamedInsured.AccountContactRole.AccountContact.Contact.PrimaryAddress.PostalCode.split(\"-\").first()")
        )
        .withIssueKeyParam("Vehicle:\${paVehicle.FixedId}")

        .withShortDescParam("Inconsistent garaging ZIP code")
        .withLongDescParam("Vehicle \${paVehicle} is garaged in ZIP code \${paVehicle.GarageLocation.PostalCode}, which doesn't match the primary insured's ZIP code of \${policyPeriod.PrimaryNamedInsured.AccountContactRole.AccountContact.Contact.PrimaryAddress.PostalCode}")

        .withShortDescParam("Code postal du garage incohérent", "fr_FR")
        .withLongDescParam("Le véhicule \${paVehicle} est au garage à l'emplacement ayant le code postal \${paVehicle.GarageLocation.PostalCode}, ce qui ne correspond pas au code postal du client de \${policyPeriod.PrimaryNamedInsured.AccountContactRole.AccountContact.Contact.PrimaryAddress.PostalCode}", "fr_FR")

        .withShortDescParam("Code postal du garage incohérent", "fr_CA")
        .withLongDescParam("Le véhicule \${paVehicle} est au garage à l'emplacement ayant le code postal \${paVehicle.GarageLocation.PostalCode}, ce qui ne correspond pas au code postal du client de \${policyPeriod.PrimaryNamedInsured.AccountContactRole.AccountContact.Contact.PrimaryAddress.PostalCode}", "fr_CA")

        .withShortDescParam("車庫の郵便番号が矛盾しています", "ja")
        .withLongDescParam("車両 \${paVehicle} は郵便番号 \${paVehicle.GarageLocation.PostalCode} の地域で保管されていますが、これは主たる被保険者の郵便番号 \${policyPeriod.PrimaryNamedInsured.AccountContactRole.AccountContact.Contact.PrimaryAddress.PostalCode} と一致しません", "ja")

        .withAvailableToRun(true)
        .create(bundle)

    DefaultBuilder
        .withCode("PAOtherVehicleType")
        .withDescription("PA: A vehicle has a type of \"Other\"")
        .withName("PA: Vehicle type of \"Other\"")
        .withPolicyLine(TC_PERSONALAUTOLINE)
        .withRuleContextDefinitionKey(TC_PAPOLICYVEHICLEITERATIVE)
        .withRuleCondition(new RuleConditionBuilder()
            .addRuleConditionLine("paVehicle.VehicleType", TC_EQUALS, ExpressionFragmentBuilders.forTypeKeyExpression(VehicleType.TC_OTHER))
        )
        .withIssueKeyParam("Vehicle:\${paVehicle.FixedId}")

        .withShortDescParam("Vehicle type: Other")
        .withLongDescParam("Vehicle \${paVehicle} has a vehicle type of \"Other\"")

        .withShortDescParam("Type de véhicule: Autre", "fr_FR")
        .withLongDescParam("Le véhicule \${paVehicle} a un type de véhicule \"Autre\"", "fr_FR")

        .withShortDescParam("Type de véhicule: Autre", "fr_CA")
        .withLongDescParam("Le véhicule \${paVehicle} a un type de véhicule \"Autre\"", "fr_CA")

        .withShortDescParam("車両の種類： その他", "ja")
        .withLongDescParam("車両 \${paVehicle} の種類が「その他」です", "ja")

        .withAvailableToRun(true)
        .create(bundle)

    DefaultBuilder
        .withCode("ChangedProducerOrg")
        .withDefaultDurationType(TC_NEXTCHANGE)
        .withDefaultEditBeforeBind(true)
        .withDescription("Raised when Producer Organization has been changed from previous value.")
        .withName("Producer Organization Changed")
        .withExternallyManaged(true)
        .create(bundle)

    DefaultBuilder
        .withCode("ChangedProducerCode")
        .withDefaultDurationType(TC_NEXTCHANGE)
        .withDefaultEditBeforeBind(true)
        .withDescription("Raised when Producer Code  has been changed from previous value.")
        .withName("Producer Code Changed")
        .withExternallyManaged(true)
        .create(bundle)

    DefaultBuilder
        .withCode("PAOtherVehicleTypeNonMotorcycle")
        .withDescription("PA: A vehicle has a type of \"Other\" and a body type other than \"Motorcycle\"")
        .withName("PA: Vehicle type of \"Other\" and not \"Motorcycle\"")
        .withRuleContextDefinitionKey(TC_PAPOLICYVEHICLEITERATIVE)
        .withPolicyLine(TC_PERSONALAUTOLINE)
        .withRuleCondition(new RuleConditionBuilder()
            .withRuleConditionType(TC_ALLAND)
            .addRuleConditionLine("paVehicle.VehicleType", TC_EQUALS, ExpressionFragmentBuilders.forTypeKeyExpression(VehicleType.TC_OTHER))
            .addRuleConditionLine("paVehicle.BodyType", TC_NOTEQUALS, ExpressionFragmentBuilders.forTypeKeyExpression(BodyType.TC_MOTORCYCLE))
        )
        .withIssueKeyParam("Vehicle:\${paVehicle.FixedId}")

        .withShortDescParam("Special-use vehicle")
        .withLongDescParam("Vehicle \${paVehicle} has a vehicle type of \"Other\" and is not a motorcycle")

        .withShortDescParam("Véhicule à utilisation spéciale", "fr_FR")
        .withLongDescParam("Le véhicule \${paVehicle} a un type de véhicule \"Autre\" et n'est pas une motocyclette", "fr_FR")

        .withShortDescParam("Véhicule à utilisation spéciale", "fr_CA")
        .withLongDescParam("Le véhicule \${paVehicle} a un type de véhicule \"Autre\" et n'est pas une motocyclette", "fr_CA")

        .withShortDescParam("特別用途車両", "ja")
        .withLongDescParam("車両 \${paVehicle} の種類は「その他」で、オートバイではありません", "ja")

        .withAvailableToRun(true)
        .create(bundle)

    DefaultBuilder
        .withBlockingPoint(TC_BLOCKSQUOTE)
        .withCode("PAVINStartsWithFRE")
        .withDefaultApprovalBlockingPoint(TC_BLOCKSBIND)
        .withDefaultDurationType(TC_NEXTCHANGE)
        .withDefaultEditBeforeBind(true)
        .withDescription("PA: The vehicle's VIN number beings with FRE")
        .withName("PA: Vehicle VIN beings with FRE")
        .withPolicyLine(TC_PERSONALAUTOLINE)
        .withRuleContextDefinitionKey(TC_PAPOLICYVEHICLEITERATIVE)
        .withRuleCondition(new RuleConditionBuilder()
            .withRuleConditionType(TC_ALLAND)
            .addHasValueRuleConditionLine("paVehicle.Vin", TC_HASAVALUE)
            .addTrueFalseRuleConditionLine("paVehicle.Vin.startsWith(\"FRE\")", TC_ISTRUE))
        .withIssueKeyParam("Vehicle:\${paVehicle.FixedId}", template)

        .withShortDescParam("Vehicle requires FRE approval")
        .withLongDescParam("Vehicle with VIN number \${paVehicle.Vin}")

        .withShortDescParam("Le véhicule nécessite l'approbation FRE", "fr_FR")
        .withLongDescParam("Véhicule ayant le numéro d'identification de véhicule \${paVehicle.Vin}", "fr_FR")

        .withShortDescParam("Le véhicule nécessite l'approbation FRE", "fr_CA")
        .withLongDescParam("Véhicule ayant le numéro d'identification de véhicule \${paVehicle.Vin}", "fr_CA")

        .withShortDescParam("車両には FRE 承認が必要です", "ja")
        .withLongDescParam("車台番号 \${paVehicle.Vin} の車両", "ja")

        .withAvailableToRun(true)
        .create(bundle)

    DefaultBuilder
        .withCode("PAHighValueAuto")
        .withComparator(TC_MONETARY_LE)
        .withDefaultDurationType(TC_NEXTCHANGE)
        .withDefaultEditBeforeBind(true)
        .withDefaultValueAssignmentType(TC_OFFSETPERCENT)
        .withDefaultValueOffsetAmount(10)
        .withDescription("PA: High value vehicle")
        .withName("PA: High value vehicle")
        .withValueFormatter(TC_MONETARYAMOUNT)
        .withRuleContextDefinitionKey(TC_PAPOLICYVEHICLEITERATIVE)
        .withPolicyLine(TC_PERSONALAUTOLINE)
        .withRuleCondition(new RuleConditionBuilder()
            .addRuleConditionLine("paVehicle.CostNew.Amount", TC_GREATERTHAN, "100000")
        )
        .withIssueKeyParam("Vehicle:\${paVehicle.FixedId}")

        .withShortDescParam("High-value vehicle")
        .withLongDescParam("Vehicle \${paVehicle} has a stated value of \${util.renderAsCurrency(paVehicle.CostNew)}")

        .withShortDescParam("Véhicule de grande valeur", "fr_FR")
        .withLongDescParam("Le véhicule \${paVehicle} a une valeur déclarée de \${util.renderAsCurrency(paVehicle.CostNew)}", "fr_FR")

        .withShortDescParam("Véhicule de grande valeur", "fr_CA")
        .withLongDescParam("Le véhicule \${paVehicle} a une valeur déclarée de \${util.renderAsCurrency(paVehicle.CostNew)}", "fr_CA")

        .withShortDescParam("高額車両", "ja")
        .withLongDescParam("車両 \${paVehicle} の表示価格は \${util.renderAsCurrency(paVehicle.CostNew)} です", "ja")

        .withValueParam("\${paVehicle.CostNew}")
        .withAvailableToRun(true)
        .create(bundle)

    DefaultBuilder
        .withBlockingPoint(TC_NONBLOCKING)
        .withCode("PADriverUnder25")
        .withComparator(TC_NUMERIC_GE)
        .withDefaultDurationType(TC_ONEYEAR)
        .withDefaultValueAssignmentType(TC_FIXED)
        .withDescription("PA: Driver under 25 years of age")
        .withName("PA: Driver under 25")
        .withValueFormatter(TC_INTEGER)
        .withRuleContextDefinitionKey(TC_PAPOLICYDRIVERITERATIVE)
        .withPolicyLine(TC_PERSONALAUTOLINE)
        .withRuleCondition(new RuleConditionBuilder()
            .withRuleConditionType(TC_ALLAND)
            .addTrueFalseRuleConditionLine("paDriver.Excluded", TC_ISFALSE)
            .addHasValueRuleConditionLine("paDriver.DateOfBirth", TC_HASAVALUE)
            .addRuleConditionLine("paDriver.Age", TC_LESSTHAN, "25")
        )
        .withIssueKeyParam("Driver:\${paDriver.FixedId}")

        .withShortDescParam("Driver under 25")
        .withLongDescParam("\${paDriver}'s age is \${paDriver.Age}")

        .withShortDescParam("Conducteur de moins de 25 ans", "fr_FR")
        .withLongDescParam("L'âge de \${paDriver} est \${paDriver.Age}", "fr_FR")

        .withShortDescParam("Conducteur de moins de 25 ans", "fr_CA")
        .withLongDescParam("L'âge de \${paDriver} est \${paDriver.Age}", "fr_CA")

        .withShortDescParam("運転者が 25 歳未満", "ja")
        .withLongDescParam("\${paDriver} 様の年齢は \${paDriver.Age} 歳です", "ja")

        .withValueParam("\${paDriver.Age}")
        .withAvailableToRun(true)
        .create(bundle)

    DefaultBuilder
        .withCode("PAPrimaryDriverUnder25")
        .withComparator(TC_NUMERIC_GE)
        .withDefaultDurationType(TC_ENDOFTERM)
        .withDefaultEditBeforeBind(true)
        .withDefaultValueAssignmentType(TC_FIXED)
        .withDescription("PA: Primary driver under 25 years of age")
        .withName("PA: Primary driver under 25")
        .withValueFormatter(TC_INTEGER)
        .withRuleContextDefinitionKey(TC_PAPOLICYVEHICLEITERATIVE)
        .withPolicyLine(TC_PERSONALAUTOLINE)
        .withRuleCondition(new RuleConditionBuilder()
            .withRuleConditionType(TC_ALLAND)
            .addHasValueRuleConditionLine("paVehicle.PrimaryDriver.PolicyDriver.DateOfBirth", TC_HASAVALUE)
            .addRuleConditionLine("paVehicle.PrimaryDriver.PolicyDriver.Age", TC_LESSTHAN, "25")
        )
        .withIssueKeyParam("Driver:\${paVehicle.PrimaryDriver.PolicyDriver.FixedId}")

        .withShortDescParam("Primary Driver under 25")
        .withLongDescParam("\${paVehicle.PrimaryDriver.PolicyDriver}'s age is \${paVehicle.PrimaryDriver.PolicyDriver.Age}")

        .withShortDescParam("Le conducteur principal a moins de 25 ans", "fr_FR")
        .withLongDescParam("L'âge de \${paVehicle.PrimaryDriver.PolicyDriver} est \${paVehicle.PrimaryDriver.PolicyDriver.Age}", "fr_FR")

        .withShortDescParam("Le conducteur principal a moins de 25 ans", "fr_CA")
        .withLongDescParam("L'âge de \${paVehicle.PrimaryDriver.PolicyDriver} est \${paVehicle.PrimaryDriver.PolicyDriver.Age}", "fr_CA")

        .withShortDescParam("主な運転者が 25 歳未満", "ja")
        .withLongDescParam("\${paVehicle.PrimaryDriver.PolicyDriver} 様の年齢は \${paVehicle.PrimaryDriver.PolicyDriver.Age} 歳です", "ja")

        .withValueParam("\${paVehicle.PrimaryDriver.PolicyDriver.Age}")
        .withAvailableToRun(true)
        .create(bundle)

    DefaultBuilder
        .withAutoApprovable(true)
        .withBlockingPoint(TC_BLOCKSQUOTERELEASE)
        .withTriggeringPointKey(TC_PREQUOTERELEASE)
        .withCode("PATotalPremium")
        .withComparator(TC_MONETARY_LE)
        .withDefaultValueAssignmentType(TC_OFFSETAMOUNT)
        .withDefaultValueOffsetAmount(5)
        .withDefaultValueOffsetCurrency(TC_USD)
        .withDescription("PA: Total premium")
        .withName("PA: Total premium")
        .withValueFormatter(TC_MONETARYAMOUNT)
        .withRuleContextDefinitionKey(TC_PAPOLICY)
        .withPolicyLine(TC_PERSONALAUTOLINE)
        .withRuleCondition(new RuleConditionBuilder().withRuleConditionType(TC_ALWAYSTRUE))
        .withIssueKeyParam("PATotalPremium")

        .withShortDescParam("Total premium over authority")
        .withLongDescParam("Premium of \${util.renderAsCurrency(policyPeriod.TotalPremiumRPT)} is over authority")

        .withShortDescParam("La prime totale dépasse l'habilitation", "fr_FR")
        .withLongDescParam("La prime de \${util.renderAsCurrency(policyPeriod.TotalPremiumRPT)} dépasse l'habilitation", "fr_FR")

        .withShortDescParam("La prime totale dépasse l'habilitation", "fr_CA")
        .withLongDescParam("La prime de \${util.renderAsCurrency(policyPeriod.TotalPremiumRPT)} dépasse l'habilitation", "fr_CA")

        .withShortDescParam("合計保険料が権限を超えています", "ja")
        .withLongDescParam("\${util.renderAsCurrency(policyPeriod.TotalPremiumRPT)} の保険料は権限を超えています", "ja")

        .withValueParam("\${policyPeriod.TotalPremiumRPT}")
        .withAvailableToRun(true)
        .create(bundle)

    DefaultBuilder
        .withAutoApprovable(true)
        .withCode("PACompDeductible")
        .withComparator(TC_MONETARY_GE)
        .withDefaultDurationType(TC_ENDOFTERM)
        .withDefaultValueAssignmentType(TC_FIXED)
        .withDescription("PA: Comprehensive deductible")
        .withName("PA: Comprehensive deductible")
        .withValueFormatter(TC_MONETARYAMOUNT)
        .withRuleContextDefinitionKey(TC_PAPOLICYVEHICLEITERATIVE)
        .withPolicyLine(TC_PERSONALAUTOLINE)
        .withRuleCondition(new RuleConditionBuilder()
            .addHasValueRuleConditionLine("paVehicle.PAComprehensiveCov.PACompDeductibleTerm.OptionValue.Value", TC_HASAVALUE)
        )
        .withIssueKeyParam("Vehicle:\${paVehicle.FixedId}")

        .withShortDescParam("Cov terms outside authority")
        .withLongDescParam("Vehicle \${paVehicle} has a comprehensive deductible of \${util.renderAsCurrency(paVehicle.PAComprehensiveCov.PACompDeductibleTerm.OptionValue.Value, paVehicle.PAComprehensiveCov.Currency)}")

        .withShortDescParam("Conditions de garantie hors habilitation", "fr_FR")
        .withLongDescParam("Le véhicule \${paVehicle} a une franchise complète de \${util.renderAsCurrency(paVehicle.PAComprehensiveCov.PACompDeductibleTerm.OptionValue.Value, paVehicle.PAComprehensiveCov.Currency)}", "fr_FR")

        .withShortDescParam("Conditions de garantie hors habilitation", "fr_CA")
        .withLongDescParam("Le véhicule \${paVehicle} a une franchise complète de \${util.renderAsCurrency(paVehicle.PAComprehensiveCov.PACompDeductibleTerm.OptionValue.Value, paVehicle.PAComprehensiveCov.Currency)}", "fr_CA")

        .withShortDescParam("権限外の補償期間", "ja")
        .withLongDescParam("車両 \${paVehicle} の包括免責額は \${util.renderAsCurrency(paVehicle.PAComprehensiveCov.PACompDeductibleTerm.OptionValue.Value, paVehicle.PAComprehensiveCov.Currency)} です", "ja")

        .withValueParam("\${util.monetaryAmount(paVehicle.PAComprehensiveCov.PACompDeductibleTerm.OptionValue.Value, paVehicle.PAComprehensiveCov.Currency)}")
        .withAvailableToRun(true)
        .create(bundle)

    DefaultBuilder
        .withAutoApprovable(true)
        .withCode("PACollisionDeductible")
        .withComparator(TC_MONETARY_GE)
        .withDefaultDurationType(TC_NEXTCHANGE)
        .withDefaultValueAssignmentType(TC_FIXED)
        .withDescription("PA: Collision deductible")
        .withName("PA: Collision deductible")
        .withValueFormatter(TC_MONETARYAMOUNT)
        .withRuleContextDefinitionKey(TC_PAPOLICYVEHICLEITERATIVE)
        .withPolicyLine(TC_PERSONALAUTOLINE)
        .withRuleCondition(new RuleConditionBuilder()
            .addHasValueRuleConditionLine("paVehicle.PACollisionCov.PACollDeductibleTerm.OptionValue.Value", TC_HASAVALUE)
        )
        .withIssueKeyParam("Vehicle:\${paVehicle.FixedId}")

        .withShortDescParam("Cov terms outside authority")
        .withLongDescParam("Vehicle \${paVehicle} has a collision deductible of \${util.renderAsCurrency(paVehicle.PACollisionCov.PACollDeductibleTerm.OptionValue.Value, paVehicle.PACollisionCov.Currency)}")

        .withShortDescParam("Conditions de garantie hors habilitation", "fr_FR")
        .withLongDescParam("Le véhicule \${paVehicle} a une franchise de collision de \${util.renderAsCurrency(paVehicle.PACollisionCov.PACollDeductibleTerm.OptionValue.Value, paVehicle.PACollisionCov.Currency)}", "fr_FR")

        .withShortDescParam("Conditions de garantie hors habilitation", "fr_CA")
        .withLongDescParam("Le véhicule \${paVehicle} a une franchise de collision de \${util.renderAsCurrency(paVehicle.PACollisionCov.PACollDeductibleTerm.OptionValue.Value, paVehicle.PACollisionCov.Currency)}", "fr_CA")

        .withShortDescParam("権限外の補償期間", "ja")
        .withLongDescParam("車両 \${paVehicle} の衝突免責額は \${util.renderAsCurrency(paVehicle.PACollisionCov.PACollDeductibleTerm.OptionValue.Value, paVehicle.PACollisionCov.Currency)} です", "ja")

        .withValueParam("\${util.monetaryAmount(paVehicle.PACollisionCov.PACollDeductibleTerm.OptionValue.Value, paVehicle.PACollisionCov.Currency)}")
        .withAvailableToRun(true)
        .create(bundle)

    DefaultBuilder
        .withBlockingPoint(TC_NONBLOCKING)
        .withCode("PAUnappliedGoodDriverDiscount")
        .withDefaultDurationType(TC_NEXTCHANGE)
        .withDefaultEditBeforeBind(true)
        .withDescription("PA: Driver qualified for good driver discount, but not applied")
        .withName("PA: Unapplied good driver discount")
        .withRuleContextDefinitionKey(TC_PAPOLICYDRIVERITERATIVE)
        .withPolicyLine(TC_PERSONALAUTOLINE)
        .withRuleCondition(new RuleConditionBuilder()
            .withRuleConditionType(TC_ALLAND)
            .addTrueFalseRuleConditionLine("paDriver.ApplicableGoodDriverDiscount", TC_ISFALSE)
            .addTrueFalseRuleConditionLine("util.hasGoodDriverDiscount(paDriver)", TC_ISTRUE)
            .addTrueFalseRuleConditionLine("paDriver.Excluded", TC_ISFALSE)
        )
        .withIssueKeyParam("Driver:\${paDriver.FixedId}")

        .withShortDescParam("Good Driver discount not applied")
        .withLongDescParam("Good driver discount for \${paDriver.FirstName} \${paDriver.LastName} applicable, but not applied")

        .withShortDescParam("Remise de bon conducteur non appliquée", "fr_FR")
        .withLongDescParam("Remise de bon conducteur pour \${paDriver.FirstName} \${paDriver.LastName} applicable, mais non appliquée", "fr_FR")

        .withShortDescParam("Remise de bon conducteur non appliquée", "fr_CA")
        .withLongDescParam("Remise de bon conducteur pour \${paDriver.FirstName} \${paDriver.LastName} applicable, mais non appliquée", "fr_CA")

        .withShortDescParam("優良運転者割引が適用されていません", "ja")
        .withLongDescParam("\${paDriver.FirstName} \${paDriver.LastName} には優良運転者割引が適用可能ですが、適用されていません", "ja")

        .withAvailableToRun(true)
        .create(bundle)

    DefaultBuilder
        .withBlockingPoint(TC_BLOCKSISSUANCE)
        .withCode("PAGoodDriverDiscountEvidence")
        .withDefaultDurationType(TC_THREEYEARS)
        .withDescription("PA: Good driver discount requires evidence of qualification")
        .withName("PA: Good driver discount documentation")
        .withRuleContextDefinitionKey(TC_PAPOLICYDRIVERITERATIVE)
        .withPolicyLine(TC_PERSONALAUTOLINE)
        .withRuleCondition(new RuleConditionBuilder()
            .withRuleConditionType(TC_ALLAND)
            .addTrueFalseRuleConditionLine("paDriver.ApplicableGoodDriverDiscount", TC_ISTRUE)
            .addTrueFalseRuleConditionLine("paDriver.Excluded", TC_ISFALSE)
        )
        .withIssueKeyParam("Driver:\${paDriver.FixedId}")

        .withShortDescParam("Good Driver documentation needed")
        .withLongDescParam("Policy driver \${paDriver.FirstName} \${paDriver.LastName} needs Good Driver documentation")

        .withShortDescParam("Documents de bon conducteur requis", "fr_FR")
        .withLongDescParam("Le conducteur du contrat \${paDriver.FirstName} \${paDriver.LastName} doit fournir des documents de bon conducteur", "fr_FR")

        .withShortDescParam("Documents de bon conducteur requis", "fr_CA")
        .withLongDescParam("Le conducteur du contrat \${paDriver.FirstName} \${paDriver.LastName} doit fournir des documents de bon conducteur", "fr_CA")

        .withShortDescParam("優良運転者証が必要です", "ja")
        .withLongDescParam("保険契約の運転者 \${paDriver.FirstName} \${paDriver.LastName} には優良運転者証が必要です", "ja")

        .withAvailableToRun(true)
        .create(bundle)

    DefaultBuilder
        .withAutoApprovable(true)
        .withBlockingPoint(TC_BLOCKSQUOTERELEASE)
        .withCode("PAGarageState")
        .withComparator(TC_STATE_SET)
        .withDefaultDurationType(TC_THREEYEARS)
        .withDescription("PA: Garage states")
        .withName("PA: Garage states")
        .withValueFormatter(TC_STATESET)
        .withRuleContextDefinitionKey(TC_PAPOLICYVEHICLEITERATIVE)
        .withPolicyLine(TC_PERSONALAUTOLINE)
        .withRuleCondition(new RuleConditionBuilder().withRuleConditionType(TC_ALWAYSTRUE))
        .withIssueKeyParam("Vehicle:\${paVehicle.FixedId}")

        .withShortDescParam("State of garaging")
        .withLongDescParam("Vehicle \${paVehicle} garaged in \${paVehicle.AccountLocation.State}")

        .withShortDescParam("État de garage", "fr_FR")
        .withLongDescParam("Le véhicule \${paVehicle} est au garage dans \${paVehicle.AccountLocation.State}", "fr_FR")

        .withShortDescParam("État de garage", "fr_CA")
        .withLongDescParam("Le véhicule \${paVehicle} est au garage dans \${paVehicle.AccountLocation.State}", "fr_CA")

        .withShortDescParam("車庫", "ja")
        .withLongDescParam("車両 \${paVehicle} は \${paVehicle.AccountLocation.State} で保管されています", "ja")

        .withValueParam("\${paVehicle.AccountLocation.State.Code}")
        .withAvailableToRun(true)
        .create(bundle)


    DefaultBuilder
        .withBlockingPoint(TC_BLOCKSQUOTERELEASE)
        .withTriggeringPointKey(TC_MANUAL)
        .withCode("UW1ReviewBlocksQuoteRelease")
        .withDescription("To be reviewed by underwriter 1, blocking quote release")
        .withName("To be reviewed by underwriter 1, blocking quote release")
        .withExternallyManaged(true)
        .create(bundle)

    DefaultBuilder
        .withBlockingPoint(TC_BLOCKSQUOTERELEASE)
        .withTriggeringPointKey(TC_MANUAL)
        .withCode("UW2ReviewBlocksQuoteRelease")
        .withDescription("To be reviewed by underwriter 2, blocking quote release")
        .withName("To be reviewed by underwriter 2, blocking quote release")
        .withExternallyManaged(true)
        .create(bundle)

    DefaultBuilder
        .withBlockingPoint(TC_BLOCKSQUOTERELEASE)
        .withTriggeringPointKey(TC_MANUAL)
        .withCode("UWManagerReviewBlocksQuoteRelease")
        .withDescription("To be reviewed by underwriting manager, blocking quote release")
        .withName("To be reviewed by underwriting manager, blocking quote release")
        .withExternallyManaged(true)
        .create(bundle)

    DefaultBuilder
        .withAutoApprovable(true)
        .withTriggeringPointKey(TC_RENEWAL)
        .withCode("ClaimTotalIncurred")
        .withComparator(TC_MONETARY_LE)
        .withDefaultValueAssignmentType(TC_FIXED)
        .withDescription("Highest cost claim")
        .withName("Claim total incurred")
        .withValueFormatter(TC_MONETARYAMOUNT)
        .withExternallyManaged(true)
        .create(bundle)

    DefaultBuilder
        .withAutoApprovable(true)
        .withTriggeringPointKey(TC_RENEWAL)
        .withCode("RatioOfClaimsTotalIncurredToWrittenPremium")
        .withComparator(TC_NUMERIC_LE)
        .withDefaultValueAssignmentType(TC_FIXED)
        .withDescription("Ratio of claims total incurred to policy written premium")
        .withName("Ratio of claims total incurred to policy written premium")
        .withValueFormatter(TC_NUMBER)
        .withExternallyManaged(true)
        .create(bundle)

    DefaultBuilder
        .withAutoApprovable(true)
        .withTriggeringPointKey(TC_RENEWAL)
        .withCode("IncidenceOfClaims")
        .withComparator(TC_NUMERIC_LE)
        .withDefaultValueAssignmentType(TC_FIXED)
        .withDescription("Incidence of claims")
        .withName("Incidence of claims")
        .withValueFormatter(TC_NUMBER)
        .withExternallyManaged(true)
        .create(bundle)

    DefaultBuilder
        .withTriggeringPointKey(TC_RENEWAL)
        .withCode("ManualClaimReviewNeeded")
        .withDescription("Too many claims found for automated retrieve")
        .withName("Manual claim review needed")
        .withExternallyManaged(true)
        .create(bundle)

    DefaultBuilder
        .withTriggeringPointKey(TC_RENEWAL)
        .withCode("UnableRetrieveClaimInfo")
        .withDescription("Unable to retrieve claims information")
        .withName("Unable to retrieve claims information")
        .withExternallyManaged(true)
        .create(bundle)

    DefaultBuilder
        .withCode("RewritePeriodDates")
        .withDefaultDurationType(TC_NEXTCHANGE)
        .withDescription("The rewrite period's dates don't match the dates of the based-on period")
        .withName("Rewrite changes period dates")
        .withExternallyManaged(true)
        .create(bundle)

    DefaultBuilder
        .withBlockingPoint(TC_NONBLOCKING)
        .withTriggeringPointKey(TC_REFERRAL)
        .withCode("ReferralNonBlocking")
        .withDescription("Non-blocking issue generated from UW referral reason")
        .withName("Non-blocking referral")
        .withExternallyManaged(true)
        .create(bundle)

    DefaultBuilder
        .withBlockingPoint(TC_BLOCKSQUOTERELEASE)
        .withTriggeringPointKey(TC_REFERRAL)
        .withCode("ReferralBlockingQuote")
        .withDescription("Issue blocking quote generated from UW referral reason")
        .withName("Quote referral")
        .withExternallyManaged(true)
        .create(bundle)

    DefaultBuilder
        .withTriggeringPointKey(TC_REFERRAL)
        .withCode("ReferralBlockingBind")
        .withDescription("Issue blocking bind generated from UW referral reason")
        .withName("Bind referral")
        .withExternallyManaged(true)
        .create(bundle)

    DefaultBuilder
        .withTriggeringPointKey(TC_MANUAL)
        .withCode("UW1ReviewBlocksBind")
        .withDescription("To be reviewed by underwriter 1, blocking bind")
        .withName("To be reviewed by underwriter 1, blocking bind")
        .withExternallyManaged(true)
        .create(bundle)

    DefaultBuilder
        .withBlockingPoint(TC_BLOCKSISSUANCE)
        .withTriggeringPointKey(TC_MANUAL)
        .withCode("UW1ReviewBlocksIssuance")
        .withDescription("To be reviewed by underwriter 1, blocking issuance")
        .withName("To be reviewed by underwriter 1, blocking issuance")
        .withExternallyManaged(true)
        .create(bundle)

    DefaultBuilder
        .withTriggeringPointKey(TC_MANUAL)
        .withCode("UW2ReviewBlocksBind")
        .withDescription("To be reviewed by underwriter 2, blocking bind")
        .withName("To be reviewed by underwriter 2, blocking bind")
        .withExternallyManaged(true)
        .create(bundle)

    DefaultBuilder
        .withBlockingPoint(TC_BLOCKSISSUANCE)
        .withTriggeringPointKey(TC_MANUAL)
        .withCode("UW2ReviewBlocksIssuance")
        .withDescription("To be reviewed by underwriter 2, blocking issuance")
        .withName("To be reviewed by underwriter 2, blocking issuance")
        .withExternallyManaged(true)
        .create(bundle)

    DefaultBuilder
        .withTriggeringPointKey(TC_MANUAL)
        .withCode("UWManagerReviewBlocksBind")
        .withDescription("To be reviewed by underwriting manager, blocking bind")
        .withName("To be reviewed by underwriting manager, blocking bind")
        .withExternallyManaged(true)
        .create(bundle)

    DefaultBuilder
        .withBlockingPoint(TC_BLOCKSISSUANCE)
        .withTriggeringPointKey(TC_MANUAL)
        .withCode("UWManagerReviewBlocksIssuance")
        .withDescription("To be reviewed by underwriting manager, blocking issuance")
        .withName("To be reviewed by underwriting manager, blocking issuance")
        .withExternallyManaged(true)
        .create(bundle)

    DefaultBuilder
        .withBlockingPoint(TC_BLOCKSQUOTE)
        .withTriggeringPointKey(TC_QUESTION)
        .withCode("QuestionBlockingQuote")
        .withDescription("Automatically generated based on question answer, blocking pre-quote")
        .withName("Question blocking quote")
        .withExternallyManaged(true)
        .create(bundle)

    DefaultBuilder
        .withTriggeringPointKey(TC_QUESTION)
        .withCode("QuestionBlockingBind")
        .withDescription("Automatically generated based on question answer, blocking pre-bind")
        .withName("Question blocking bind")
        .withExternallyManaged(true)
        .create(bundle)

    DefaultBuilder
        .withBlockingPoint(TC_NONBLOCKING)
        .withTriggeringPointKey(TC_QUESTION)
        .withCode("QuestionNonBlocking")
        .withDescription("Automatically generated based on question answer, merely informational")
        .withName("Question non-blocking")
        .withExternallyManaged(true)
        .create(bundle)

    DefaultBuilder
        .withBlockingPoint(TC_BLOCKSQUOTE)
        .withTriggeringPointKey(TC_QUESTION)
        .withCode("QuestionNumberBlockingQuote")
        .withComparator(TC_NUMERIC_LE)
        .withDefaultValueAssignmentType(TC_FIXED)
        .withDescription("Automatically generated based on question answer that includes a number, blocking pre-quote")
        .withName("Question with number blocking quote")
        .withValueFormatter(TC_INTEGER)
        .withExternallyManaged(true)
        .create(bundle)

    DefaultBuilder
        .withTriggeringPointKey(TC_QUESTION)
        .withCode("QuestionNumberBlockingBind")
        .withComparator(TC_NUMERIC_LE)
        .withDefaultValueAssignmentType(TC_FIXED)
        .withDescription("Automatically generated based on question answer that includes a number, blocking pre-bind")
        .withName("Question with number blocking bind")
        .withValueFormatter(TC_INTEGER)
        .withExternallyManaged(true)
        .create(bundle)

    DefaultBuilder
        .withBlockingPoint(TC_NONBLOCKING)
        .withTriggeringPointKey(TC_QUESTION)
        .withCode("QuestionNumberNonBlocking")
        .withComparator(TC_NUMERIC_LE)
        .withDefaultValueAssignmentType(TC_FIXED)
        .withDescription("Automatically generated based on question answer that includes a number, merely informational")
        .withName("Question with number non-blocking")
        .withValueFormatter(TC_INTEGER)
        .withExternallyManaged(true)
        .create(bundle)

    DefaultBuilder
        .withBlockingPoint(TC_BLOCKSQUOTE)
        .withCode("PreQualQuestionRiskPointSum")
        .withComparator(TC_NUMERIC_LE)
        .withDefaultValueAssignmentType(TC_FIXED)
        .withDescription("Sum of pre-qual question risk points")
        .withName("Sum of pre-qual risk points")
        .withValueFormatter(TC_INTEGER)
        .withExternallyManaged(true)
        .create(bundle)

    DefaultBuilder
        .withBlockingPoint(TC_BLOCKSQUOTERELEASE)
        .withTriggeringPointKey(TC_PREQUOTERELEASE)
        .withCode("QuoteHasManualOverrides")
        .withDefaultDurationType(TC_NEXTCHANGE)
        .withDescription("Quote has one or more manual overrides")
        .withName("Quote Has Manual Overrides")
        .withExternallyManaged(true)
        .create(bundle)

    DefaultBuilder
        .withTriggeringPointKey(TC_REFERRAL)
        .withCode("ReferralNumberBlockingBind")
        .withComparator(TC_NUMERIC_LE)
        .withDefaultValueAssignmentType(TC_FIXED)
        .withDescription("Issue with a numeric value blocking bind generated from UW referral reason")
        .withName("Referral with number blocking bind")
        .withExternallyManaged(true)
        .create(bundle)

    DefaultBuilder
        .withTriggeringPointKey(TC_UPGRADE)
        .withCode("LegacyPolicyEvalIssue")
        .withDescription("Issue that was automatically generated at upgrade time from an existing, open policy UW issue")
        .withName("Converted policy UW issue")
        .withExternallyManaged(true)
        .create(bundle)

    DefaultBuilder
        .withBlockingPoint(TC_NONBLOCKING)
        .withTriggeringPointKey(TC_UPGRADE)
        .withCode("LegacyPolicyEvalIssueClosed")
        .withDescription("Issue that was automatically converted at upgrade time based on a closed policy UW issue")
        .withName("Closed converted policy UW issue")
        .withExternallyManaged(true)
        .create(bundle)

    DefaultBuilder
        .withTriggeringPointKey(TC_REFERRAL)
        .withCode("LegacyReferralReason")
        .withDescription("Issue arising from a referral reason that was converted from an existing referral reason")
        .withName("Converted referral reason")
        .withExternallyManaged(true)
        .create(bundle)

    DefaultBuilder
        .withBlockingPoint(TC_BLOCKSQUOTE)
        .withCode("UWCompanySegmentValid")
        .withDefaultDurationType(TC_NEXTCHANGE)
        .withDescription("Underwriting Company Not Valid for Policy Segment")
        .withName("Underwriting Company Not Valid for Policy Segment")
        .withExternallyManaged(true)
        .create(bundle)

    DefaultBuilder
        .withBlockingPoint(TC_BLOCKSQUOTERELEASE)
        .withTriggeringPointKey(TC_REINSURANCE)
        .withCode("RINetRetention")
        .withComparator(TC_MONETARY_LE)
        .withDefaultValueAssignmentType(TC_FIXED)
        .withDescription("RI: Net retention greater than target max retention")
        .withName("RI: Net retention")
        .withValueFormatter(TC_MONETARYAMOUNT)
        .withExternallyManaged(true)
        .create(bundle)

    DefaultBuilder
        .withTriggeringPointKey(TC_UWHOLD)
        .withCode("UWPolicyHold")
        .withDescription("UW Policy Hold")
        .withName("UW Policy Hold")
        .withExternallyManaged(true)
        .create(bundle)

    DefaultBuilder
        .withBlockingPoint(TC_BLOCKSQUOTE)
        .withTriggeringPointKey(TC_REGULATORYHOLD)
        .withCode("RegulatoryPolicyHold")
        .withDescription("Regulatory Policy Hold")
        .withName("Regulatory Policy Hold")
        .withExternallyManaged(true)
        .create(bundle)

    DefaultBuilder
        .withBlockingPoint(TC_BLOCKSQUOTE)
        .withCode("PAExcludedDriver")
        .withDescription("PA: A driver is excluded from the policy")
        .withName("PA: Excluded driver")
        .withRuleContextDefinitionKey(TC_PAPOLICYDRIVERITERATIVE)
        .withPolicyLine(TC_PERSONALAUTOLINE)
        .withRuleCondition(new RuleConditionBuilder()
            .addTrueFalseRuleConditionLine("paDriver.Excluded", TC_ISTRUE))
        .withIssueKeyParam("Driver:\${paDriver.FixedId}")

        .withShortDescParam("Excluded Driver")
        .withLongDescParam("\${paDriver} is excluded from the policy")

        .withShortDescParam("Conducteur exclu", "fr_FR")
        .withLongDescParam("\${paDriver} est exclu de la police", "fr_FR")

        .withShortDescParam("Conducteur exclu", "fr_CA")
        .withLongDescParam("\${paDriver} est exclu de la police", "fr_CA")

        .withShortDescParam("除外された運転者", "ja")
        .withLongDescParam("\${paDriver} は保険契約から除外されています", "ja")

        .withAvailableToRun(true)
        .create(bundle)

    DefaultBuilder
        .withTriggeringPointKey(TC_MVR)
        .withCode("PAMVRAccidentsViolations")
        .withDefaultDurationType(TC_ENDOFTERM)
        .withDescription("PA: The accidents/violations on the policy are different than those on the MVR")
        .withName("PA: Accidents/violations do not match MVR")
        .withPolicyLine(TC_PERSONALAUTOLINE)
        .withExternallyManaged(true)
        .create(bundle)

    DefaultBuilder
        .withTriggeringPointKey(TC_POLICYRENEWALAPI)
        .withCode("PolicyRenewalAPIPolicyNumberCollision")
        .withDefaultEditBeforeBind(true)
        .withDescription("When importing this policy, the specified policy number was already in use in the system. It has been changed.")
        .withName("Imported PolicyNumber Conflicts")
        .withExternallyManaged(true)
        .create(bundle)

    DefaultBuilder
        .withBlockingPoint(TC_BLOCKSQUOTERELEASE)
        .withTriggeringPointKey(TC_REINSURANCE)
        .withCode("AgreementsHaveNoCededRisk")
        .withDefaultDurationType(TC_NEXTCHANGE)
        .withDescription("Some fixed-cost, facultative reinsurance agreements have no ceded risk")
        .withName("Some fixed-cost, facultative reinsurance agreements have no ceded risk")
        .withValueFormatter(TC_MONETARYAMOUNT)
        .withExternallyManaged(true)
        .create(bundle)

    DefaultBuilder
        .withBlockingPoint(TC_BLOCKSQUOTERELEASE)
        .withTriggeringPointKey(TC_REINSURANCE)
        .withCode("AgreementsDoNotCedeToCapacity")
        .withDefaultDurationType(TC_NEXTCHANGE)
        .withDescription("Some reinsurance agreements do not cede to capacity")
        .withName("Some reinsurance agreements do not cede to capacity")
        .withValueFormatter(TC_MONETARYAMOUNT)
        .withExternallyManaged(true)
        .create(bundle)

    DefaultBuilder
        .withAutoApprovable(true)
        .withBlockingPoint(UWIssueBlockingPoint.TC_NONBLOCKING)
        .withTriggeringPointKey(TC_PREBIND)
        .withCode("UpfrontPaymentRequired")
        .withComparator(ValueComparator.TC_MONETARY_LE)
        .withDefaultApprovalBlockingPoint(UWIssueBlockingPoint.TC_NONBLOCKING)
        .withDefaultDurationType(UWApprovalDurationType.TC_RESCINDED)
        .withDefaultValueAssignmentType(UWValueAssignmentType.TC_FIXED)
        .withDescription("Raises a warning if the down payment is not fully paid")
        .withShortDescParam("Down payment UW Issue")
        .withLongDescParam("The down payment is not fully paid. Expected payment \${policyPeriod.PaymentAmount}. Collected so far: \${policyPeriod.Job.AmountPaid}.")
        .withName("UpfrontPaymentRequired")
        .withValueFormatter(ValueFormatterType.TC_MONETARYAMOUNT)
        .withIssueKeyParam("DuePayment")
        .withValueParam("\${policyPeriod.PaymentAmount}")
        .withRuleCondition(new RuleConditionBuilder()
            .addTrueFalseRuleConditionLine("policyPeriod.InitialPaymentComplete", TC_ISFALSE))
        .withAvailableToRun(true)
        .create(bundle)
  }

  private static property get DefaultBuilder(): UWRuleBuilder {
    return new UWRuleBuilder()
        .withTriggeringPointKey(TC_PREQUOTE)
        .withRuleContextDefinitionKey(TC_GENERICPOLICY)
        .withBlockingPoint(TC_BLOCKSBIND)
        .withAutoApprovable(false)
        .withDefaultApprovalBlockingPoint(TC_NONBLOCKING)
        .withDefaultDurationType(TC_RESCINDED)
        .withDefaultEditBeforeBind(false)
        .withComparator(TC_NONE)
        .withValueFormatter(TC_UNFORMATTED)
        .withRuleCondition(new RuleConditionBuilder().withRuleConditionType(TC_ALWAYSTRUE))
        .withAvailableToRun(false)
  }
}
