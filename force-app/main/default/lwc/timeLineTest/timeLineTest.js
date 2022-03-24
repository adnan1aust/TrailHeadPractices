import { LightningElement } from 'lwc';
import BOMB_IMAGE from '@salesforce/resourceUrl/bomb'

export default class TimeLineTest extends LightningElement {
    testIcon = BOMB_IMAGE;
    iconName1 = 'utility:jump_to_top';
    iconName2 = 'utility:jump_to_top';

    toggleVisibility(event) {
        console.log('toggle')
        console.log(event.target.name)

        let articleDiv;
        if (event.target.name == 'icon1') {
            articleDiv = this.template.querySelector('[data-id="article1"]');
            if (this.iconName1 == 'utility:jump_to_top') {
                this.iconName1 = 'utility:jump_to_bottom';
            } else {
                this.iconName1 = 'utility:jump_to_top';
            }
        } else {
            articleDiv = this.template.querySelector('[data-id="article2"]');
            if (this.iconName2 == 'utility:jump_to_top') {
                this.iconName1 = 'utility:jump_to_bottom';
            } else {
                this.iconName1 = 'utility:jump_to_top';
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