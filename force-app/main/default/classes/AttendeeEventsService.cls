/**
 * @description       : 
 * @author            : Anna Makhovskaya
 * @group             : 
 * @last modified on  : 11-02-2021
 * @last modified by  : Anna Makhovskaya
**/
public with sharing class AttendeeEventsService {
    
    @AuraEnabled
    public static List<Event_Attendee__c> upcomingEvents(String attendeeId){

            List<Event_Attendee__c> eventList = [SELECT Id, Name, Event__c, Event__r.Event_Organizer__c, Event__r.Event_Organizer__r.Name, 
                                                        Event__r.Name__c, Event__r.Start_DateTime__c, Event__r.Location__c,  Event__r.Location__r.Name 
                                                FROM Event_Attendee__c 
                                                WHERE Attendee__c = :attendeeId  AND Event__r.Start_DateTime__c >= today AND Event__r.Live__c = true 
                                                WITH SECURITY_ENFORCED];

            return eventList;

    }

    @AuraEnabled
    public static List<Event_Attendee__c> pastEvents(String attendeeId){

            List<Event_Attendee__c> eventList = [SELECT Id, Name, Event__c, Event__r.Event_Organizer__c, Event__r.Event_Organizer__r.Name, 
                                                        Event__r.Name__c, Event__r.Start_DateTime__c, Event__r.Location__c,  Event__r.Location__r.Name 
                                                FROM Event_Attendee__c 
                                                WHERE Attendee__c = :attendeeId  AND Event__r.Start_DateTime__c < today  
                                                WITH SECURITY_ENFORCED];

            return eventList;

    }
}
