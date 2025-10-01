// Template types for reusable node templates feature

/**
 * Template interface for storing reusable node groups
 * @typedef {Object} Template
 * @property {string} id - Unique identifier for the template
 * @property {string} name - Display name for the template
 * @property {Array<Object>} nodes - Array of nodes in the template
 * @property {Array<Object>} edges - Array of edges in the template
 * @property {string} createdAt - ISO timestamp when template was created
 */

/**
 * Template creation data interface
 * @typedef {Object} TemplateCreationData
 * @property {string} name - Name for the new template
 * @property {Array<Object>} nodes - Selected nodes to save as template
 * @property {Array<Object>} edges - Selected edges to save as template
 */

/**
 * Template drop data interface
 * @typedef {Object} TemplateDropData
 * @property {string} templateId - ID of the template being dropped
 * @property {Object} position - Position where template is being dropped
 * @property {Object} offset - Offset to apply to avoid overlapping
 */

export const TEMPLATE_TYPES = {
  NODE_GROUP: 'node_group',
  EDGE_GROUP: 'edge_group',
  MIXED_GROUP: 'mixed_group'
};

export const TEMPLATE_ACTIONS = {
  SAVE: 'save',
  DELETE: 'delete',
  RENAME: 'rename',
  DUPLICATE: 'duplicate'
};

