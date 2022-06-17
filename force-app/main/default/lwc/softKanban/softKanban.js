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

    draggingItem;
    draggingCount;

    async connectedCallback()
    {
        this.oppsByStage = await getOppotunitiesByStage();
        this.groupedOpportunities = this.buildOpptiesArr(this.oppsByStage);

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
            console.log('add new opp in stage named: ');
            console.log(event.target.dataset.stage);
        }
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