/**
 * @description       : 
 * @author            : Anna Makhovskaya
 * @group             : 
 * @last modified on  : 11-11-2021
 * @last modified by  : Anna Makhovskaya
**/
public without sharing class EventListService {
   
    @AuraEnabled(cacheable=true)
    public static List<Event__c> fetchUpCommingEvents(){
        List<Event__c> eventList = new List<Event__c>();
        try {
            eventList = [SELECT Id, Location__c, Event_Organizer__c, Event_Organizer__r.Name, 
            Event_Organizer__r.titlePhoto__c, Location__r.Name, Name__c, Start_DateTime__c, Title_Image_Url__c 
            FROM Event__c 
            WHERE Start_DateTime__c >= TODAY AND Live__c =  true
            WITH SECURITY_ENFORCED
            ];
            return eventList;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }

    
    }

    @AuraEnabled(cacheable=true)
    public static List<Event__c> fetchPastEvents(){
        List<Event__c> eventList = new List<Event__c>();
        try {
            eventList = [SELECT Id, Location__c, Event_Organizer__c, Event_Organizer__r.Name, 
            Location__r.Name, Name__c, Start_DateTime__c, Event_Organizer__r.titlePhoto__c, Title_Image_Url__c
            FROM Event__c 
            WHERE Start_DateTime__c < TODAY 
            WITH SECURITY_ENFORCED
            ];
            
            return eventList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
