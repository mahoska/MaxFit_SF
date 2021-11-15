/**
 * @description       : 
 * @author            : Anna Makhovskaya
 * @group             : 
 * @last modified on  : 11-12-2021
 * @last modified by  : Anna Makhovskaya
**/
public without sharing class RsvpService {
    
    @AuraEnabled
    public static void doRSVP(String params, String eventId){
        
        Attendee__c attendeeRecord = (Attendee__c)JSON.deserialize(params, Attendee__c.class);
        attendeeRecord.User__c = UserInfo.getUserId();
        String attendeeId = checkAttendee(UserInfo.getUserId());
        try{
            if(String.isBlank(attendeeId)){
                insert attendeeRecord;
                attendeeId = attendeeRecord.Id;
            }else{
                attendeeRecord.Id = attendeeId;
                update attendeeRecord;
            }
                Event_Attendee__c eventAttendeeRecord = new Event_Attendee__c();
                eventAttendeeRecord.Attendee__c = attendeeRecord.Id;
                eventAttendeeRecord.Event__c = eventId;
                insert eventAttendeeRecord;
            
        }catch(Exception ex){
            throw new AuraHandledException(ex.getMessage());
        }
    }

    private static String checkAttendee(String userId){

        String attendeeId = '';
        List<Attendee__c>attendeeList = [SELECT Id, User__c FROM Attendee__c WHERE User__c = :userId];
        if(attendeeList != null && attendeeList.size() >0){
            attendeeId = attendeeList[0].Id;
        }
        return attendeeId;
    }

  

}
