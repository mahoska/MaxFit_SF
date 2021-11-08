/**
 * @description       : 
 * @author            : Anna Makhovskaya
 * @group             : 
 * @last modified on  : 11-08-2021
 * @last modified by  : Anna Makhovskaya
**/
global with sharing class RegistrationHandler {

    public static User createPortalUser(Auth.UserData data){
        User u = new User();
        try{
            /*
            //Community User's owner  must has role
            UserRole userrole = [Select Id, DeveloperName From UserRole Where DeveloperName = 'CEO' Limit 1];
            Id  ownerUserId = UserInfo.getUserId();
            User ownerUser = [Select Id, UserRoleId From User Where Id = :ownerUserId Limit 1];
            ownerUser.UserRoleId = userRole.Id;
            update ownerUser;*/

            //We have a community id, so create a user with community access
            Account act = new Account(
                Name = data.firstName + ' '+data.lastName,
                OwnerId = UserInfo.getUserId()
            );
            Database.insert(act);

            Contact c = new Contact();
            c.accountId = act.Id;
            c.email = data.email;
            c.firstName = data.firstName;
            c.lastName = data.lastName;
            insert(c);
            
            Profile p = [SELECT Id FROM profile WHERE Name = : System.Label.MAX_FIT_ATTENDEE LIMIT 1];
            
            u.username = data.email.subStringBefore('@')+'@maxfit.com.attendee';
            u.email = data.email;
            u.lastname = data.lastname;
            u.firstname = data.firstname;
            String alias =  data.email.subStringBefore('@');
            //Alias must be 8 characters or less
            if(alias.length() > 8){
                alias = alias.substring(0,8);
            }
            u.alias = alias;
            /*u.languagelocalekey = UserInfo.getLocale();
            u.localesidkey = UserInfo.getLocale();
            u.emailEncodingKey = 'UTF-8';
            u.timeZoneSidKey = 'America/Los_Angeles';*/
            u.LanguageLocaleKey  = 'en_US';
            u.LocaleSidKey  =  'en_US';
            u.emailEncodingKey = 'UTF-8';
            u.TimeZoneSidKey = 'GMT';
            u.profileId = p.Id;
            u.contactId = c.Id;

            //System.debug('user data=> '+ u);
            insert u;
            return u;
        }catch(Exception ex){
            System.debug(ex.getStackTraceString() + ' Message is '+ex.getMessage()+'  '+ex.getCause()+'  '+ex.getTypeName()+' '+ex.getLineNumber());
            return u;
        }
    }

    public static User createUser(Auth.UserData data){
        //This is not a community, so create a regular standard user
        User u = new User();
        Profile p = [SELECT Id FROM profile WHERE Name = 'MaxFit Organizer' LIMIT 1];
        u.username = data.email.subStringBefore('@')+'@maxfit.com.organizer';
        u.email = data.email;
        u.lastname = data.lastname;
        u.firstname = data.firstname;
        String alias =  data.email.subStringBefore('@');
        //Alias must be 8 characters or less
        if(alias.length() > 8){
            alias = alias.substring(0,8);
        }
        u.alias = alias;
        u.LanguageLocaleKey  = 'en_US';
        u.LocaleSidKey  =  'en_US';
        //u.localesidkey = UserInfo.getLocale();
        u.emailEncodingKey = 'UTF-8';
        u.TimeZoneSidKey = 'GMT';
        u.profileId = p.Id;

        return u;
    }
}
