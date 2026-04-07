import { LightningElement, track } from 'lwc';
import createAddOn from '@salesforce/apex/InventoryController.createAddOn';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class AddOnsCreator extends LightningElement {

    @track showForm = false;

    @track inventory = {
        Inventory_Name__c: '',
        Price__c: null,
        Cost__c: null,
        Description__c: ''
    };

    handleToggle() {
        this.showForm = true;
    }

    handleCancel() {
        this.showForm = false;
        this.resetForm();
    }

    handleChange(event) {
        const field = event.target.dataset.field;
        this.inventory[field] = event.target.value;
    }

    handleSave() {
        createAddOn({ inv: this.inventory })
            .then(() => {
                this.showToast('Success', 'Add-On created successfully', 'success');
                this.showForm = false;
                this.resetForm();
            })
            .catch(error => {
                this.handleError(error);
            });
    }

    resetForm() {
        this.inventory = {
            Inventory_Name__c: '',
            Price__c: null,
            Cost__c: null,
            Description__c: ''
        };
    }

    handleError(error) {
        let msg = error?.body?.message || 'Error occurred';
        this.showToast('Error', msg, 'error');
        console.error(error);
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}