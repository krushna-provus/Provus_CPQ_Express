public with sharing class InventoryService {

    public static Id createProduct(Inventory__c inv) {

        inv.Type__c = 'Product';

        validateInventory(inv);

        return InventoryDAO.insertInventory(inv);
    }

    public static Id createAddOn(Inventory__c inv) {

        inv.Type__c = 'Add-Ons';

        validateInventory(inv);

        return InventoryDAO.insertInventory(inv);
    }

    private static void validateInventory(Inventory__c inv) {

        if(String.isBlank(inv.Inventory_Name__c)) {
            throw new AuraHandledException('Inventory Name is required');
        }

        if(inv.Price__c != null && inv.Price__c < 0) {
            throw new AuraHandledException('Price cannot be negative');
        }

        if(inv.Cost__c != null && inv.Cost__c < 0) {
            throw new AuraHandledException('Cost cannot be negative');
        }
    }
}