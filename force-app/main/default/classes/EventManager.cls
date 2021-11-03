/**
 * @description       : 
 * @author            : Anna Makhovskaya
 * @group             : 
 * @last modified on  : 11-03-2021
 * @last modified by  : Anna Makhovskaya
**/
@RestResource(urlMapping='/v1/futurevent')
global  class EventManager {

    /*
    EndURL - https://gflinc3-dev-ed.my.salesforce.com/services/apexrest/v1/futurevent
    Method - GET

    Workbanch->rest Explorer -> GET -> /services/apexrest/v1/futurevent
    */
    @httpGet
    global static List<Event__c> upcomingEvents(){

        List<Event__c> eventList = [SELECT Id, Name, CreatedDate,  Event_Organizer__c, Event_Organizer__r.Name, Event_Organizer__r.Email__c, 
                        End_Date_Time__c, Event_Detail__c, Event_Type__c,
                        Frequency__c, Live__c, Location_Verified__c, Location__c,
                        Location__r.Name, Location__r.Street__c, Location__r.City__c, Location__r.Postal_Code__c, Location__r.Country__c, Location__r.State__c, 
                        Max_Seats__c, Name__c, Recurring__c, Remaining_Seats__c,
                        Start_DateTime__c, Status__c, PeopleAttending__c 
                        FROM Event__c 
                        WHERE Start_DateTime__c >= TODAY AND Live__c = true 
                        WITH SECURITY_ENFORCED];
        return eventList;
    }
}
