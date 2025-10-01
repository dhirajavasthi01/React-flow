import { useRecoilState } from 'recoil';
import { nanoid } from 'nanoid';
import { templatesStateAtom } from '../pages/network/store';

/**
 * Custom hook for managing template operations
 * Provides functions to save, delete, and manage templates
 */
export const useTemplateManager = () => {
  const [templates, setTemplates] = useRecoilState(templatesStateAtom);

  /**
   * Save selected nodes and edges as a template
   * @param {string} name - Name for the template
   * @param {Array} nodes - Selected nodes to save
   * @param {Array} edges - Selected edges to save
   * @returns {Object} The created template object
   */
  const saveTemplate = (name, nodes, edges) => {
    if (!name || !nodes || nodes.length === 0) {
      throw new Error('Template name and at least one node are required');
    }

    // Deep clone nodes/edges to decouple future mutations
    const deepClone = (obj) => JSON.parse(JSON.stringify(obj));
    const safeNodes = deepClone(nodes);
    const safeEdges = deepClone(edges || []);

    const template = {
      id: nanoid(),
      name: name.trim(),
      nodes: safeNodes,
      edges: safeEdges,
      createdAt: new Date().toISOString()
    };

    setTemplates(prevTemplates => {
      // Check if template name already exists
      const existingTemplate = prevTemplates.find(t => t.name === template.name);
      if (existingTemplate) {
        throw new Error(`Template with name "${template.name}" already exists`);
      }
      
      return [...prevTemplates, template];
    });

    return template;
  };

  /**
   * Delete a template by ID
   * @param {string} templateId - ID of the template to delete
   */
  const deleteTemplate = (templateId) => {
    setTemplates(prevTemplates => 
      prevTemplates.filter(template => template.id !== templateId)
    );
  };

  /**
   * Get a template by ID
   * @param {string} templateId - ID of the template to retrieve
   * @returns {Object|null} The template object or null if not found
   */
  const getTemplate = (templateId) => {
    return templates.find(template => template.id === templateId) || null;
  };

  /**
   * Update template name
   * @param {string} templateId - ID of the template to update
   * @param {string} newName - New name for the template
   */
  const renameTemplate = (templateId, newName) => {
    if (!newName || !newName.trim()) {
      throw new Error('Template name cannot be empty');
    }

    setTemplates(prevTemplates => 
      prevTemplates.map(template => 
        template.id === templateId 
          ? { ...template, name: newName.trim() }
          : template
      )
    );
  };

  /**
   * Duplicate an existing template
   * @param {string} templateId - ID of the template to duplicate
   * @param {string} newName - Name for the duplicated template
   * @returns {Object} The duplicated template object
   */
  const duplicateTemplate = (templateId, newName) => {
    const originalTemplate = getTemplate(templateId);
    if (!originalTemplate) {
      throw new Error('Template not found');
    }

    const duplicatedTemplate = {
      ...originalTemplate,
      id: nanoid(),
      name: newName || `${originalTemplate.name} (Copy)`,
      createdAt: new Date().toISOString()
    };

    setTemplates(prevTemplates => [...prevTemplates, duplicatedTemplate]);
    return duplicatedTemplate;
  };

  return {
    templates,
    saveTemplate,
    deleteTemplate,
    getTemplate,
    renameTemplate,
    duplicateTemplate
  };
};

