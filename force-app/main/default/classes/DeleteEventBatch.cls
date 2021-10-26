/**
 * @description       : 
 * @author            : Anna Makhovskaya
 * @group             : 
 * @last modified on  : 10-26-2021
 * @last modified by  : Anna Makhovskaya
**/
public with sharing class DeleteEventBatch implements Database.Batchable<sObject>{
   
    public Database.QueryLocator start(Database.BatchableContext batchContext){
        String query = 'SELECT Id, Name FROM Event__c WHERE Live__c = true AND End_Date_Time__c < LAST_N_MONTHS:2';
        return Database.getQueryLocator(query);
    }

    public void execute(Database.BatchableContext batchContext, List<Event__c> eventList){
        if(!eventList.isEmpty()){
            List<Database.DeleteResult> deleteResult = Database.delete(eventList);
            for(Database.DeleteResult dr : deleteResult){
                if(!dr.isSuccess()){
                    List<Database.Error> errors = dr.getErrors();
                    String errorInString = String.join(errors, ', ');
                    TransactionLogHandler.doHandleExceptionWithError(errorInString, 'DeleteEventBatch');
                }
            }
        }
    }

    public void finish(Database.BatchableContext batchContext){

        Id adminProfileId = [Select Id From Profile Where Name='System Administrator' LIMIT 1].Id;
        User admin = [SELECT Name, Email FROM User WHERE IsActive = true AND ProfileId = :adminProfileId LIMIT 1];
        
        
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();

            mail.setSubject('Batch Processing Completed');
            List<String> toAddress = new List<String>();
            toAddress.add(admin.Email);
            mail.setToAddresses( toAddress );
            mail.setSenderDisplayName(admin.Name);
            
            mail.setHtmlBody('The DeleteEventBatch Batch Processing has been completed');

            Messaging.sendEmail(new List<Messaging.SingleEmailMessage> {mail});
    }
}
