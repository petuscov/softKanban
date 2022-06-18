import { api, LightningElement } from 'lwc';

export default class SoftTextArea extends LightningElement {

    @api
    text;

    isBeingEdited;

    connectedCallback(){}


    setEditing(){
        this.isBeingEdited = true;
    }

    handleChange(e){
        this.text = e.target.value;
        var changeEvent = new CustomEvent('textchange', {detail: {value: this.text}});
        this.dispatchEvent(changeEvent);
    }

    setNotEditing(){
        this.isBeingEdited = false;
    }
}