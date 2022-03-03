import { LightningElement, track } from 'lwc';
import BOMB_IMAGE from '@salesforce/resourceUrl/bomb'
import { convertHextoFilter } from 'c/common';

export default class ColorPickerDemo extends LightningElement {
    bombImage = BOMB_IMAGE;
    color;
    css = 'invert(18%) sepia(54%) saturate(3470%) hue-rotate(343deg) brightness(81%) contrast(94%)';
    handleChange(event) {
        try {
            this.color = event.target.value;
            console.log('Selected Color = ' + event.target.value);
            this.css = convertHextoFilter(event.target.value).split(":")[1];
            this.css = this.css.slice(0, -1);
            console.log(this.css);
        }catch (error) {
            console.error(error);
        }
    }

    renderedCallback() {
        console.log('calling rendered  = ' + this.css)
        this.template.querySelector("lightning-card").style.setProperty("--filterval", this.css);
    }

}