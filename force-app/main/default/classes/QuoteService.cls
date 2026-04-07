public with sharing class QuoteService {

    @AuraEnabled
    public static Id createQuoteWithLines(String requestJson) {

        // 🔹 Deserialize JSON
        Map<String, Object> req = (Map<String, Object>) JSON.deserializeUntyped(requestJson);

        Map<String, Object> quoteMap = (Map<String, Object>) req.get('quote');
        List<Object> lineList = (List<Object>) req.get('lineItems');

        // 🔹 Convert to SObject
        Quote__c quote = (Quote__c) JSON.deserialize(JSON.serialize(quoteMap), Quote__c.class);

        if (quote.Account__c == null) {
            throw new AuraHandledException('Account is required');
        }

        // 🔹 Insert Quote
        insert quote;

        Decimal subTotal = 0;
        Decimal totalCost = 0;
        List<QuoteLineItem__c> linesToInsert = new List<QuoteLineItem__c>();

        for (Object obj : lineList) {

            Map<String, Object> lineMap = (Map<String, Object>) obj;

            QuoteLineItem__c line =
                (QuoteLineItem__c) JSON.deserialize(JSON.serialize(lineMap), QuoteLineItem__c.class);

            line.Quote__c = quote.Id;

            Decimal qty = line.Quantity__c != null ? line.Quantity__c : 1;
            Decimal price = line.Unit_Price__c != null ? line.Unit_Price__c : 0;
            Decimal cost = line.Unit_Cost__c != null ? line.Unit_Cost__c : 0;

            // 🔥 Total
            line.Total__c = qty * price;

            // 🔥 Margin
            if (price > 0) {
                line.Margin_Percent__c = ((price - cost) / price) * 100;
            }

            subTotal += line.Total__c;
            totalCost += qty * cost;
            linesToInsert.add(line);
        }

        insert linesToInsert;

        // 🔥 Quote totals
        Decimal discount = quote.Discount__c != null ? quote.Discount__c : 0;
        Decimal discountAmount = subTotal * (discount / 100);
        Decimal total = subTotal - discountAmount;

        quote.SubTotal__c = subTotal;
        quote.Total__c = total;

        // 🔥 Quote Margin Percent
        if (subTotal > 0) {
            quote.Margin__c = ((subTotal - totalCost) / subTotal) * 100;
        }

        update quote;

        return quote.Id;
    }
}