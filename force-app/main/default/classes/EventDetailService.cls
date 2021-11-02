/**
 * @description       : 
 * @author            : Anna Makhovskaya
 * @group             : 
 * @last modified on  : 11-02-2021
 * @last modified by  : Anna Makhovskaya
**/
public with sharing class EventDetailService {

    @AuraEnabled
    public static List<Event__c> upcomingEvents(){

        List<Event__c> eventList = [SELECT Id, Name, Name__c, Event_Detail__c, Location__c, Location__r.Name, Event_Organizer__c, Event_Organizer__r.Name, Start_DateTime__c    
                                    FROM Event__c 
                                    WHERE Start_DateTime__c >=Today AND Live__c = true 
                                    WITH SECURITY_ENFORCED];
        return eventList;
    }
    
    
}
