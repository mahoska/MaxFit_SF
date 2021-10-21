/**
 * @description       : 
 * @author            : Anna Makhovskaya
 * @group             : 
 * @last modified on  : 10-21-2021
 * @last modified by  : Anna Makhovskaya
**/
@isTest
public class EventAttendeeTriggerTest {
	
    @testSetup
    public static void setupData(){
        
        Event_Organizer__c  org = new Event_Organizer__c (
            Name = 'Amit Singh',
            Phone__c = '9807654321',
            Email__c = 'sfdcpanther@gmail.com.dev1',
            Alternative_Phone__c  = '9807654321',
            Alternative_Email__c ='sfdcpanther@gmail.com.dev1'
        );
        insert org;
        
        Event__c event = new Event__c(
            Name__c = 'MAX FIT Campaign',
            Event_Organizer__c  = org.Id,
            Event_Type__c = 'Virtual',
            Frequency__c  = 'Weekly',
            Max_Seats__c  = 199,
            Recurring__c = true,
            Live__c = true,
            Start_DateTime__c = System.now(),
            End_Date_Time__c  = System.now().addDays(3)
        );
        insert event;
        
        List<Attendee__c> attsList =  new List<Attendee__c>();
        for (Integer i = 0; i < 100; i++){

            Attendee__c att = new Attendee__c(
                Name = 'Akash Jain Test'+i,
                Email__c = 'akash.jain'+i+'@gmail.com',
                Phone__c = '9807654321'
            );

            attsList.add(att);
        }
        insert attsList;
        
       
    }
    
    @isTest
    static void sendEmailTest(){

            Event__c ev = [SELECT Id FROM Event__c WHERE  Name__c = 'MAX FIT Campaign' LIMIT 1];

            Map<Id, Attendee__c> attdsMap = new Map<Id, Attendee__c>([SELECT Id, Name FROM Attendee__c WHERE Name LIKE 'Akash Jain Test%']);

            Set<Id> attdsIdKeySet = attdsMap.keySet();

        Test.startTest();

            List<Event_Attendee__c> evAtList = new List<Event_Attendee__c>();

            if(attdsIdKeySet.size() > 0){

                for(Id atId : attdsIdKeySet){
                    Event_Attendee__c evtAtt = new Event_Attendee__c(Event__c = ev.Id, Attendee__c = atId);
                    evAtList.add(evtAtt);
                }

                insert evAtList;
            }

            Integer invocations = Limits.getEmailInvocations();

    
        Test.stopTest();


        system.assertEquals(1, invocations, 'An email should be sent');
        
    }
}