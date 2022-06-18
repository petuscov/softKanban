import { LightningElement, wire } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import STAGE_NAME_FIELD from '@salesforce/schema/Opportunity.StageName';
import getStageApiValuesByName from '@salesforce/apex/KanbanController.getStageApiValuesByName';
import getOppotunitiesByStage from '@salesforce/apex/KanbanController.getOppotunitiesByStage';
import setOppotunityStage from '@salesforce/apex/KanbanController.setOppotunityStage';

export default class SoftKanban extends LightningElement {

    // doesnt work for null rt.
    // @wire(getPicklistValues, { recordTypeId: '006000000000000AAA', fieldApiName: STAGE_NAME_FIELD })
    // stagesMap;

    groupedOpportunities = [];
    oppsByStage = {};
    showModal= false;
    selectedOpptyId;
    selectedOpptyName;
    selectedOpptyDescription;
    selectedOpptyStage;

    // event util vars.
    draggingItem;
    draggingCount;
    prevClickTimestamp;

    async connectedCallback()
    {
        await this.retrieveOppties();

        console.log(this.groupedOpportunities);
    }

    hideModal(e){
        this.showModal = false;
    }

    buildOpptiesArr(oppsByStage){
        let groupedOpportunities = [];
        
        Object.keys(oppsByStage).forEach(stage=>{
            var newGroup = oppsByStage[stage];
            newGroup.stage = stage;

            groupedOpportunities.push(newGroup);
        });

        return groupedOpportunities;
    }

    handleAdd(event){
        if(event.target.dataset.stage){
            this.openOpptyModal({Id: undefined, Name: 'Name', Description: 'Description...', Stage: event.target.dataset.stage});
        }
    }

    handleClick(e){
        var delta = new Date(new Date().getTime() - this.prevClickTimestamp); 
        if(delta < 500){ // doble click.
            var opptyNode = e.target;
            while(opptyNode && !opptyNode.dataset.id){opptyNode = opptyNode.parentNode; }

            this.openOpptyModal({Id: opptyNode.dataset.id, Name: opptyNode.dataset.name, Description: opptyNode.dataset.description});
        }else{
            this.prevClickTimestamp = new Date().getTime();
        }
    }

    openOpptyModal(opptyData){
        this.selectedOpptyId = opptyData.Id;
        this.selectedOpptyName = opptyData.Name;
        this.selectedOpptyDescription = opptyData.Description;
        this.selectedOpptyStage = opptyData.Stage;
        this.showModal = true;
    }

    async retrieveOppties(){
        this.oppsByStage = await getOppotunitiesByStage();
        this.groupedOpportunities = this.buildOpptiesArr(this.oppsByStage);
    }

    /** DRAG EVENTS **/

    handleDragStart(e) {
        e.target.style.opacity = '0.4';
        this.draggingItem = e.target;
    }

    handleDragEnd(e) {
        e.target.style.opacity = '1';
        this.draggingItem = undefined;
        if(this.prevContainerNode){
            this.prevContainerNode.classList.remove('drop-over');
        }
    }

    // FIRING ORDER: enter -> leave
    handleDragEnter(e) {
        e.preventDefault();

        var dropSectionNode = e.target;
        while(dropSectionNode && !dropSectionNode.dataset.dropStage){dropSectionNode = dropSectionNode.parentNode; }
        
        if(dropSectionNode && dropSectionNode.dataset.dropStage && this.draggingItem.dataset.stage !== dropSectionNode.dataset.dropStage){
            if(this.prevContainerNode){
                this.prevContainerNode.classList.remove('drop-over');
            }
            
            dropSectionNode.classList.add('drop-over');
            this.prevContainerNode = dropSectionNode;
        }
    }

    handleDragOver(e) {
        e.preventDefault();
        return false;
    }

    handleDragLeave(e) {
        // var dropSectionNode = e.target;
        // while(dropSectionNode && !dropSectionNode.dataset.dropStage){dropSectionNode = dropSectionNode.parentNode; }

        // if(!dropSectionNode || !dropSectionNode.dataset.dropStage){
        //     this.prevContainerNode.classList.remove('drop-over');
        // }
    }

    async handleDrop(e) {
        e.stopPropagation();

        var previousStage = this.draggingItem.dataset.stage;
        var opptyId = this.draggingItem.dataset.id;
        var opptyObject;

        var dropSectionNode = e.target;
        while(dropSectionNode && !dropSectionNode.dataset.dropStage){dropSectionNode = dropSectionNode.parentNode; }

        if(dropSectionNode && dropSectionNode.dataset.dropStage){
            await setOppotunityStage({opptyId: opptyId, newStage: dropSectionNode.dataset.dropStage});
            
            this.oppsByStage[previousStage] = this.oppsByStage[previousStage].filter(opp=>{
                if(opp.Id === opptyId){
                    opptyObject = opp;
                    return false;
                }
                return true;
            });
            
            this.oppsByStage[dropSectionNode.dataset.dropStage].push(opptyObject);

            this.groupedOpportunities = this.buildOpptiesArr(this.oppsByStage);
        }
    }

    /** DRAG EVENTS **/

}