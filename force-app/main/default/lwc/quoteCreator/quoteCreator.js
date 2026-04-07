import { LightningElement, track, wire } from 'lwc';
import createQuote from '@salesforce/apex/QuoteController.createQuoteWithLines';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';
import getInventories from '@salesforce/apex/InventoryController.getInventories';
import getResourceRoles from '@salesforce/apex/ResourceRoleController.getResourceRoles';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class QuoteCreator extends LightningElement {

    @track isCreatingQuote = false;

    @track quote = {
        Account__c: '',
        Quote_Name__c: '',
        Discount__c: 0
    };

    @track products = [];
    @track resources = [];
    @track addOns = [];

    accountOptions = [];
    productOptions = [];
    addOnOptions = [];
    resourceOptions = [];

    // 🔹 Load Data
    @wire(getAccounts)
    wiredAccounts({ data }) {
        if (data) {
            this.accountOptions = data.map(acc => ({
                label: acc.Name,
                value: acc.Id
            }));
        }
    }

    @wire(getInventories)
    wiredInventory({ data }) {
        if (data) {

            // 🔹 Products
            this.productOptions = data
                .filter(i => i.Type__c === 'Product')
                .map(i => ({
                    label: i.Inventory_Name__c,
                    value: i.Id
                }));

            // 🔹 Add-Ons
            this.addOnOptions = data
                .filter(i => i.Type__c === 'Add-Ons')
                .map(i => ({
                    label: i.Inventory_Name__c,
                    value: i.Id
                }));
        }
    }

    @wire(getResourceRoles)
    wiredResources({ data }) {
        if (data) {
            this.resourceOptions = data.map(r => ({
                label: r.Resource_Name__c,
                value: r.Id
            }));
        }
    }

    // 🔹 Handlers
    handleAccountChange(e) {
        this.quote.Account__c = e.detail.value;
    }

    handleChange(e) {
        this.quote[e.target.dataset.field] = e.target.value;
    }

    // 🔹 New Quote Button
    startNewQuote() {
        this.isCreatingQuote = true;
        this.reset();
    }

    // 🔹 Product Methods
    addProduct() {
        this.products = [...this.products, {
            id: 'prod_' + Date.now() + '_' + Math.random(),
            Line_Item_Type__c: 'Product',
            Inventory__c: '',
            Quantity__c: 1,
            Unit_Price__c: 0,
            Unit_Cost__c: 0
        }];
    }

    removeProduct(e) {
        const id = e.target.dataset.id;
        this.products = this.products.filter(item => String(item.id) !== String(id));
    }

    handleProductChange(e) {
        const id = e.target.dataset.id;
        const field = e.target.dataset.field;
        const item = this.products.find(p => String(p.id) === String(id));
        if (item) {
            item[field] = e.target.value;
            this.products = [...this.products];
        }
    }

    // 🔹 Resource Methods
    addResource() {
        this.resources = [...this.resources, {
            id: 'res_' + Date.now() + '_' + Math.random(),
            Line_Item_Type__c: 'Resource Role',
            Resource_Role__c: '',
            Quantity__c: 1,
            Unit_Price__c: 0,
            Unit_Cost__c: 0
        }];
    }

    removeResource(e) {
        const id = e.target.dataset.id;
        this.resources = this.resources.filter(item => String(item.id) !== String(id));
    }

    handleResourceChange(e) {
        const id = e.target.dataset.id;
        const field = e.target.dataset.field;
        const item = this.resources.find(r => String(r.id) === String(id));
        if (item) {
            item[field] = e.target.value;
            this.resources = [...this.resources];
        }
    }

    // 🔹 Add-Ons Methods
    addAddOn() {
        this.addOns = [...this.addOns, {
            id: 'addon_' + Date.now() + '_' + Math.random(),
            Line_Item_Type__c: 'Add-Ons',
            Inventory__c: '',
            Quantity__c: 1,
            Unit_Price__c: 0,
            Unit_Cost__c: 0
        }];
    }

    removeAddOn(e) {
        const id = e.target.dataset.id;
        this.addOns = this.addOns.filter(item => String(item.id) !== String(id));
    }

    handleAddOnChange(e) {
        const id = e.target.dataset.id;
        const field = e.target.dataset.field;
        const item = this.addOns.find(a => String(a.id) === String(id));
        if (item) {
            item[field] = e.target.value;
            this.addOns = [...this.addOns];
        }
    }

    // 🔥 Calculations
    get subTotal() {
        const productTotal = this.products.reduce((sum, item) => {
            return sum + (item.Quantity__c || 0) * (item.Unit_Price__c || 0);
        }, 0);
        const resourceTotal = this.resources.reduce((sum, item) => {
            return sum + (item.Quantity__c || 0) * (item.Unit_Price__c || 0);
        }, 0);
        const addOnTotal = this.addOns.reduce((sum, item) => {
            return sum + (item.Quantity__c || 0) * (item.Unit_Price__c || 0);
        }, 0);
        return productTotal + resourceTotal + addOnTotal;
    }

    get total() {
        const discount = this.quote.Discount__c || 0;
        return this.subTotal - (this.subTotal * discount / 100);
    }

    // 🔹 Get all line items combined
    get allLineItems() {
        return [
            ...this.products.map(p => {
                const { id, ...rest } = p;
                return { ...rest, Quantity__c: Number(p.Quantity__c), Unit_Price__c: Number(p.Unit_Price__c), Unit_Cost__c: Number(p.Unit_Cost__c) };
            }),
            ...this.resources.map(r => {
                const { id, ...rest } = r;
                return { ...rest, Quantity__c: Number(r.Quantity__c), Unit_Price__c: Number(r.Unit_Price__c), Unit_Cost__c: Number(r.Unit_Cost__c) };
            }),
            ...this.addOns.map(a => {
                const { id, ...rest } = a;
                return { ...rest, Quantity__c: Number(a.Quantity__c), Unit_Price__c: Number(a.Unit_Price__c), Unit_Cost__c: Number(a.Unit_Cost__c) };
            })
        ];
    }

    // 🔥 Save
    handleSave() {

        if (!this.quote.Account__c) {
            this.showToast('Error', 'Account is required', 'error');
            return;
        }

        if (this.allLineItems.length === 0) {
            this.showToast('Error', 'Please add at least one product, resource, or add-on', 'error');
            return;
        }

        const request = {
            quote: this.quote,
            lineItems: this.allLineItems
        };

        createQuote({ requestJson: JSON.stringify(request) })
            .then(() => {
                this.showToast('Success', 'Quote created successfully', 'success');
                this.cancelQuote();
            })
            .catch(error => {
                this.showToast('Error', error.body.message, 'error');
                console.error(error);
            });
    }

    cancelQuote() {
        this.isCreatingQuote = false;
        this.reset();
    }

    reset() {
        this.quote = { Account__c: '', Quote_Name__c: '', Discount__c: 0 };
        this.products = [];
        this.resources = [];
        this.addOns = [];
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}