package gw.util

// Base class gw.util.DateRange deprecated in PC 8.0.2
@Deprecated(:value="use Gosu intervals instead e.g., (date1..date2).unit( HOURS ).step( 2 ) instead", :version="8.0.2")
enhancement DateRangeEnhancement : gw.util.DateRange {
  function overlaps(otherRange : DateRange) : boolean {
    return (otherRange.start < this.end) and (otherRange.end > this.start)
  }

  property get LeapDaysInInterval() : int {
    var earlier = this._start
    var later = this._end
    
    if(earlier.compareTo(later) > 0){
      earlier = this._end
      later = this._start  
    }
    
    return com.guidewire.pl.system.util.DateRange.allDatesBetween(earlier, later).NumOfLeapYearDays
  }
  
}
