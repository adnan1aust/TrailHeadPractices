import { LightningElement, api, wire } from 'lwc';
import CREATED_DATE_TIME from '@salesforce/schema/Case.CreatedDate';

const FIELDS = [CREATED_DATE_TIME];

export default class Clock extends LightningElement {
    @api recordId;
    displayValue;
    displayText;
    databaseValue;
    currentDate;
    elapsedTime;
    minutes;
    @api css;

    renderedCallback() {
        this.template.querySelector("lightning-card").style.setProperty("--colorgradiant", this.css);
    }

    @api updateColor(color) {
        this.template.querySelector("lightning-card").style.setProperty("--colorgradiant", color);
    }

}