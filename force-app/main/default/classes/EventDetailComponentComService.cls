/**
 * @description       : 
 * @author            : Anna Makhovskaya
 * @group             : 
 * @last modified on  : 11-15-2021
 * @last modified by  : Anna Makhovskaya
**/
public without sharing class EventDetailComponentComService {
 
    @AuraEnabled(cacheable=true)
    public static Event__c fetchEventDetails(String recordId){
        Event__c eventRecord = new Event__c();
        try {
            eventRecord = [SELECT Id, Name, CreatedDate, Location__c,
            Location__r.Name, Location__r.Street__c, Location__r.City__c,
            Location__r.Postal_Code__c, Location__r.Country__c, Location__r.State__c, Event_Organizer__r.titlePhoto__c, Event_Organizer__r.OwnerId, 
            Event_Organizer__c, Event_Organizer__r.Name, Event_Organizer__r.Email__c, Event_Organizer__r.Company__c, Event_Organizer__r.Short_Info__c, 
            Name__c, Start_DateTime__c, End_Date_Time__c, Recurring__c, Max_Seats__c, Live__c, Event_Completed__c,
            PeopleAttending__c, Remaining_Seats__c, Event_Type__c, Frequency__c, Location_Verified__c, Status__c, Event_Detail__c 
            FROM Event__c 
            WHERE Id = :recordId
            WITH SECURITY_ENFORCED
            LIMIT 1
            ];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return eventRecord;
    }

    @AuraEnabled(cacheable=true)
    public static List<EventSpeakers__c> fetchSpeakerDetails(String eventRecId){
        List<EventSpeakers__c> speakers = new List<EventSpeakers__c>();
        try {
            speakers = [SELECT Id, Event__c, Speaker__c, Speaker__r.Name, Speaker__r.About_Me__c, Speaker__r.Company__c, Speaker__r.Picture__c 
            FROM EventSpeakers__c 
            WHERE Event__c = :eventRecId 
            WITH SECURITY_ENFORCED
            ];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        System.debug(speakers);
        return speakers;
    }


    @AuraEnabled(cacheable=true)
    public static List<Event_Attendee__c> fetchRsvpList(String eventId){
        List<Event_Attendee__c> attendees = new List<Event_Attendee__c>();
        attendees = [SELECT Id, Event__c 
        FROM Event_Attendee__c 
        WHERE Event__c = :eventId AND Attendee__r.User__c = : UserInfo.getUserId() 
        WITH SECURITY_ENFORCED
        ];

        return attendees;
    }
}
