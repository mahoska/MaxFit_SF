/**
 * @description       : 
 * @author            : Anna Makhovskaya
 * @group             : 
 * @last modified on  : 11-11-2021
 * @last modified by  : Anna Makhovskaya
**/
import { LightningElement, wire } from 'lwc';
import fetchFooterContent from '@salesforce/apex/FooterComponentService.fetchFooterContent';

export default class FooterComponent extends LightningElement {

    __footerContents;
    __errors;

    @wire(fetchFooterContent)
    wireData({ error, data }) {
        if (data) {
            console.log('footer content=> ', data);
            this.__footerContents = data;
            this.__errors = undefined;
        } else if (error) {
            console.error('footer content error=> ', JSON.stringify(error));
            this.__footerContents = undefined;
            this.__errors = error;
        }
    }
}