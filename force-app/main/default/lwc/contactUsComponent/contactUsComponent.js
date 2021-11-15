/**
 * @description       : 
 * @author            : Anna Makhovskaya
 * @group             : 
 * @last modified on  : 11-15-2021
 * @last modified by  : Anna Makhovskaya
**/
import { LightningElement, api } from 'lwc';
import recordResponse from '@salesforce/apex/ContactUsService.recordResponse';

export default class ContactUsComponent extends LightningElement {

    __emailMessage = {};
    @api eventId;
    @api organizerEmail;
    @api organizerOwner; // owner

    __isSpinnerActive = false;

    handleChange(event) {
        const field = event.target.name;
        const value = event.target.value;
        this.__emailMessage[field] = value;
    }

    handleCancel(event) {
        event.preventDefault();
        this.dispatchEvent(new CustomEvent('cancel', {}));
    }

    handleSend(event) {
        event.preventDefault();

        if (this.validateInput()) {
            this.__isSpinnerActive = true;

            recordResponse({
                paramsMap: this.__emailMessage,
                emailAddress: this.organizerEmail,
                ownerId: this.organizerOwner,
                eventId: this.eventId
            })
                .then(result => {
                    this.dispatchEvent(new CustomEvent('success', {
                        detail: 'success'
                    }));
                })
                .catch(error => {
                    console.error('Error: ', error)
                })
                .finally(() => {
                    this.__isSpinnerActive = false;
                });
        }
    }

    validateInput() {
        const allValid = [...this.template.querySelectorAll('lightning-input')]
            .reduce((validSoFar, inputCmp) => {
                inputCmp.reportValidity();
                return validSoFar && inputCmp.checkValidity();
            }, true);

        const allValidMessage = [...this.template.querySelectorAll('lightning-textarea')]
            .reduce((validSoFar, inputCmp) => {
                inputCmp.reportValidity();
                return validSoFar && inputCmp.checkValidity();
            }, true);

        return allValid && allValidMessage;
    }
}