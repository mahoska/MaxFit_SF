/**
 * @description       : 
 * @author            : Anna Makhovskaya
 * @group             : 
 * @last modified on  : 11-12-2021
 * @last modified by  : Anna Makhovskaya
**/
public without sharing class UserUtility {
    
    @AuraEnabled(cacheable=true)
    public static string fetchUserInfo(){

        return UserInfo.getName();
    }

    @AuraEnabled(cacheable=true)
    public static Boolean fetchUserType() {
        Boolean isLoggedIn = false;
        String userType = UserInfo.getUserType();
        if (userType != 'Guest') {
            isLoggedIn = true;
        }
        return isLoggedIn;
    }
}
