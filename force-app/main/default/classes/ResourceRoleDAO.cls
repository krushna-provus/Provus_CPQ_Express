public with sharing class ResourceRoleDAO {

    public static Id insertResourceRole(Resource_Role__c rr) {
        insert rr;
        return rr.Id;
    }

    public static List<Resource_Role__c> getResourceRoles() {
        return [SELECT Id, Name, Resource_Name__c, Price__c, Cost__c, Billing_Unit__c
                FROM Resource_Role__c];
    }
}