public with sharing class AccountDAO {

    public static Id insertAccount(Account acc) {
        insert acc;
        return acc.Id;
    }

    public static List<Account> getAccounts() {
        return [
            SELECT Id, Name, AccountNumber, Industry
            FROM Account
        ];
    }
}