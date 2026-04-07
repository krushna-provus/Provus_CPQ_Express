public with sharing class AccountService {

    public static Id createAccount(Account acc) {

        if(String.isBlank(acc.Name)) {
            throw new AuraHandledException('Account Name is required');
        }

        return AccountDAO.insertAccount(acc);
    }

    public static List<Account> getAllAccounts() {
        return AccountDAO.getAccounts();
    }
}