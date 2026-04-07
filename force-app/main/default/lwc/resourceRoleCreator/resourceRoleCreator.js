import { LightningElement, track, wire } from 'lwc';
import createResourceRole from '@salesforce/apex/ResourceRoleController.createResourceRole';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getPicklistValues, getObjectInfo } from 'lightning/uiObjectInfoApi';

import BILLING_UNIT_FIELD from '@salesforce/schema/Resource_Role__c.Billing_Unit__c';
import RESOURCE_ROLE_OBJECT from '@salesforce/schema/Resource_Role__c';

export default class ResourceRoleForm extends LightningElement {

    @track showForm = false;
    @track billingUnits = [];

    // 🔹 Get Object Info
    @wire(getObjectInfo, { objectApiName: RESOURCE_ROLE_OBJECT })
    objectInfo;

    // 🔹 Get Record Type Id
    get recordTypeId() {
        return this.objectInfo?.data?.defaultRecordTypeId;
    }

    // 🔹 Get Picklist Values
    @wire(getPicklistValues, { 
        recordTypeId: '$recordTypeId', 
        fieldApiName: BILLING_UNIT_FIELD 
    })
    billingUnitOptions({ error, data }) {
        if (data) {
            this.billingUnits = data.values.map(option => ({
                label: option.label,
                value: option.value
            }));
        } else if (error) {
            console.error('Error fetching billing unit options:', error);
        }
    }

    // 🔹 Resource Object
    @track resource = {
        Resource_Name__c: '',
        Price__c: null,
        Cost__c: null,
        Billing_Unit__c: '',
        Description__c: ''
    };

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
        this.resource[field] = event.target.value;
    }

    // 🔥 Improved Error Handling
    handleSave() {
        createResourceRole({ rr: this.resource })
            .then(() => {
                this.showToast('Success', 'Resource created successfully', 'success');
                this.showForm = false;
                this.resetForm();
            })
            .catch(error => {
                let errorMessage = 'Unknown error';

                if (error.body && error.body.fieldErrors) {
                    const fieldErrors = error.body.fieldErrors;
                    errorMessage = Object.values(fieldErrors)
                        .map(fe => fe.map(e => e.message).join(', '))
                        .join(', ');
                } 
                else if (error.body && error.body.pageErrors && error.body.pageErrors.length > 0) {
                    errorMessage = error.body.pageErrors
                        .map(e => e.message)
                        .join(', ');
                } 
                else if (error.body && error.body.message) {
                    errorMessage = error.body.message;
                } 
                else if (error.message) {
                    errorMessage = error.message;
                }

                this.showToast('Error', errorMessage, 'error');
                console.error('Full Error:', JSON.stringify(error));
            });
    }

    resetForm() {
        this.resource = {
            Resource_Name__c: '',
            Price__c: null,
            Cost__c: null,
            Billing_Unit__c: '',
            Description__c: ''
        };
    }

    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({ title, message, variant })
        );
    }
}