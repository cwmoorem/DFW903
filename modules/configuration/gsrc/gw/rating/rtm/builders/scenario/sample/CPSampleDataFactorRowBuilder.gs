package gw.rating.rtm.builders.scenario.sample

uses gw.rating.rtm.builders.AbstractFactorRowBuilder
uses gw.rating.rtm.builders.RateFactorRowBuilder
uses java.lang.IllegalArgumentException
uses java.lang.Integer
uses java.math.BigDecimal
uses java.math.MathContext
uses java.util.ArrayList
uses java.util.Date
uses java.util.Map
uses java.util.List
uses gw.api.upgrade.Coercions

@Export
class CPSampleDataFactorRowBuilder {

  public final static var BASE_RATE_TABLE : List<Object[]> = {
   // CovCode, CauseOfLoss, DeductFactorName, Base Rate
    { "CPBldgCov", "Basic", "cpDeductBroad", 0.0 },
    { "CPBldgCov", "Basic", "cpDeductGrp1",  0.12 },
    { "CPBldgCov", "Basic", "cpDeductGrp2",  0.08 },
    { "CPBldgCov", "Basic", "cpDeductSpecial", 0.0 },
    { "CPBldgCov", "Broad", "cpDeductBroad", 0.08 },
    { "CPBldgCov", "Broad", "cpDeductGrp1",  0.12 },
    { "CPBldgCov", "Broad", "cpDeductGrp2",  0.08 },
    { "CPBldgCov", "Broad", "cpDeductSpecial", 0.0 },
    { "CPBldgCov", "Special", "cpDeductBroad", 0.08 },
    { "CPBldgCov", "Special", "cpDeductGrp1",  0.12 },
    { "CPBldgCov", "Special", "cpDeductGrp2",  0.08 },
    { "CPBldgCov", "Special", "cpDeductSpecial", 0.08 },
    { "CPBPPCov", "Basic", "cpDeductBroad", 0.0 },
    { "CPBPPCov", "Basic", "cpDeductGrp1",  0.15 },
    { "CPBPPCov", "Basic", "cpDeductGrp2",  0.15 },
    { "CPBPPCov", "Basic", "cpDeductSpecial", 0.0 },
    { "CPBPPCov", "Broad", "cpDeductBroad", 0.08 },
    { "CPBPPCov", "Broad", "cpDeductGrp1",  0.15 },
    { "CPBPPCov", "Broad", "cpDeductGrp2",  0.15 },
    { "CPBPPCov", "Broad", "cpDeductSpecial", 0.0 },
    { "CPBPPCov", "Special", "cpDeductBroad", 0.08 },
    { "CPBPPCov", "Special", "cpDeductGrp1",  0.15 },
    { "CPBPPCov", "Special", "cpDeductGrp2",  0.15 },
    { "CPBPPCov", "Special", "cpDeductSpecial", 0.08 }
  }
  
  public final static var DEDUCT_TABLE : List<Object[]> = {
    // FactorName, DeductValue, MinLimitValue, MaxLimitValue, State, Factor
    { "cpDeductGrp1", "500", 250000, 100000000, null, 0.99 },
    { "cpDeductGrp1", "500", 100000, 250000, null, 0.99 },
    { "cpDeductGrp1", "500", 50000, 100000, null, 0.98 },
    { "cpDeductGrp1", "500", 0, 50000, null, 0.96 },
    { "cpDeductGrp2", "500", 250000, 100000000, null,  0.98 },
    { "cpDeductGrp2", "500", 100000, 250000, null, 0.95 },
    { "cpDeductGrp2", "500", 50000, 100000, null, 0.93 },
    { "cpDeductGrp2", "500", 0, 50000, null, 0.89 },
    { "cpDeductBroad", "500", 250000 ,100000000, null, 0.97 },
    { "cpDeductBroad", "500", 100000 ,250000, null, 0.94 },
    { "cpDeductBroad", "500", 50000 ,100000, null, 0.92 },
    { "cpDeductBroad", "500", 0 ,50000, null, 0.88 },
    { "cpDeductSpecial", "500", 250000, 100000000, null, 0.97 },
    { "cpDeductSpecial", "500", 100000, 250000, null, 0.94 },
    { "cpDeductSpecial", "500", 50000, 100000, null, 0.92 },
    { "cpDeductSpecial", "500", 0, 50000, null, 0.88 },
    { "cpDeductGrp1", "1000", 250000, 100000000, null, 0.98 },
    { "cpDeductGrp1", "1000", 100000, 250000, null, 0.96 },
    { "cpDeductGrp1", "1000", 50000, 100000, null, 0.95 },
    { "cpDeductGrp1", "1000", 0, 50000, null, 0.90 },
    { "cpDeductGrp2", "1000", 250000, 100000000, null, 0.95 },
    { "cpDeductGrp2", "1000", 100000, 250000, null, 0.87 },
    { "cpDeductGrp2", "1000", 50000, 100000, null, 0.82 },
    { "cpDeductGrp2", "1000", 0, 50000, null, 0.74 },
    { "cpDeductBroad", "1000", 250000, 100000000, null, 0.92 },
    { "cpDeductBroad", "1000", 100000, 250000, null, 0.84 },
    { "cpDeductBroad", "1000", 50000, 100000, null, 0.79 },
    { "cpDeductBroad", "1000", 0, 50000, null, 0.72 },
    { "cpDeductSpecial", "1000", 250000, 100000000, null, 0.92 },
    { "cpDeductSpecial", "1000", 100000, 250000, null, 0.84 },
    { "cpDeductSpecial", "1000", 50000, 100000, null, 0.79 },
    { "cpDeductSpecial", "1000", 0, 50000, null, 0.72 },
    { "cpDeductGrp1", "2500", 250000, 100000000, null, 0.95 },
    { "cpDeductGrp1", "2500", 100000, 250000, null, 0.94 },
    { "cpDeductGrp1", "2500", 50000, 100000, null, 0.92 },
    { "cpDeductGrp1", "2500", 0, 50000, null, 0.88 },
    { "cpDeductGrp2", "2500", 250000, 100000000, null, 0.88 },
    { "cpDeductGrp2", "2500", 100000, 250000, null, 0.80 },
    { "cpDeductGrp2", "2500", 50000, 100000, null, 0.72 },
    { "cpDeductGrp2", "2500", 0, 50000, null, 0.63 },
    { "cpDeductBroad", "2500", 250000, 100000000, null, 0.83 },
    { "cpDeductBroad", "2500", 100000, 250000, null, 0.75 },
    { "cpDeductBroad", "2500", 50000, 100000, null, 0.68 },
    { "cpDeductBroad", "2500", 0, 50000, null, 0.59 },
    { "cpDeductSpecial", "2500", 250000, 100000000, null, 0.83 },
    { "cpDeductSpecial", "2500", 100000, 250000, null, 0.75 },
    { "cpDeductSpecial", "2500", 50000, 100000, null, 0.68 },
    { "cpDeductSpecial", "2500", 0, 50000, null, 0.59 },
    { "cpDeductGrp1", "5000", 1000000, 100000000, null, 0.92 },
    { "cpDeductGrp1", "5000", 500000, 1000000, null, 0.91 },
    { "cpDeductGrp1", "5000", 250000 ,500000, null, 0.89 },
    { "cpDeductGrp1", "5000", 0, 250000, null, 0.85 },
    { "cpDeductGrp2", "5000", 1000000, 100000000, null, 0.84 },
    { "cpDeductGrp2", "5000", 500000, 1000000, null, 0.75 },
    { "cpDeductGrp2", "5000", 250000, 500000, null, 0.69 },
    { "cpDeductGrp2", "5000", 0, 250000, null, 0.59 },
    { "cpDeductBroad", "5000", 1000000, 100000000, null, 0.76 },
    { "cpDeductBroad", "5000", 500000, 1000000, null, 0.68 },
    { "cpDeductBroad", "5000", 250000, 500000, null, 0.63 },
    { "cpDeductBroad", "5000", 0, 250000, null, 0.53 },
    { "cpDeductSpecial", "5000", 1000000, 100000000, null, 0.76 },
    { "cpDeductSpecial", "5000", 500000, 1000000, null, 0.68 },
    { "cpDeductSpecial", "5000", 250000, 500000, null, 0.63 },
    { "cpDeductSpecial", "5000", 0, 250000, null, 0.53 },
    { "cpDeductGrp1", "10000", 5000000, 100000000, null, 0.88 },
    { "cpDeductGrp1", "10000", 1000000, 5000000, null, 0.86 },
    { "cpDeductGrp1", "10000", 500000, 1000000, null, 0.85 },
    { "cpDeductGrp1", "10000", 250000, 500000, null, 0.83 },
    { "cpDeductGrp1", "10000", 0, 250000, null, 0.77 },
    { "cpDeductGrp2", "10000", 5000000, 100000000, null, 0.83 },
    { "cpDeductGrp2", "10000", 1000000, 5000000, null, 0.72 },
    { "cpDeductGrp2", "10000", 500000, 1000000, null, 0.64 },
    { "cpDeductGrp2", "10000", 250000, 500000, null, 0.57 },
    { "cpDeductGrp2", "10000", 0, 250000, null, 0.46 },
    { "cpDeductBroad", "10000", 5000000, 100000000, null, 0.73 },
    { "cpDeductBroad", "10000", 1000000, 5000000, null, 0.63 },
    { "cpDeductBroad", "10000", 500000, 1000000, null, 0.56 },
    { "cpDeductBroad", "10000", 250000, 500000, null, 0.50 },
    { "cpDeductBroad", "10000", 0, 250000, null, 0.41 },
    { "cpDeductSpecial", "10000", 5000000, 100000000, null, 0.73 },
    { "cpDeductSpecial", "10000", 1000000, 5000000, null, 0.63 },
    { "cpDeductSpecial", "10000", 500000, 1000000, null, 0.56 },
    { "cpDeductSpecial", "10000", 250000, 500000, null, 0.50 },
    { "cpDeductSpecial", "10000", 0, 250000, null, 0.41 },
    { "cpDeductGrp1", "25000", 10000000, 100000000, null, 0.81 },
    { "cpDeductGrp1", "25000", 5000000, 10000000, null, 0.78 },
    { "cpDeductGrp1", "25000", 1000000, 5000000, null, 0.76 },
    { "cpDeductGrp1", "25000", 500000, 1000000, null, 0.75 },
    { "cpDeductGrp1", "25000", 0, 500000, null, 0.65 },
    { "cpDeductGrp2", "25000", 10000000, 100000000, null, 0.75 },
    { "cpDeductGrp2", "25000", 5000000, 10000000, null, 0.71 },
    { "cpDeductGrp2", "25000", 1000000, 5000000, null, 0.58 },
    { "cpDeductGrp2", "25000", 500000, 1000000, null, 0.49 },
    { "cpDeductGrp2", "25000", 0, 500000, null, 0.42 },
    { "cpDeductBroad", "25000", 10000000, 100000000, null, 0.63 },
    { "cpDeductBroad", "25000", 5000000, 10000000, null, 0.60 },
    { "cpDeductBroad", "25000", 1000000, 5000000, null, 0.48 },
    { "cpDeductBroad", "25000", 500000, 1000000, null, 0.41 },
    { "cpDeductBroad", "25000", 0, 500000, null, 0.35 },
    { "cpDeductSpecial", "25000", 10000000, 100000000, null, 0.63 },
    { "cpDeductSpecial", "25000", 5000000, 10000000, null, 0.60 },
    { "cpDeductSpecial", "25000", 1000000, 5000000, null, 0.48 },
    { "cpDeductSpecial", "25000", 500000, 1000000, null, 0.41 },
    { "cpDeductSpecial", "25000", 0, 500000, null, 0.35 },
    { "cpDeductGrp1", "50000", 10000000, 100000000, null, 0.77 },
    { "cpDeductGrp1", "50000", 5500000, 10000000, null, 0.76 },
    { "cpDeductGrp1", "50000", 3500000, 5500000, null, 0.74 },
    { "cpDeductGrp1", "50000", 1000000, 3500000, null, 0.72 },
    { "cpDeductGrp1", "50000", 0, 1000000, null, 0.70 },
    { "cpDeductGrp2", "50000", 10000000, 100000000, null, 0.71 },
    { "cpDeductGrp2", "50000", 5500000, 10000000, null, 0.66 },
    { "cpDeductGrp2", "50000", 3500000, 5500000, null, 0.57 },
    { "cpDeductGrp2", "50000", 1000000, 3500000, null, 0.48 },
    { "cpDeductGrp2", "50000", 0, 1000000, null, 0.39 },
    { "cpDeductBroad", "50000", 10000000, 100000000, null, 0.58 },
    { "cpDeductBroad", "50000", 5500000, 10000000, null, 0.54 },
    { "cpDeductBroad", "50000", 3500000, 5500000, null, 0.46 },
    { "cpDeductBroad", "50000", 1000000, 3500000, null, 0.39 },
    { "cpDeductBroad", "50000", 0, 1000000, null, 0.32 },
    { "cpDeductSpecial", "50000", 10000000, 100000000, null, 0.58 },
    { "cpDeductSpecial", "50000", 5500000, 10000000, null, 0.54 },
    { "cpDeductSpecial", "50000", 3500000, 5500000, null, 0.46 },
    { "cpDeductSpecial", "50000", 1000000 ,3500000, null, 0.39 },
    { "cpDeductSpecial", "50000", 0, 1000000, null, 0.32 },
    { "cpDeductGrp1", "75000", 10000000, 100000000, null, 0.74 },
    { "cpDeductGrp1", "75000", 5500000, 10000000, null, 0.73 },
    { "cpDeductGrp1", "75000", 3500000, 5500000, null, 0.71 },
    { "cpDeductGrp1", "75000", 1000000, 3500000, null, 0.69 },
    { "cpDeductGrp1", "75000", 0, 1000000, null, 0.67 },
    { "cpDeductGrp2", "75000", 10000000, 100000000, null, 0.67 },
    { "cpDeductGrp2", "75000", 5500000, 10000000, null, 0.62 },
    { "cpDeductGrp2", "75000", 3500000, 5500000, null, 0.55 },
    { "cpDeductGrp2", "75000", 1000000, 3500000, null, 0.42 },
    { "cpDeductGrp2", "75000", 0, 1000000, null, 0.33 },
    { "cpDeductBroad", "75000", 10000000, 100000000, null, 0.53 },
    { "cpDeductBroad", "75000", 5500000, 10000000, null, 0.49 },
    { "cpDeductBroad", "75000", 3500000, 5500000, null, 0.44 },
    { "cpDeductBroad", "75000", 1000000, 3500000, null, 0.33 },
    { "cpDeductBroad", "75000", 0, 1000000, null, 0.26 },
    { "cpDeductSpecial", "75000", 10000000, 100000000, null, 0.53 },
    { "cpDeductSpecial", "75000", 5500000, 10000000, null, 0.49 },
    { "cpDeductSpecial", "75000", 3500000, 5500000, null, 0.44 },
    { "cpDeductSpecial", "75000", 1000000, 3500000, null, 0.33 },
    { "cpDeductSpecial", "75000", 0, 1000000, null, 0.26 },
    { "cpDeductGrp1", null, null, null, null, 1 },
    { "cpDeductGrp2", null, null, null, null, 1 },
    { "cpDeductBroad", null, null, null, null, 1 },
    { "cpDeductSpecial", null, null, null, null, 1 }
//    { "cpDeductGrp1", null, 0 , 100000000, "", 3.14159 },   // rows with null in the middle should never match anything
//    { "cpDeductGrp2", null, 0 , 100000000, "", 3.14159  },  // but they make the table invalid, so we don't want to
//    { "cpDeductBroad", null, 0 , 100000000, "", 3.14159  }, // include them in the rating sample data!
//    { "cpDeductSpecial", null, 0 , 100000000, "", 3.14159 }
  }
  
  public final static var FIRE_PROTECT_CLASS_TABLE : List<Object[]> = {
    //FireProtectClass, Factor
    { "1", 0.70 }, 
    { "2", 1.00 },
    { "3", 1.25 },
    { "4", 2.00 }, 
    { "5", 2.00 },
    { null, 1.00 } 
  }
  
  final static var UW_COMPANY_TABLE : List<Object[]> = {
   // UW Code, Jurisdiction, Factor
    { "3111_33333", null, 1.10 },
    { "2111_11111", null, 1.00 },
    { "1111_11111", null, 0.87 }
  }

  final private static var NAME_MAP : Map<String, List<Object[]>> = {
      CPSampleDataTablesBuilder.CP_COV_BASE_RATE_CODE       -> BASE_RATE_TABLE,
      CPSampleDataTablesBuilder.CP_DEDUCT_CODE              -> DEDUCT_TABLE,
      CPSampleDataTablesBuilder.CP_FIRE_PROTECT_CLASS_CODE  -> FIRE_PROTECT_CLASS_TABLE,
      CPSampleDataTablesBuilder.CP_UW_COMPANY_CODE          -> UW_COMPANY_TABLE
  }

  static function getData(tableDef : RateTableDefinition) : AbstractFactorRowBuilder[] {
    var data = NAME_MAP.get(tableDef.TableCode)
    return getData(tableDef, data)
  }

  static function getData(tableDef : RateTableDefinition, data : List<Object[]>) : AbstractFactorRowBuilder[] {
    var rows = new ArrayList<AbstractFactorRowBuilder>()
    for (i in 0..|data.Count) {
      var builder = new RateFactorRowBuilder()
      tableDef.AllColumns.eachWithIndex(\ col, j -> {
        builder.with(col.PhysicalColumnName, wrap(col, data[i][j]))
      })
      rows.add(builder)
    }
    return rows.toTypedArray()
  }

  static function wrap(column : RateTableColumn, value : Object) : Object {
    switch (column.ColumnType) {
      case RateTableDataType.TC_BOOLEAN : return Coercions.makeBooleanFrom(value)
      case RateTableDataType.TC_DATE    : return Coercions.makeDateFrom(value)
      case RateTableDataType.TC_DECIMAL : return value != null ? new BigDecimal(Coercions.makePDoubleFrom(value), new MathContext(4)) : null as BigDecimal
      case RateTableDataType.TC_INTEGER : return value != null ? new Integer(Coercions.makePIntFrom(value)) : null as Integer
      case RateTableDataType.TC_STRING  : return value != null ? String.valueOf(value) : null as String
    }
    throw new IllegalArgumentException("Invalid column type ${column.ColumnType}")
  }
}
