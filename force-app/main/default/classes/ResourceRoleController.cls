public with sharing class ResourceRoleController {

    @AuraEnabled
    public static Id createResourceRole(Resource_Role__c rr) {
        return ResourceRoleService.createResourceRole(rr);
    }

    @AuraEnabled(cacheable=true)
    public static List<Resource_Role__c> getResourceRoles() {
        return ResourceRoleService.getAllResourceRoles();
    }
}