/**
 * @description       : 
 * @author            : Anna Makhovskaya
 * @group             : 
 * @last modified on  : 11-11-2021
 * @last modified by  : Anna Makhovskaya
**/
public with sharing class FooterComponentService {
    
    @AuraEnabled(cacheable=true)
    public static List<Footer__c> fetchFooterContent(){
        List<Footer__c> footerContentList = new List<Footer__c>(); 
        try {
            footerContentList = [SELECT Id, Content__c, Name FROM Footer__c WITH SECURITY_ENFORCED LIMIT 3];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return footerContentList;
    }
}
