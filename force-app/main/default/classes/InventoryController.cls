public with sharing class InventoryController {

    @AuraEnabled
    public static Id createProduct(Inventory__c inv) {
        return InventoryService.createProduct(inv);
    }

    @AuraEnabled
    public static Id createAddOn(Inventory__c inv) {
        return InventoryService.createAddOn(inv);
    }

    @AuraEnabled(cacheable=true)
    public static List<Inventory__c> getInventories() {
        return InventoryService.getAllInventories();
        }
}