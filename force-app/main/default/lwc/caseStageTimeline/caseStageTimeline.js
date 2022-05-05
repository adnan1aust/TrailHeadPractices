import { LightningElement } from 'lwc';
import ARROW_IMAGE from '@salesforce/resourceUrl/arrow';

export default class CaseStageTimeline extends LightningElement {

    arrowIcon = ARROW_IMAGE;
    iconNameOne = 'utility:jump_to_top';
    iconNameTwo = 'utility:jump_to_top';

    toggleVisibility(event) {

        let articleDiv;
        if (event.target.name == 'iconOne') {
            articleDiv = this.template.querySelector('[data-id="articleOne"]');
            if (this.iconNameOne == 'utility:jump_to_top') {
                this.iconNameOne = 'utility:jump_to_bottom';
            } else {
                this.iconNameOne = 'utility:jump_to_top';
            }
        } else {
            articleDiv = this.template.querySelector('[data-id="articleTwo"]');
            if (this.iconNameTwo == 'utility:jump_to_top') {
                this.iconNameTwo = 'utility:jump_to_bottom';
            } else {
                this.iconNameTwo = 'utility:jump_to_top';
            }
        }

        if (articleDiv) {
            if (articleDiv.classList.contains('slds-hide')) {
                articleDiv.classList.remove('slds-hide');
            } else {
                articleDiv.classList.add('slds-hide');
            }
        }
    }
}