import { HttpClient } from "../api/HttpClient";

export async function addFlowDiagram(flowData){
    try{
        const url = `${process.env.REACT_APP_API_URL}/flow-diagrams`;
        const body = {
            nodeJson: flowData.nodeJson,
            edgeJson: flowData.edgeJson,
            saved: flowData.saved,
            createdAt: flowData.createdAt,
            modifiedOn: flowData.modifiedOn
        }
        return await HttpClient.post(url, body);
    }catch(error){
        console.error('Error saving flow diagram:', error);
        throw error;
    }
}

export async function getFlowDiagram(caseId = 1){
    try{
        const url = `${process.env.REACT_APP_API_URL}/flow-diagrams/${caseId}`;
        return await HttpClient.get(url);
    }catch(error){
        console.error('Error fetching flow diagram:', error);
        throw error;
    }
}

export async function updateFlowDiagram(caseId, flowData){
    try{
        const url = `${process.env.REACT_APP_API_URL}/flow-diagrams/${caseId}`;
        const body = {
            nodeJson: flowData.nodeJson,
            edgeJson: flowData.edgeJson,
            saved: flowData.saved,
            createdAt: flowData.createdAt,
            modifiedOn: flowData.modifiedOn
        }
        return await HttpClient.put(url, body);
    }catch(error){
        console.error('Error updating flow diagram:', error);
        throw error;
    }
}

export async function deleteFlowDiagram(diagramId){
    try{
        const url = `${process.env.REACT_APP_API_URL}/flow-diagrams/${diagramId}`;
        return await HttpClient.delete(url);
    }catch(error){
        console.error('Error deleting flow diagram:', error);
        throw error;
    }
}