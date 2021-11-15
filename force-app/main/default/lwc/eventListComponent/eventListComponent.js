/**
 * @description       : 
 * @author            : Anna Makhovskaya
 * @group             : 
 * @last modified on  : 11-09-2021
 * @last modified by  : Anna Makhovskaya
**/
import { LightningElement, wire } from 'lwc';
import fetchUpCommingEvents from '@salesforce/apex/EventListService.fetchUpCommingEvents';
import fetchPastEvents from '@salesforce/apex/EventListService.fetchPastEvents';
import { NavigationMixin } from 'lightning/navigation';

export default class EventListComponent extends NavigationMixin(LightningElement) {

    upCommingEvents;
    pastEvents;
    __errors;
    isSpinner = false;

    @wire(fetchUpCommingEvents)
    wiredUpCommingEventData({ error, data }) {
        if (data) {
            console.log('UpCommingEventData', data);
            this.upCommingEvents = data;
            this.__errors = undefined;

        } else if (error) {
            console.error('Error', error);
            this.upCommingEvents = undefined;
            this.__errors = error;
        }
    }

    @wire(fetchPastEvents)
    wiredPastEventData({ error, data }) {
        if (data) {
            console.log('PastEventData', data);
            this.pastEvents = data;
            this.__errors = undefined;

        } else if (error) {
            console.error('Error', error);
            this.pastEvents = undefined;
            this.__errors = error;
        }
    }

    handleEventClick = event => {
        event.preventDefault();
        let selectedEventId = event.detail.eventId;
        //let selectedEventId = event.currentTarget.dataset.eventId;
        console.log(selectedEventId);
        //data-event-id
        //data-* ~= dataset
        let navigationTarget =
        {
            type: 'comm__namedPage',
            attributes: {
                name: "eventDetails__c"//API name community page
            },
            state: {
                eventId: selectedEventId,
                source: 'eventListPage'
            }
        }

        this[NavigationMixin.Navigate](navigationTarget);
    }
}