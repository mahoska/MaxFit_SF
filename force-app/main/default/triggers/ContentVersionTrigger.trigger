/**
 * @description       : 
 * @author            : Anna Makhovskaya
 * @group             : 
 * @last modified on  : 11-11-2021
 * @last modified by  : Anna Makhovskaya
**/
trigger ContentVersionTrigger on ContentVersion (after insert) {
    ContentVersionTriggerHandler.createPublicLinkForFile(Trigger.New,  Trigger.newMap);
}