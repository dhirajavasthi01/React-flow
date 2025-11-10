import { HttpClient } from "../api/HttpClient";

export async function saveTemplate(templateData){
    try{
        const url = `${process.env.REACT_APP_API_URL}/templates`;
        const body = {
            name: templateData.name,
            nodes: templateData.nodes,
            edges: templateData.edges,
            createdAt: templateData.createdAt,
            modifiedOn: templateData.modifiedOn || new Date().toISOString()
        };
        return await HttpClient.post(url, body);
    }catch(error){
        console.error('Error saving template:', error);
        throw error;
    }
}

export async function getTemplates(){
    try{
        const url = `${process.env.REACT_APP_API_URL}/templates`;
        return await HttpClient.get(url);
    }catch(error){
        console.error('Error fetching templates:', error);
        throw error;
    }
}

export async function getTemplateById(templateId){
    try{
        const url = `${process.env.REACT_APP_API_URL}/templates/${templateId}`;
        return await HttpClient.get(url);
    }catch(error){
        console.error('Error fetching template:', error);
        throw error;
    }
}

export async function updateTemplate(templateId, templateData){
    try{
        const url = `${process.env.REACT_APP_API_URL}/templates/${templateId}`;
        const body = {
            name: templateData.name,
            nodes: templateData.nodes,
            edges: templateData.edges,
            createdAt: templateData.createdAt,
            modifiedOn: templateData.modifiedOn || new Date().toISOString()
        };
        return await HttpClient.put(url, body);
    }catch(error){
        console.error('Error updating template:', error);
        throw error;
    }
}

export async function deleteTemplate(templateId){
    try{
        const url = `${process.env.REACT_APP_API_URL}/templates/${templateId}`;
        return await HttpClient.delete(url);
    }catch(error){
        console.error('Error deleting template:', error);
        throw error;
    }
}
