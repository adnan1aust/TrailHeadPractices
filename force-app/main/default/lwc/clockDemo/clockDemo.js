import { LightningElement, api, wire } from 'lwc';
import CREATED_DATE_TIME from '@salesforce/schema/Case.CreatedDate';
import { getRecord } from 'lightning/uiRecordApi';

const FIELDS = [CREATED_DATE_TIME];

export default class ClockDemo extends LightningElement {
    @api recordId;
    displayValue;
    displayText;
    databaseValue;
    currentDate;
    elapsedTime;
    minutes;
    css;

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    initData({ error, data }) {
        if (data) {
            //console.log(data)
            this.databaseValue = Date.parse(data.fields.CreatedDate.value);
            this.displayValue = data.fields.CreatedDate.displayValue;
            this.displayText = 'Created on ' + this.displayValue;
            this.currentDate = new Date();
            /*console.log('Current Date ' + this.currentDate.getTime())
            console.log('DatabaseDate ' + this.databaseValue)
            console.log('Seconds ' + (this.currentDate.getTime() - this.databaseValue) / 1000)*/
            let seconds = (this.currentDate.getTime() - this.databaseValue) / 1000;
            let timeString = this.findTime(seconds)
            this.displayText = timeString;

            console.log('minutes ' + this.minutes)
            if (this.minutes < 1) {
                this.css = 'conic-gradient(green 25%, white 0, white';
            } else if (this.minutes > 1 && this.minutes < 2) {
                this.css = 'conic-gradient(yellow 50%, white 0, white';
            } else if (this.minutes > 2 && this.minutes < 3) {
                this.css = 'conic-gradient(pink 75%, white 0, white';
            } else {
                this.css = 'conic-gradient(red 100%, white 0, white';
            }
        } else if (error) {
            console.error('Error:', error);
        }

    }
    renderedCallback() {
        this.template.querySelector("lightning-card").style.setProperty("--colorgradiant", this.css);
    }

    findTime(num){
        if(num < 1){
           return '0'
        };
        const qualifier = num => (num > 1 ? 's' : '')
        const numToStr = (num, unit) => num > 0 ? ` ${num}
        ${unit}${qualifier(num)}` : ''
        const oneMinute = 60;
        const oneHour = oneMinute * 60;
        const oneDay = oneHour * 24;
        const oneYear = oneDay * 365;
        const times = {
           year: ~~(num / oneYear),
           day: ~~((num % oneYear) / oneDay),
           hour: ~~((num % oneDay) / oneHour),
           minute: ~~((num % oneHour) / oneMinute),
           second: Math.round(num % oneMinute),
        };
        this.minutes = ((num % oneHour) / oneMinute);
        let str = '';
        for (let [key, value] of Object.entries(times)) {
           str += numToStr(times[key], key)
        }
        //console.log(str)
        const arr = str.trim().split(' ')
        return arr.join(' ').replace(',', '');
     }

}