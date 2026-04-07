public with sharing class ResourceRoleService {

    public static Id createResourceRole(Resource_Role__c rr) {

        // 🔹 Validations
        if(String.isBlank(rr.Resource_Name__c)) {
            throw new AuraHandledException('Resource Name is required');
        }

        if(rr.Price__c != null && rr.Price__c < 0) {
            throw new AuraHandledException('Price cannot be negative');
        }

        if(rr.Cost__c != null && rr.Cost__c < 0) {
            throw new AuraHandledException('Cost cannot be negative');
        }

        // 🔹 Call DAO
        return ResourceRoleDAO.insertResourceRole(rr);
    }
}