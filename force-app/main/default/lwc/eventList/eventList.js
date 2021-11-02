/**
 * @description       : 
 * @author            : Anna Makhovskaya
 * @group             : 
 * @last modified on  : 11-02-2021
 * @last modified by  : Anna Makhovskaya
**/
import { LightningElement, track } from 'lwc';
import upcomingEvents from '@salesforce/apex/EventDetailService.upcomingEvents';

const columns = [
    {
        label: 'View', fieldName: 'URL', type: 'url', wrapText: 'true',
        typeAttributes: { label: { fieldName: 'Name__c' }, target: '_self' }
    },
    { label: 'Name', fieldName: 'Name__c', cellAttributes: { iconName: 'standard:event', iconPosition: 'left' } },
    { label: 'Name', fieldName: 'EVNT_ORG', cellAttributes: { iconName: 'standard:user', iconPosition: 'left' } },
    { label: 'Location', fieldName: 'Location', type: 'text', cellAttributes: { iconName: 'utility:location', iconPosition: 'left' } },
    { label: 'Details', fieldName: 'Event_Detail__c', type: 'text', wrapText: 'true' }
];

export default class EventList extends LightningElement {
    columnsList = columns;
    error;
    startdatetime;
    @track result;
    @track recordsToDisplay;

    connectedCallback() {
        this.upcomingEventsFromApex();
    }

    upcomingEventsFromApex() {
        upcomingEvents()
            .then(data => {
                data.forEach(event => {
                    event.URL = "https://" + window.location.host + '/' + event.Id;
                    event.EVNT_ORG = event.Event_Organizer__r.Name;
                    if (event.Location__c) {
                        event.Location = event.Location__r.Name;
                    } else {
                        event.Location = "This is  Virtual Event";
                    }
                });
                this.result = data;
                this.recordsToDisplay = data;
                //console.log("event list:", data);
                this.error = undefined;
            }).catch(err => {
                //console.log("error:", err);
                this.error = JSON.stringify(err);
                this.result = undefined;
            });
    }


    handleSearch(event) {
        let keyword = event.detail.value;

        /*let filteredEvents = [];
        for(let i=0 to result size) {
            if(event.Name.includes(keyword)){
                filteredEvents.push(event);
            }
        }*/
        let filteredEvents = this.result.filter((record, index, arrayobject) => {
            return record.Name__c.toLowerCase().includes(keyword.toLowerCase());
        });

        if (keyword && keyword.length >= 2) {
            this.recordsToDisplay = filteredEvents;
        } else {
            this.recordsToDisplay = this.result;
        }
    }


    handleStartDate(event) {
        let valuedatetime = event.target.value;
        let filteredEvents = this.result.filter((record, index, arrayobject) => {
            return record.Start_DateTime__c >= valuedatetime;
        });
        this.recordsToDisplay = filteredEvents;
    }

    handleLocationSearch(event) {
        let keyword = event.detail.value;

        let filteredEvents = this.result.filter((record, index, arrayobject) => {
            return record.Location.toLowerCase().includes(keyword.toLowerCase());
        });

        if (keyword && keyword.length >= 2) {
            this.recordsToDisplay = filteredEvents;
        } else {
            this.recordsToDisplay = this.result;
        }
    }

}