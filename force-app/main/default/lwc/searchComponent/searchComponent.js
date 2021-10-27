/**
 * @description       : 
 * @author            : Anna Makhovskaya
 * @group             : 
 * @last modified on  : 10-26-2021
 * @last modified by  : Anna Makhovskaya
**/
import { LightningElement, api } from 'lwc';

export default class Search_Component extends LightningElement {

    searchKeyword;
    @api isrequired = "false";
    @api searchLabel = "Search Account";
    @api showLabl = "true";

    renderedCallback() {
        if (this.isrequired === "false") return;
        if (this.isrequired === "true") {
            let picklistInfo = this.template.querySelector("lightning-input");
            picklistInfo.required = true;
            this.isrequired = "false";
        }
    }

    handleChange(event) {
        var keyword = event.target.value;
        /*create & dispatch  the event to parent component with the search keyword*/
        if (keyword && keyword.length > 2) {
            let searchEvent = new CustomEvent("search", {
                detail: { value: keyword }
            });
            this.dispatchEvent(searchEvent);
        }
    }
}