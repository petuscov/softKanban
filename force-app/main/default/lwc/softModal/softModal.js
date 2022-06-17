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
        await deleteOppotunity({opptyId: opportunityId});
        closeModal();
    }

    async saveOppty(){
        await upsertOppotunity({opptyId: opportunityId, name: opportunityName, description: opportunityDescription});
        closeModal();
    }

    closeModal(){
        delete this.template;
    }
}