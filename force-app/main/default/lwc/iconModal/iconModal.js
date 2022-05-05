import { LightningElement, api, track } from 'lwc';
import retrieveIcons from '@salesforce/apex/IconManager.retrieveIcons';
import DefaultIcons from '@salesforce/resourceUrl/DefaultIcons';

export default class IconModal extends LightningElement {

    @api showModal = false;
    @api currentIcon;
    @api selectLabel;
    @api cancelLabel;
    @api chooseIconLabel;
    @api currentSelectedIcon;
    @track menuItems = [];
    @track icon__Border = "icon__Border";

    // closes the modal window
    closeModal() {
        this.showModal = false;
    }

    @api openModal() {
        // Run this method from parent
        /*console.log("child modal ran");
        console.log(this.currentSelectedIcon);
        setTimeout(this.styleCurrentIcon(), 2000);*/
    }

    // Get the icon name for the selected icon from the modal
    iconSelectedFromModal(event) {
        let parentEl = event.currentTarget.parentElement;
        let prevSelectedElement = this.template.querySelectorAll('.selected');

        for (let i = 0; i < prevSelectedElement.length; i++) {
            prevSelectedElement[i].className = "icon__Border";
        }
        //console.log(parentEl.className);
        parentEl.className += " selected";
        // stores the event
        this.currentIcon = event.currentTarget.getAttribute("title");
    }

    // Choose the icon
    selectIcon() {
        // Creates the event with the data.
        const iconChangeEvent = new CustomEvent("currenticonchange", {
            detail: this.currentIcon
        });
        // Dispatches the event.
        this.dispatchEvent(iconChangeEvent);
        this.closeModal();
    }

    // Style the current Icon
    styleCurrentIcon(){
        try {
            console.log("function called");
            //let node = document.querySelector('[title='+ CSS.escape(this.currentSelectedIcon) +']');
            let node = this.template.querySelectorAll('[data-id="image"]');
            for(let i = 0; i < node.length; i++){
                console.log('classList for ' + i, node[i].key);
                if (i == 4) {
                    node[4].classList.add('selected');
                }
            }
            let parentEl = node.parentElement;
            parentEl.className += " selected";
        } catch (error) {
            console.error(error)
        }
    }

    renderedCallback() {
        //this.styleCurrentIcon();
    }

    // Gets all the icons from static resources
    connectedCallback(){
        try{
            retrieveIcons().then(result => {
                this.populateIconAdapter(result);
            })
        } catch(error){
           console.error(error);
        }
    }

    // Adapter function to populate the icons list
    // get called from the callback function
    populateIconAdapter(result) {
        for (let i = 0; i < result.length; i++) {
            if (i == 0) {
                this.menuItems.push({
                    id: result[i].Id,
                    label: result[i].Name,
                    value: result[i].Id,
                    disabled: false,
                    iconName: `${DefaultIcons + '/' + result[i].Path__c}#logo`,
                    isActivated: true
                });
            } else {
                this.menuItems.push({
                    id: result[i].Id,
                    label: result[i].Name,
                    value: result[i].Id,
                    disabled: false,
                    iconName: `${DefaultIcons + '/' + result[i].Path__c}#logo`,
                    isActivated: false
                });
            }
        }
        console.log("the title "+this.menuItems[0].iconName);
    }
}