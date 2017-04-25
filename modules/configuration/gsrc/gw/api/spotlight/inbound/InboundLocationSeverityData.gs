package gw.api.spotlight.inbound

uses com.fasterxml.jackson.annotation.JsonIgnoreProperties
uses gw.riskassessment.JacksonEnabledSerializable
uses gw.riskassessment.SpotlightConfigParameters

/**
 * InboundLocationSeverityData is the Pogo that corresponds to the json severity results data that is sent from
 * Spotlight Risk Assessment to Policy Center.
 * This Pogo is a child of InboundLocationResultData, and it stores the severity results of all the risk assessments
 * per location.
 */
@Export
class InboundLocationSeverityData implements JacksonEnabledSerializable {

  /**
   * Is either Unknown, Low, Medium, or High
   */
  public var severityCode: String
  public var name: String
  /**
   *  Is the number representation of the severity Code.  It is between 1-2
   */
  public var orderingRank: double

  @JsonIgnoreProperties
  public property get severityIcon() :  String {
    return SpotlightConfigParameters.severityCodeToIconMap.getOrDefault(severityCode, "icon_risk_level_gray.png")
  }

}