public with sharing class InventoryDAO {

    public static Id insertInventory(Inventory__c inv) {
        insert inv;
        return inv.Id;
    }

    public static List<Inventory__c> getInventories() {
        return [
            SELECT Id, Name, Inventory_Name__c, Type__c, Price__c, Cost__c, Billing_Unit__c
            FROM Inventory__c
        ];
    }
}