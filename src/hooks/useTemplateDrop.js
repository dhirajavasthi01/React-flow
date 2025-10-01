import { useCallback } from 'react';
import { nanoid } from 'nanoid';
import { useTemplateManager } from './useTemplateManager';

/**
 * Custom hook for handling template drop operations
 * Provides functions to clone templates and handle drag/drop
 */
export const useTemplateDrop = () => {
  const { getTemplate } = useTemplateManager();
  const DEBUG_TEMPLATES = false;

  /**
   * Clone a template's nodes and edges with new IDs and adjusted positions
   * @param {string} templateId - ID of the template to clone
   * @param {Object} dropPosition - Position where template is being dropped
   * @param {Object} offset - Offset to apply to avoid overlapping (optional)
   * @returns {Object} Object containing cloned nodes and edges
   */
  const cloneTemplate = useCallback((templateId, dropPosition, offset = { x: 20, y: 20 }) => {
    const template = getTemplate(templateId);
    if (!template) {
      throw new Error(`Template with ID ${templateId} not found`);
    }

    if (DEBUG_TEMPLATES) {
      console.log('=== CLONE TEMPLATE DEBUG ===');
      console.log('Template found:', template);
      console.log('Template nodes:', template.nodes.map(n => ({ id: n.id, type: n.type, position: n.position })));
      console.log('Template edges:', template.edges.map(e => ({ id: e.id, source: e.source, target: e.target })));
      console.log('Offset applied:', offset);
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
      
      if (DEBUG_TEMPLATES) console.log(`Cloned node: ${node.id} -> ${newId}`, clonedNode);
      return clonedNode;
    });

    // Clone edges with new IDs and updated source/target references
    const clonedEdges = template.edges.map(edge => {
      const newId = nanoid();
      const newSource = nodeIdMap.get(edge.source);
      const newTarget = nodeIdMap.get(edge.target);
      
      if (DEBUG_TEMPLATES) {
        console.log(`Processing edge: ${edge.id} (${edge.source} -> ${edge.target})`);
        console.log(`Mapped to: ${newSource} -> ${newTarget}`);
      }
      
      // Skip edges that reference nodes not in the template
      if (!newSource || !newTarget) {
        if (DEBUG_TEMPLATES) console.log(`Skipping edge ${edge.id} - source or target not found in template`);
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
      
      if (DEBUG_TEMPLATES) console.log(`Cloned edge: ${edge.id} -> ${newId}`, clonedEdge);
      return clonedEdge;
    }).filter(Boolean); // Remove null edges

    if (DEBUG_TEMPLATES) {
      console.log('Final cloned nodes:', clonedNodes.map(n => ({ id: n.id, type: n.type })));
      console.log('Final cloned edges:', clonedEdges.map(e => ({ id: e.id, source: e.source, target: e.target })));
      console.log('=== END CLONE DEBUG ===');
    }

    return {
      nodes: clonedNodes,
      edges: clonedEdges
    };
  }, [getTemplate]);

  /**
   * Calculate offset for multiple template drops to avoid overlapping
   * @param {number} dropCount - Number of times template has been dropped
   * @param {Object} baseOffset - Base offset object
   * @returns {Object} Calculated offset
   */
  const calculateOffset = useCallback((dropCount = 0, baseOffset = { x: 20, y: 20 }) => {
    const multiplier = Math.floor(dropCount / 3) + 1;
    return {
      x: baseOffset.x * multiplier,
      y: baseOffset.y * multiplier
    };
  }, []);

  /**
   * Handle template drop event
   * @param {string} templateId - ID of the template being dropped
   * @param {Object} dropPosition - Position where template is being dropped
   * @param {Function} onNodesAdd - Callback to add nodes to the flow
   * @param {Function} onEdgesAdd - Callback to add edges to the flow
   * @param {number} dropCount - Number of times this template has been dropped (optional)
   */
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

