package acc.pc.schedule.util
uses entity.ScheduleGenericIntegerDelegate_Ext
uses entity.ScheduleAccountHolderDelegate_Ext
uses entity.ScheduleResidentialAddressDelegate_Ext
uses entity.ScheduleGenericDateDelegate_Ext
uses entity.ScheduleCardHolderDelegate_Ext
uses entity.SchedulePeopleDelegate_Ext
uses entity.ScheduleGenericStringShortDelegate_Ext
uses entity.ScheduleGenericMoneyDelegate_Ext
uses entity.ScheduleGenericDecimalDelegate_Ext
uses entity.ScheduleCorrespondenceAddressDelegate_Ext
uses entity.ScheduleAddressDelegate_Ext
uses entity.ScheduleVehicleDelegate_Ext
uses entity.ScheduleContactDelegate_Ext
uses entity.ScheduleGenericStringLongDelegate_Ext
uses java.lang.Object
uses entity.ScheduleExternalPolicyDelegate_Ext

class ScheduleItemUtil_Ext {

  construct() {

  }
  
  public static function updateItem(inOwner : Object, inScheduleItem : gw.xml.XmlElement){
    if(inOwner typeis ScheduleAddressDelegate_Ext){
      inOwner.updateAddress(inScheduleItem)
    }
    if(inOwner typeis SchedulePeopleDelegate_Ext){
      inOwner.updatePeople(inScheduleItem)
    }
    if(inOwner typeis ScheduleContactDelegate_Ext){
      inOwner.updateContact(inScheduleItem)
    }
    if(inOwner typeis ScheduleVehicleDelegate_Ext){
      inOwner.updateVehicle(inScheduleItem)
    }
    if(inOwner typeis ScheduleCorrespondenceAddressDelegate_Ext){
      inOwner.updateCorrespondenceAddress(inScheduleItem)
    }
    if(inOwner typeis ScheduleResidentialAddressDelegate_Ext){
      inOwner.updateResidentialAddress(inScheduleItem)
    }
    if(inOwner typeis ScheduleCardHolderDelegate_Ext){
      inOwner.updateCardHolder(inScheduleItem)
    }
    if(inOwner typeis ScheduleAccountHolderDelegate_Ext){
      inOwner.updateAccountHolder(inScheduleItem)
    }
    if(inOwner typeis ScheduleExternalPolicyDelegate_Ext){
      inOwner.updateExternalPolicy(inScheduleItem)
    }
    if(inOwner typeis ScheduleGenericStringLongDelegate_Ext){
      inOwner.updateLong(inScheduleItem)
    }
    if(inOwner typeis ScheduleGenericStringShortDelegate_Ext){
      inOwner.updateShort(inScheduleItem)
    }   
    if(inOwner typeis ScheduleGenericDateDelegate_Ext){
      inOwner.updateDate(inScheduleItem)
    } 
    if(inOwner typeis ScheduleGenericDecimalDelegate_Ext){
      inOwner.updateDecimal(inScheduleItem)
    }   
    if(inOwner typeis ScheduleGenericIntegerDelegate_Ext){
      inOwner.updateInteger(inScheduleItem)
    } 
    if(inOwner typeis ScheduleGenericMoneyDelegate_Ext){
      inOwner.updateMoney(inScheduleItem)
    }
    if(inOwner typeis SchedulePremiumDelegate_Ext){
      inOwner.updatePremium(inScheduleItem)
    }
    if(inOwner typeis ScheduleIdentityDelegate_Ext){
      inOwner.updateIdentity(inScheduleItem)
    } 
    if(inOwner typeis ScheduleSumInsuredDelegate_Ext){
      inOwner.updateSumInsured(inScheduleItem)
    }
  }

}
