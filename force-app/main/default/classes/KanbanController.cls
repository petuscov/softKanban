public with sharing class KanbanController {
    @AuraEnabled
    public static String getOpportunityRecordType(String recordTypeApiName)
    {
        String opptyRecordTypeId = '000000000000000AAA';
        
        if(recordTypeApiName != null)
        {
            // recuperar id en base a recordType apiName.
        }

        return opptyRecordTypeId;
    }

    @AuraEnabled
    public static Map<String, String> getStageApiValuesByName()
    {
        List<Schema.PicklistEntry> stages = Opportunity.StageName.getDescribe().getPicklistValues();
        Map<String, String> stageApiValuesByName = new Map<String, String>();

        for(Schema.PicklistEntry stage : stages)
        {
            stageApiValuesByName.put(stage.getLabel(), stage.getValue());
        }

        return stageApiValuesByName;
    }

    @AuraEnabled
    public static Map<String, List<Opportunity>> getOppotunitiesByStage()
    {
        List<Opportunity> oppties = [SELECT Id, Name, StageName, Description FROM Opportunity LIMIT 50];
        Map<String, List<Opportunity>> opptiesByStage = new Map<String, List<Opportunity>>();

        for(Opportunity opp : oppties)
        {
            if(!opptiesByStage.containsKey(opp.StageName))
            {
                opptiesByStage.put(opp.StageName, new List<Opportunity>());
            }
            opptiesByStage.get(opp.StageName).add(opp);
        }

        return opptiesByStage;
    }


    @AuraEnabled
    public static void setOppotunityStage(Id opptyId, String newStage)
    {
        Opportunity oppty = [SELECT Id, Name, StageName FROM Opportunity WHERE Id = :opptyId];
        oppty.StageName = newStage;

        update oppty;
    }

    @AuraEnabled
    public static void deleteOppotunity(Id opptyId)
    {
        Opportunity oppty = [SELECT Id, Name FROM Opportunity WHERE Id = :opptyId];

        delete oppty;
    }

    
    @AuraEnabled
    public static void upsertOppotunity(Id opptyId, String name, String description, String stage)
    {
        Opportunity oppty;
        if(opptyId != null)
        {
            oppty = [SELECT Id, Name, Description FROM Opportunity WHERE Id = :opptyId];
        }else{
            oppty = new Opportunity();
            oppty.CloseDate = Date.newInstance(2099, 12, 30);
        }
        oppty.Name = name;
        oppty.Description = description;
        if(stage != null){
            oppty.StageName = stage;
        }

        upsert oppty;
    }
}
