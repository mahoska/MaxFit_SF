/**
 * @description       : 
 * @author            : Anna Makhovskaya
 * @group             : 
 * @last modified on  : 11-08-2021
 * @last modified by  : Anna Makhovskaya
**/
import { LightningElement, api } from 'lwc';
import EVENT_LOGO from '@salesforce/resourceUrl/eventImg';

export default class EventTile extends LightningElement {
    @api event;
    eventLogoUrl = EVENT_LOGO;

    handleClick(event) {
        event.preventDefault();
        this.dispatchEvent(new CustomEvent('select', {
            detail: {
                eventId: this.event.Id
            }
        }));
    }
}