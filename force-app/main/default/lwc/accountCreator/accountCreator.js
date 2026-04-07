import { LightningElement, track, wire } from 'lwc';
import createAccount from '@salesforce/apex/AccountController.createAccount';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';

import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';

export default class AccountCreator extends LightningElement {

    @track showForm = false;
    @track industryOptions = [];

    @track account = {
        Name: '',
        AccountNumber: '',
        Industry: ''
    };

    // 🔹 Get Object Info
    @wire(getObjectInfo, { objectApiName: ACCOUNT_OBJECT })
    objectInfo;

    get recordTypeId() {
        return this.objectInfo?.data?.defaultRecordTypeId;
    }

    // 🔹 Get Industry Picklist
    @wire(getPicklistValues, {
        recordTypeId: '$recordTypeId',
        fieldApiName: INDUSTRY_FIELD
    })
    industryPicklist({ error, data }) {
        if (data) {
            this.industryOptions = data.values.map(opt => ({
                label: opt.label,
                value: opt.value
            }));
        } else if (error) {
            console.error('Industry picklist error:', error);
        }
    }

    // 🔹 UI Handlers
    handleToggle() {
        this.showForm = true;
    }

    handleCancel() {
        this.showForm = false;
        this.resetForm();
    }

    handleChange(event) {
        const field = event.target.dataset.field;
        this.account[field] = event.target.value;
    }

    handleSave() {

        // Frontend validation
        if (!this.account.Name ) {
            this.showToast('Error', 'Name is required', 'error');
            return;
        }

        createAccount({ acc: this.account })
            .then(() => {
                this.showToast('Success', 'Account created successfully', 'success');
                this.showForm = false;
                this.resetForm();
            })
            .catch(error => {
                this.handleError(error);
            });
    }

    resetForm() {
        this.account = {
            Name: '',
            AccountNumber: '',
            Industry: ''
        };
    }

    handleError(error) {
        let message = 'Unknown error';

        if (error.body?.fieldErrors) {
            message = Object.values(error.body.fieldErrors)
                .map(fe => fe.map(e => e.message).join(', '))
                .join(', ');
        } 
        else if (error.body?.pageErrors?.length) {
            message = error.body.pageErrors.map(e => e.message).join(', ');
        } 
        else if (error.body?.message) {
            message = error.body.message;
        } 
        else if (error.message) {
            message = error.message;
        }

        this.showToast('Error', message, 'error');
        console.error(error);
    }

    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({ title, message, variant })
        );
    }
}