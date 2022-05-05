import { LightningElement , api, wire,track  } from 'lwc';
import CASE_STAGE_NUMBER from '@salesforce/schema/Case.Case_Stage_Number__c';
import CREATED_DATE_TIME from '@salesforce/schema/Case.CreatedDate';
import ICONS_AGE_5_HOURS from '@salesforce/schema/Case.Icons_Age_5_Hours__c';
import { getRecord } from 'lightning/uiRecordApi';
import getNumberOfActiveStages from '@salesforce/apex/CaseTracerUtil.getNumberOfActiveStages';
import getPreferenceData from '@salesforce/apex/CaseTracerUtil.getPreferenceData';
import clearTimer from '@salesforce/apex/CaseTracerUtil.clearTimer';
import setTimer from '@salesforce/apex/CaseTracerUtil.setTimer';

const FIELDS = [CREATED_DATE_TIME,CASE_STAGE_NUMBER,ICONS_AGE_5_HOURS];
export default class CaseTimer extends LightningElement {
    @api recordId;
    displayValue;
    createdDate;
    createdDateParsed;
    cDisplayText;
    durrentDate;
    elapsedTime;
    minutes;
    color;
    AgeTotalHour= 2;
    currentStage = 0;
    totalStage = 0;
    preferance={
        AgeOneColor: '',
        AgeTwoColor: '',
        AgeThreeColor: '',
        AgeFourColor: '',
        AgeFiveColor: '',
        AgeOneHour: 0,
        AgeTwoHour: 0,
        AgeThreeHour: 0,
        AgeFourHour: 0,
        AgeFiveHour: 0,
        AgeOneActive: false,
        AgeTwoActive: false,
        AgeThreeActive: false,
        AgeFourActive: false,
        AgeFiveActive: false,
    };
    clearClockButtonVisible = true;
    setClockButtonVisible = false;
    iconAgeFiveHours;

    // Call apex class and get recordId related data
    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    initData({ error, data }) {
        if (data) {
            this.currentStage = data.fields.Case_Stage_Number__c.value;
            console.log('currentStage:', this.currentStage);
            this.iconAgeFiveHours = data.fields.Icons_Age_5_Hours__c.value;
            this.displayValue = data.fields.CreatedDate.displayValue;
            this.createdDate = (data.fields.CreatedDate.value);
            // this.createdDate.toLocaleDateString('en-us', {month:"short", day: "numeric", year:"numeric", });
             console.log('created Date:', this.createdDate);
            // this.createdDate.setHours(this.createdDate.getHours() + this.iconAgeFiveHours);
            // console.log('created Date:', this.createdDate);
            this.createddatechild = Date.parse(data.fields.CreatedDate.value);
            // this.createdDateParsed.toLocaleDateString('en-us', {month:"short", day: "numeric",  time:"short", year:"numeric", });
            console.log('created Date parsed:', this.createdDateParsed);
            const date = new Date('Sept 24, 22 13:20:18').toLocaleDateString('en-us', {month:"short", day: "numeric",  year:"numeric",hour: "2-digit", minute: "2-digit" });
            console.log('date',date);
            console.log('now date', Date.now());
            this.displayText = 'Created on ' + this.displayValue;
            this.currentDate = new Date();
            // console.log('currentDate', $A.localizationService.formatDate(currentDate));
            // this.formattedDate = new Intl.DateTimeFormat(DATE_TIME).format(this.currentDate);
            // console.log('formattedDate',this.formattedDate);
            let seconds = (this.currentDate.getTime() - this.createdDateParsed) / 1000;
            let timeString = this.findTime(seconds);
            this.displayText = timeString;
            this.getPrefData();
            this.getTotalStage();
        } else if (error) {
            console.error('Error:', error);
        }
    }



    // Time calculation based on seconds
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
        const arr = str.trim().split(' ')
        return arr.join(' ').replace(',', '');
     }

     // Get custom settings data
    getPrefData(){
        getPreferenceData()
        .then(result => {
            this.contacts = result;
            this.preferance.AgeOneColor=this.contacts[0].Age_1_Hex__c;
            this.preferance.AgeTwoColor=this.contacts[0].Age_2_Hex__c;
            this.preferance.AgeThreeColor=this.contacts[0].Age_3_Hex__c;
            this.preferance.AgeFourColor=this.contacts[0].Age_4_Hex__c;
            this.preferance.AgeFiveColor=this.contacts[0].Age_5_Hex__c;
            this.preferance.AgeOneHour=this.contacts[0].Age_1_Hours__c;
            this.preferance.AgeTwoHour=this.contacts[0].Age_2_Hours__c;
            this.preferance.AgeThreeHour=this.contacts[0].Age_3_Hours__c;
            this.preferance.AgeFourHour=this.contacts[0].Age_4_Hours__c;
            this.preferance.AgeFiveHour=this.contacts[0].Age_5_Hours__c;
            this.preferance.AgeOneActive=this.contacts[0].Age_1_Show__c;
            this.preferance.AgeTwoActive=this.contacts[0].Age_2_Show__c;
            this.preferance.AgeThreeActive=this.contacts[0].Age_3_Show__c;
            this.preferance.AgeFourActive=this.contacts[0].Age_4_Show__c;
            this.preferance.AgeFiveActive=this.contacts[0].Age_5_Show__c;
        })
        .catch(error => {
            this.error = error;
        });
    }

    // Get total active stage number
    getTotalStage(){
        getNumberOfActiveStages()
            .then(result => {
            this.totalStage = result;
            console.log('totalStage', this.totalStage);
            if(this.totalStage!=null && this.currentStage!=null){
                this.showClockColor();
            }
        })
        .catch(error => {
            this.error = error;
        });
    }

    // Show clock color
    showClockColor(){
        if (this.currentStage === 1 && this.totalStage === 2) {
            this.color = `conic-gradient(${this.preferance.AgeOneColor} 50%, white 0, white)`;
        } else if (this.currentStage === 2 && this.totalStage === 2) {
            this.color = `conic-gradient(${this.preferance.AgeTwoColor} 100%, white 0, white)`;
        } else if (this.currentStage === 1 && this.totalStage === 3) {
            this.color = `conic-gradient(${this.preferance.AgeOneColor} 33%, white 0, white)`;
        } else if (this.currentStage === 2 && this.totalStage === 3){
            this.color = `conic-gradient(${this.preferance.AgeTwoColor} 66%, white 0, white)`;
        } else if (this.currentStage === 3 && this.totalStage === 3) {
            this.color = `conic-gradient(${this.preferance.AgeThreeColor} 100%, white 0, white)`;
        } else if (this.currentStage === 1 && this.totalStage === 4) {
            this.color = `conic-gradient(${this.preferance.AgeOneColor} 25%, white 0, white)`;
        } else if (this.currentStage === 2 && this.totalStage === 4) {
            this.color = `conic-gradient(${this.preferance.AgeTwoColor} 50%, white 0, white)`;
        } else if (this.currentStage === 3 && this.totalStage === 4){
            this.color = `conic-gradient(${this.preferance.AgeThreeColor} 75%, white 0, white)`;
        } else if (this.currentStage === 4 && this.totalStage === 4){
            console.log('total stage 4', this.totalStage);
            this.color = `conic-gradient(${this.preferance.AgeFourColor} 100%, white 0, white)`;
        } else if (this.currentStage === 1 && this.totalStage === 5) {
            this.color = `conic-gradient(${this.preferance.AgeOneColor} 20%, white 0, white)`;
        } else if (this.currentStage === 2 && this.totalStage === 5) {
            this.color = `conic-gradient(${this.preferance.AgeTwoColor} 40%, white 0, white)`;
        } else if (this.currentStage === 3 && this.totalStage === 5) {
            this.color = `conic-gradient(${this.preferance.AgeThreeColor} 60%, white 0, white)`;
        } else if (this.currentStage === 4 && this.totalStage === 5){
            this.color = `conic-gradient(${this.preferance.AgeFourColor} 80%, white 0, white)`;
        } else if (this.currentStage === 5 && this.totalStage === 5){
            this.color = `conic-gradient(${this.preferance.AgeFiveColor} 100%, white 0, white)`;
        }
        console.log('this.color', this.color)
        this.color = 'conic-gradient(red 80%, white 0, white)';
        this.template.querySelector('c-clock').updateColor(this.color);
    }

    // Call the method when the component inserted into the DOM
    connectedCallback(){
        
    }

    // Clear the clock time
    clearClock(event) {
        this.clearClockButtonVisible = false;
        this.setClockButtonVisible = true;
        clearTimer(this.recordId)
        .then(result => {
            this.contacts = result;
            console.log('contacts:', this.contacts);
        })
        .catch(error => {
            this.error = error;
        });
    }

    //Set the clock time
    setClock(event) {
        this.clearClockButtonVisible = true;
        this.setClockButtonVisible = false;
        setTimer(this.recordId)
        .then(result => {
            this.contacts = result;
            console.log('contacts:', this.contacts);
        })
        .catch(error => {
            this.error = error;
        });
    }
}