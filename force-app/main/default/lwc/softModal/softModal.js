import { api, LightningElement } from 'lwc';
import upsertOppotunity from '@salesforce/apex/KanbanController.upsertOppotunity';
import deleteOppotunity from '@salesforce/apex/KanbanController.deleteOppotunity';

export default class SoftModal extends LightningElement {

    @api
    opportunityId;
    hasId;
    @api
    opportunityName;
    @api
    opportunityDescription;
    @api
    opportunityStage;

    connectedCallback(){
        this.hasId = this.opportunityId !== undefined; 
    }

    updateName(e){
        this.opportunityName = e.detail.value;
    }
    updateDescription(e){
        this.opportunityDescription = e.detail.value;   
    }

    async deleteOppty(){
        await deleteOppotunity({opptyId: this.opportunityId});
        this.reretrieveOppties(); // idealmente actuar sobre ui y evitar una nueva petición SOQL.
        this.closeModal();
    }

    async saveOppty(){
        await upsertOppotunity({opptyId: this.opportunityId, name: this.opportunityName, description: this.opportunityDescription, stage: this.opportunityStage});
        this.reretrieveOppties(); // idealmente actuar sobre ui y evitar una nueva petición SOQL.
        this.closeModal();
    }

    closeModal(){
        this.dispatchEvent(new CustomEvent('hidemodal'));
    }

    reretrieveOppties(){
        this.dispatchEvent(new CustomEvent('retrieveoppties'));
    }
}