/**
 * @description       : 
 * @author            : Anna Makhovskaya
 * @group             : 
 * @last modified on  : 11-05-2021
 * @last modified by  : Anna Makhovskaya
**/
global with sharing class LinkedInRegistrationHandler implements Auth.RegistrationHandler{
   
    global User createUser(Id portalId, Auth.UserData data){
        String userName = data.email.subStringBefore('@')+'@maxfit.com.organizer';
        String partnerUserName = data.email.subStringBefore('@')+'@maxfit.com.attendee';

        List<User> userList = [SELECT Id, Name, Email, UserName 
        FROM User
        WHERE (UserName = :userName OR UserName = :partnerUserName) AND isActive = true ];

        User user = new User();
        if(userList != null && userList.size() > 0){
            user = userList.get(0);
            return user;
        }else{

            System.debug('LinkedInRegistrationHandler data:'+data);
            System.debug('attributeMap data:'+data.attributeMap.keySet());

            if(data.attributeMap.containsKey('sfdc_networkid')){
                //login from community
                String communityId = data.attributeMap.get('sfdc_networkid');
                //Portal User
                User u = RegistrationHandler.createPortalUser(data);
                return u;
            }else{
                //Regular User
                User u = RegistrationHandler.createUser(data);
                return u;
            }
        }
    }


    global void updateUser(Id userId, Id portalId, Auth.UserData data){

        list<User> userList = [SELECT Id, Name, Email, UserName FROM User WHERE Id = :userId AND isActive =  true];
        User u = new User();
        if(userList != null && userList.size() > 0){
            u = userList.get(0);
        }
    }
}
