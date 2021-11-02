/**
 * @description       : 
 * @author            : Anna Makhovskaya
 * @group             : 
 * @last modified on  : 11-02-2021
 * @last modified by  : Anna Makhovskaya
**/
import { LightningElement, api, track } from 'lwc';
import upcomingEvents from '@salesforce/apex/AttendeeEventsService.upcomingEvents';
import pastEvents from "@salesforce/apex/AttendeeEventsService.pastEvents";

const columns = [
    { label: 'Event Name', fieldName: 'detailsPage', type: 'url', wrapText: 'true', typeAttributes: { label: { fieldName: 'Name' } } },
    { label: 'Name', fieldName: 'EVNTORG', cellAttributes: { iconName: 'standard:user', iconPosition: 'left' } },
    { label: 'Event Date', fieldName: 'StartDateTime', type: 'date', typeAttributes: { weekday: "long", year: "numeric", month: "long" } },
    { label: 'Location', fieldName: 'Location', type: 'text', cellAttributes: { iconName: 'utility:location', iconPosition: 'left' } },

];

export default class AttendeeEvents extends LightningElement {

    @api recordId;
    @track events;
    @track past_events;
    errors;
    columnsList = columns;


    connectedCallback() {
        this.upcomingEventsFromApex();
        this.pastEvetsFromApex();
    }

    upcomingEventsFromApex() {
        upcomingEvents({
            attendeeId: this.recordId
        })
            .then(result => {
                result.forEach(record => {
                    record.Name = record.Event__r.Name__c;
                    record.detailsPage = "https://" + window.location.host + "/" + record.Event__c;
                    record.EVNTORG = record.Event__r.Event_Organizer__r.Name;
                    record.StartDateTime = record.Event__r.Start_DateTime__c;
                    if (record.Event__r.Location__c) {
                        record.Location = record.Event__r.Location__r.Name;
                    } else {
                        record.Location = "This is a Virtual Event";
                    }
                })
                this.events = result;
                //console.log('result: ', result);
                this.errors = undefined;
            }).catch(error => {
                //console.error('error:', error);
                this.events = undefined;
                this.errors = JSON.stringify(error);
            });
    }

    pastEvetsFromApex() {
        pastEvents({
            attendeeId: this.recordId
        })
            .then((result) => {
                //window.console.log(" past_events ", result);
                result.forEach((record) => {
                    record.Name = record.Event__r.Name__c;
                    record.detailsPage = "https://" + window.location.host + "/" + record.Event__c;
                    record.EVNTORG = record.Event__r.Event_Organizer__r.Name;
                    record.StartDateTime = record.Event__r.Start_DateTime__c;
                    if (record.Event__r.Location__c) {
                        record.Location = record.Event__r.Location__r.Name;
                    } else {
                        record.Location = "This is a virtual event";
                    }
                });
                this.past_events = result;
                //window.console.log(" result ", result);
                this.errors = undefined;
            })
            .catch((error) => {
                this.events = undefined;
                this.errors = JSON.stringify(error);
            });
    }
}