/**
 * @description       : 
 * @author            : Anna Makhovskaya
 * @group             : 
 * @last modified on  : 10-26-2021
 * @last modified by  : Anna Makhovskaya
**/
import { LightningElement, api } from 'lwc';

export default class RecordList_Component extends LightningElement {
    /* Public Property to pass the single record & iconname */
    @api rec;
    @api iconname = "standard:account";
    @api parentidfield;

    handleSelect() {
        let selectEvent = new CustomEvent("select", {
            detail: {
                selRec: this.rec,
                parent: this.parentidfield
            }
        });
        this.dispatchEvent(selectEvent);
    }

    handleRemove() {
        let selectEvent = new CustomEvent("select", {
            detail: {
                selRec: undefined,
                parent: this.parentidfield
            }
        });
        this.dispatchEvent(selectEvent);
    }
}