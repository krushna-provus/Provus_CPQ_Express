public with sharing class QuoteController {

    @AuraEnabled
    public static Id createQuoteWithLines(String requestJson) {
        return QuoteService.createQuoteWithLines(requestJson);
    }

}