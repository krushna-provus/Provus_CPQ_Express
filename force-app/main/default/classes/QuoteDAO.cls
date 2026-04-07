public with sharing class QuoteDAO {

    public static Id insertQuote(Quote__c q) {
        insert q;
        return q.Id;
    }

    public static void insertQuoteLines(List<QuoteLineItem__c> lines) {
        insert lines;
    }

    public static void updateQuote(Quote__c q) {
        update q;
    }
}