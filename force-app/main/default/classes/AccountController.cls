public with sharing class AccountController {

    @AuraEnabled
    public static Id createAccount(Account acc) {
        return AccountService.createAccount(acc);
    }
}