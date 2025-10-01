import { useCallback } from 'react';
import { nanoid } from 'nanoid';
import { useTemplateManager } from './useTemplateManager';

export const useTemplateDrop = () => {
  const { getTemplate } = useTemplateManager();
  const DEBUG_TEMPLATES = false;

  const cloneTemplate = useCallback((templateId, dropPosition, offset = { x: 20, y: 20 }) => {
    const template = getTemplate(templateId);
    if (!template) {
      throw new Error(`Template with ID ${templateId} not found`);
    }

    // Determine the template group's center so we can rebase positions to the drop point
    const positions = (template.nodes || []).map(n => n.position || { x: 0, y: 0 });
    const minX = Math.min(...positions.map(p => p.x));
    const maxX = Math.max(...positions.map(p => p.x));
    const minY = Math.min(...positions.map(p => p.y));
    const maxY = Math.max(...positions.map(p => p.y));
    const center = {
      x: (minX + maxX) / 2,
      y: (minY + maxY) / 2,
    };

    // Create a mapping of old node IDs to new node IDs
    const nodeIdMap = new Map();
    
    // Clone nodes with new IDs and adjusted positions
    const clonedNodes = template.nodes.map(node => {
      const newId = nanoid();
      nodeIdMap.set(node.id, newId);
      
      const clonedNode = {
        ...node,
        id: newId,
        // Rebase node positions so the group's center aligns with the drop position,
        // and add a small offset to avoid perfect overlap on repeated drops
        position: {
          x: (dropPosition?.x ?? 0) + (node.position.x - center.x) + (offset.x || 0),
          y: (dropPosition?.y ?? 0) + (node.position.y - center.y) + (offset.y || 0),
        },
        // Reset selection and other temporary states
        selected: false,
        dragging: false
      };
      
      return clonedNode;
    });

    // Clone edges with new IDs and updated source/target references
    const clonedEdges = template.edges.map(edge => {
      const newId = nanoid();
      const newSource = nodeIdMap.get(edge.source);
      const newTarget = nodeIdMap.get(edge.target);
      
      // Skip edges that reference nodes not in the template
      if (!newSource || !newTarget) {
        return null;
      }

      const clonedEdge = {
        ...edge,
        id: newId,
        source: newSource,
        target: newTarget,
        // Reset selection and other temporary states
        selected: false
      };
      
      return clonedEdge;
    }).filter(Boolean); // Remove null edges

    return {
      nodes: clonedNodes,
      edges: clonedEdges
    };
  }, [getTemplate]);

  const calculateOffset = useCallback((dropCount = 0, baseOffset = { x: 20, y: 20 }) => {
    const multiplier = Math.floor(dropCount / 3) + 1;
    return {
      x: baseOffset.x * multiplier,
      y: baseOffset.y * multiplier
    };
  }, []);

  const handleTemplateDrop = useCallback((
    templateId, 
    dropPosition, 
    onNodesAdd, 
    onEdgesAdd, 
    dropCount = 0
  ) => {
    try {
      const offset = calculateOffset(dropCount);
      const { nodes, edges } = cloneTemplate(templateId, dropPosition, offset);
      
      // Add cloned nodes and edges to the flow
      onNodesAdd(nodes);
      onEdgesAdd(edges);
      
      return { success: true, nodes, edges };
    } catch (error) {
      console.error('Error dropping template:', error);
      return { success: false, error: error.message };
    }
  }, [cloneTemplate, calculateOffset]);

  return {
    cloneTemplate,
    calculateOffset,
    handleTemplateDrop
  };
};