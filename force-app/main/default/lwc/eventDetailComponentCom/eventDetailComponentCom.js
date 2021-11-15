/**
 * @description       : 
 * @author            : Anna Makhovskaya
 * @group             : 
 * @last modified on  : 11-15-2021
 * @last modified by  : Anna Makhovskaya
**/
import { LightningElement, api, wire, track } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import fetchEventDetails from '@salesforce/apex/EventDetailComponentComService.fetchEventDetails';
import fetchSpeakerDetails from '@salesforce/apex/EventDetailComponentComService.fetchSpeakerDetails';
//import fetchUserInfo from '@salesforce/apex/UserUtility.fetchUserInfo';
import fetchUserType from '@salesforce/apex/UserUtility.fetchUserType';

import SPEAKER_LOGO from '@salesforce/resourceUrl/speakerAvatar';
import ORGANIZER_LOGO from '@salesforce/resourceUrl/organizerAvatar';

import { NavigationMixin } from 'lightning/navigation';
//import isguest from '@salesforce/user/isGuest';
//import userId from '@salesforce/user/Id';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import fetchRsvpList from '@salesforce/apex/EventDetailComponentComService.fetchRsvpList';

export default class EventDetailComponentCom extends NavigationMixin(LightningElement) {

    /*variable to get the url parameters */
    @api eventId; //данный параметр описан в метафайле
    @api source; //данный параметр описан в метафайле
    __currentPageReference;

    /*variable to show spinner*/
    isSpinner = false;

    /*variable to store event details*/
    __speakers;
    __eventDetails;
    __errors;

    /*variable to display the location map */
    @track __mapMarkers = [];

    __speakerLogo = SPEAKER_LOGO;
    __organizerLogo = ORGANIZER_LOGO;

    /*variable to show/hide RSVP Button*/
    __showRsvpButton = false;
    __rsvpCompleted = false;

    //__isGuestUser = isguest;
    //__userId = userId;

    __showModal = false;
    __showContactModal = false;

    /*connectedCallback() {
        console.log('User Info isGuest' + this.__isGuestUser);
        console.log('User Info Id' + this.__userId);
    }*/

    fetchRsvpListJS() {
        fetchRsvpList({
            eventId: this.eventId
        })
            .then(result => {
                if (result && result.length > 0) {
                    this.__rsvpCompleted = true;
                }
            })
            .catch(error => {
                console.error('Error ', error);
            });
    }

    @wire(fetchUserType)
    wiredGuestData({ error, data }) {
        if (data) {
            console.log('User isLoggedIn: ', data);
            if (data) {
                this.__showRsvpButton = true;
            } else {
                this.__showRsvpButton = false;
            }
        } else if (error) {
            console.error('User Name error: ', error);
        }
    }

    /*@wire(fetchUserInfo)
    wiredGuestData({ error, data }) {
        if (data) {
            console.log('User Name: ', data);
            if (data.includes('Site Guest User')) {
                this.__showRsvpButton = true;
            } else {
                this.__showRsvpButton = false;
            }
        } else if (error) {
            console.error('User Name error: ', error);
        }
    }*/


    @wire(CurrentPageReference)
    getCurrentPageReference(pageReference) {
        this.__currentPageReference = pageReference;
        //console.log('pageReference ', this.__currentPageReference);
        //console.log('state ', this.__currentPageReference.state);
        //console.log('eventId ', this.__currentPageReference.state.eventId);

        this.eventId = this.__currentPageReference.state.eventId;
        this.source = this.__currentPageReference.state.source;

        this.fetchEventDetailsJS();
        this.fetchSpeakerDetailsJS();

        this.fetchRsvpListJS();
    }


    fetchEventDetailsJS() {
        this.isSpinner = true;
        fetchEventDetails({
            recordId: this.eventId
        }).then(result => {
            this.__eventDetails = result;

            if (this.__eventDetails.Location__c) {
                this.__mapMarkers.push({
                    location: {
                        Street: this.__eventDetails.Location__r.Street__c,
                        City: this.__eventDetails.Location__r.City__c,
                        Country: this.__eventDetails.Location__r.Country__c,
                        PostalCode: this.__eventDetails.Location__r.Postal_Code__c,
                        State: this.__eventDetails.Location__r.State__c
                    },
                    title: this.__eventDetails.Name__c,
                    description: 'This is the landmark for the location'
                })
            }


            this.__errors = undefined;
            console.log('event details=>' + this.__eventDetails);


        }).catch(error => {
            this.__eventDetails = undefined;
            this.__errors = error;
            console.log('error=>' + JSON.stringify(this.__errors));
        }).finally(() => {
            this.isSpinner = false;
        })
    }


    fetchSpeakerDetailsJS() {
        this.isSpinner = true;
        fetchSpeakerDetails({
            eventRecId: this.eventId
        }).then(result => {
            this.__speakers = result;
            this.__errors = undefined;
            console.log('speakers details=>' + this.__speakers);
        }).catch(error => {
            this.__speakers = undefined;
            this.__errors = error;
            console.log('error=>' + JSON.stringify(this.__errors));
        }).finally(() => {
            this.isSpinner = false;
        })
    }

    handleRSVP() {
        //console.log('in handleRSVP=>');
        this.__showModal = true;
    }

    handleCancel() {
        this.__showModal = false;
    }

    handleContactUs() {
        this.__showContactModal = true;
    }

    handleLoginRedirect() {
        let navigationTarget =
        {
            type: 'comm__namedPage',
            attributes: {
                name: "Login"//API name community page
            }
        }

        this[NavigationMixin.Navigate](navigationTarget);
    }

    handleRsvpSuccess(event) {
        alert('You have successfully registered for the event');
        event.preventDefault();
        this.__showModal = false;
        this.__rsvpCompleted = true;
        /*this.dispatchEvent(new ShowToastEvent({
            title: 'Success!',
            message: 'You have successfully registered for the event',
            variant: 'success'
        }));*/
    }

    handleContactUsSuccess(event) {
        event.preventDefault();
        this.__showContactModal = false;
    }

    handleContactCancel() {
        this.__showContactModal = false;
    }
}