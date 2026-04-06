public with sharing class AccountService {

    public static Id createAccount(Account acc) {

        // 🔹 Validations
        if(String.isBlank(acc.Name)) {
            throw new AuraHandledException('Account Name is required');
        }

        if(String.isBlank(acc.AccountNumber)) {
            throw new AuraHandledException('Account Number is required');
        }

        return AccountDAO.insertAccount(acc);
    }
}