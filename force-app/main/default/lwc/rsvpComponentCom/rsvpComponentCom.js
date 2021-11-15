/**
 * @description       : 
 * @author            : Anna Makhovskaya
 * @group             : 
 * @last modified on  : 11-12-2021
 * @last modified by  : Anna Makhovskaya
**/
import { LightningElement, api } from 'lwc';
import doRSVP from '@salesforce/apex/RsvpService.doRSVP';

export default class RsvpComponentCom extends LightningElement {

    __rsvpData = {};
    __isSpinner = false;

    @api eventId;

    handleChange(event) {
        const fieldName = event.target.name;
        const fieldValue = event.target.value;
        this.__rsvpData[fieldName] = fieldValue;
    }

    validateInput() {
        const inputFields = this.template.querySelectorAll('lightning-input');
        let isValid = true;
        inputFields.forEach(field => {
            if (field.reportValidity() == false) {
                isValid = false;
            }
        });
        return isValid;
    }

    handleClick(event) {
        event.preventDefault();
        /*if (this.dispatchEvent(new CustomEvent('rsvp', {
            detail: JSON.stringify(this.__rsvpData)
        })));*/
        if (this.validateInput()) {
            //console.log('OUTPUT : ', this.__rsvpData);
            this.__isSpinner = true;
            //make the call to apex class
            doRSVP({
                params: JSON.stringify(this.__rsvpData),
                eventId: this.eventId
            })
                .then(result => {
                    console.log('Result ', result);

                    this.dispatchEvent(new CustomEvent('success'));
                })
                .catch(error => {
                    console.error('Error: ', error);
                })
                .finally(() => {
                    this.__isSpinner = false;
                })
        }
    }

    handleCancel(event) {
        event.preventDefault();
        this.dispatchEvent(new CustomEvent('cancel'));
    }
}