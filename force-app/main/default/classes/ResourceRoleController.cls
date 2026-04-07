public with sharing class ResourceRoleController {

    @AuraEnabled
    public static Id createResourceRole(Resource_Role__c rr) {
        return ResourceRoleService.createResourceRole(rr);
    }
}