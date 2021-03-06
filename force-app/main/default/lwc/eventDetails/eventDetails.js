/**
 * @description       : 
 * @author            : Anna Makhovskaya
 * @group             : 
 * @last modified on  : 11-15-2021
 * @last modified by  : Anna Makhovskaya
**/
import { LightningElement, api, track } from 'lwc';
import getSpeakers from '@salesforce/apex/EventDetailController.getSpeakers';
import getLocationDetails from '@salesforce/apex/EventDetailController.getLocationDetails';
import getAttendees from '@salesforce/apex/EventDetailController.getAttendees';

import { NavigationMixin } from 'lightning/navigation';
import { encodeDefaultFieldValues } from 'lightning/pageReferenceUtils';

import userId from '@salesforce/user/Id';
import { getRecord } from "lightning/uiRecordApi";
import profile from "@salesforce/schema/User.Profile.Name";

const columns = [
    { label: 'Name', fieldName: 'Name', cellAttributes: { iconName: 'standard:user', iconPosition: 'left' } },
    { label: 'Email', fieldName: 'Email', type: 'email' },
    { label: 'Phone', fieldName: 'Phone', type: 'phone' },
    { label: 'Company Name', fieldName: 'CompanyName' }
];

const columnsAtt = [
    { label: 'Name', fieldName: 'Name', cellAttributes: { iconName: 'standard:user', iconPosition: 'left' } },
    { label: 'Email', fieldName: 'Email', type: 'email' },
    { label: 'Company Name', fieldName: 'CompanyName' },
    { label: 'Location', fieldName: 'Location', cellAttributes: { iconName: 'utility:location', iconPosition: 'left' } },

];

export default class EventDetails extends NavigationMixin(LightningElement) {
    @api recordId;
    @track speakerList;
    @track attendeesList;
    @track eventRec;
    errors;
    columnsList = columns;
    columnsAtt = columnsAtt;


    handleSpeakerActive() {
        getSpeakers({
            eventId: this.recordId
        }).then(result => {

            result.forEach(speaker => {
                speaker.Name = speaker.Speaker__r.Name;
                speaker.Email = "*********@gmail.com";//speaker.Speaker__r.Email__c;
                speaker.Phone = speaker.Speaker__r.Phone__c;
                speaker.Picture__c = speaker.Speaker__r.Picture__c;
                speaker.About_Me__c = speaker.Speaker__r.About_Me__c;
                speaker.CompanyName = speaker.Speaker__r.Company__c;
            });
            //console.log('result: ', JSON.parse(JSON.stringify(result)));
            this.speakerList = result;

            this.errors = undefined;
        }).catch((err) => {
            this.speakerList = undefined;
            this.errors = err;
        });
    }

    handleLocationDetails() {
        getLocationDetails({
            eventId: this.recordId
        }).then(result => {
            if (result.Location__c) {
                this.eventRec = result;
            } else {
                this.errors = undefined;
            }
        }).catch((err) => {
            this.eventRec = undefined;
            this.errors = err;
        });
    }


    handleAttendee() {
        getAttendees({
            eventId: this.recordId
        }).then(result => {
            result.forEach(att => {
                att.Name = att.Attendee__r.Name;
                att.Email = "*********@gmail.com";//att.Attendee__r.Email__c;
                att.CompanyName = att.Attendee__r.Company_Name__c;
                if (att.Attendee__r.Location__c) {
                    att.Location = att.Attendee__r.Location__r.Name;
                } else {
                    att.Location = 'Preferred Not to Say';
                }
            });

            this.attendeesList = result;
            this.errors = undefined;

        }).catch((err) => {
            this.attendeesList = undefined;
            this.errors = err;
        });
    }

    createSpeaker() {
        const defaultValues = encodeDefaultFieldValues({
            Event__c: this.recordId
        });
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'EventSpeakers__c',
                actionName: "new"
            }, state: {
                defaultFieldValues: defaultValues
            }
        });
    }

    createAttendee() {
        const defaultValues = encodeDefaultFieldValues({
            Event__c: this.recordId
        });
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Event_Attendee__c',
                actionName: "new"
            }, state: {
                defaultFieldValues: defaultValues
            }
        });
    }

}