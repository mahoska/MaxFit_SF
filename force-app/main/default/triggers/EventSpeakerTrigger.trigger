/**
 * @description       : 
 * @author            : Anna Makhovskaya
 * @group             : 
 * @last modified on  : 10-21-2021
 * @last modified by  : Anna Makhovskaya
**/
trigger EventSpeakerTrigger on EventSpeakers__c (before insert, before update ) {
    
    // Step 1 - Get the speaker id & event id 
    // Step 2 - SOQL on Event to get the Start Date and Put them into a Map
    // Step 3 - SOQL on Event - Spekaer to get the Related Speaker along with the Event Start Date
    // Step 4 - Check the Conditions and throw the Error
    
    //Step 1 -  Start

    Set<Id> speakerIdsSet = new Set<Id>();
    Set<Id> eventIdsSet = new Set<Id>();
    
    for( EventSpeakers__c es : Trigger.New ){
         speakerIdsSet.add(es.Speaker__c);
         eventIdsSet.add(es.Event__c);
    }
    //Step 1 -  End 
    
    // Step 2 Start
    Map<Id, DateTime> requestedEventsMap = new Map<Id, DateTime>();
    
    List<Event__c> relatedEventList = [Select Id, Start_DateTime__c 
                                       From Event__c 
                                       Where Id IN : eventIdsSet];
    
    for(Event__c evt : relatedEventList ){
        requestedEventsMap.put(evt.Id, evt.Start_DateTime__c);
    }
    // Step 2 End
    
    
    // Step 3 - Start
    //ищем все  записи о уже существующих ивентах наших спикеров
    List<EventSpeakers__c> relatedEventSpeakerList = [ SELECT Id, Event__c, Speaker__c, Event__r.Start_DateTime__c
                                                       From EventSpeakers__c
                                                       WHERE Speaker__c IN : speakerIdsSet];
    
    // Step 3 - End 
    
    // Step 4 - Start
    //если мы найдем запись, среди уже существуюших - в которой будет тот же спикер и ивент будет в тоже время, что и в триггере - генерируем ошибку, 
    //так как спикер не можт быть на двух ивентах одновременно
    for( EventSpeakers__c es : Trigger.New ){ // - Salesforce Geek
        
        DateTime bookingTime = requestedEventsMap.get(es.Event__c); 
        // DateTime for that event which is associated with this new Event-Speaker Record
        
        for(EventSpeakers__c es1 : relatedEventSpeakerList) {
            if(es1.Speaker__c == es.Speaker__c && es1.Event__r.Start_DateTime__c == bookingTime ){
                es.Speaker__c.addError('The speaker is already booked at that time');
                es.addError('The speaker is already booked at that time');
            }
        }
        
    } 

    // Step 4 - End
}