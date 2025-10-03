# Reusable Node Templates Feature - Integration Guide

## Overview
This feature adds the ability to save, manage, and reuse groups of nodes and edges as templates in your React Flow application. Users can select multiple nodes/edges, save them as templates, and then drag templates from a sidebar to create copies on the canvas.

## Files Added/Modified

### New Files Created:
1. `src/types/template.js` - TypeScript interfaces and constants
2. `src/hooks/useTemplateManager.js` - Template management hook
3. `src/hooks/useTemplateDrop.js` - Template drag/drop handling hook
4. `src/components/flow/TemplateSidebar.jsx` - Template sidebar component

### Files Modified:
1. `src/pages/network/store.js` - Added `templatesStateAtom`
2. `src/components/flow/Flow.jsx` - Added template functionality and save button
3. `src/components/flow/App.jsx` - Integrated TemplateSidebar
4. `src/components/flow/Flow.module.scss` - Added template sidebar styles
5. `package.json` - Added nanoid dependency

## Features Implemented

### ✅ Save Templates
- Select multiple nodes and edges from the diagram
- "Save as Template" button appears when nodes are selected
- Prompts for template name and saves to Recoil state
- Validates that at least one node is selected

### ✅ Template Sidebar
- New "Saved Groups" section in the left sidebar
- Lists all saved templates with metadata
- Templates are draggable to the canvas
- Each template shows node/edge count and creation date
- Delete button for each template with confirmation

### ✅ Reuse Templates
- Drag templates from sidebar to canvas
- Creates copies with new unique IDs
- Applies offset to prevent overlapping
- Maintains all node/edge relationships

### ✅ Delete Templates
- Delete button on each template item
- Confirmation dialog before deletion
- Only removes from template list, not from canvas

### ✅ Recoil State Management
- `templatesStateAtom` stores all templates
- Template interface with id, name, nodes, edges, createdAt
- Proper state updates and error handling

## Usage Instructions

### For Users:

1. **Creating Templates:**
   - Enter Developer Mode
   - Select one or more nodes (and optionally edges) by clicking and dragging
   - Click the green "Save as Template" button that appears
   - Enter a name for your template
   - Template is saved and appears in the "Saved Groups" sidebar

2. **Using Templates:**
   - In Developer Mode, drag any template from the "Saved Groups" section
   - Drop it anywhere on the canvas
   - A copy of all nodes and edges will be created with new IDs
   - Multiple copies can be created without conflicts

3. **Managing Templates:**
   - View all saved templates in the left sidebar
   - See template details (node count, creation date)
   - Delete templates using the red "×" button
   - Deleted templates won't affect already placed nodes

### For Developers:

#### Template Management Hook
```javascript
import { useTemplateManager } from '../hooks/useTemplateManager';

const { 
  templates, 
  saveTemplate, 
  deleteTemplate, 
  getTemplate, 
  renameTemplate, 
  duplicateTemplate 
} = useTemplateManager();
```

#### Template Drop Hook
```javascript
import { useTemplateDrop } from '../hooks/useTemplateDrop';

const { 
  cloneTemplate, 
  calculateOffset, 
  handleTemplateDrop 
} = useTemplateDrop();
```

## Technical Details

### Template Data Structure
```javascript
{
  id: string,           // Unique identifier (nanoid)
  name: string,         // Display name
  nodes: Array,         // Array of node objects
  edges: Array,         // Array of edge objects
  createdAt: string     // ISO timestamp
}
```

### State Management
- Templates stored in `templatesStateAtom` Recoil atom
- Selection state managed locally in Flow component
- Template operations use custom hooks for reusability

### ID Generation
- Uses `nanoid` for generating unique IDs
- Ensures no conflicts between template copies
- Maintains referential integrity between nodes and edges

## Future Enhancement Suggestions

### 1. Persistence
```javascript
// Add to useTemplateManager.js
const saveTemplatesToStorage = () => {
  localStorage.setItem('flow-templates', JSON.stringify(templates));
};

const loadTemplatesFromStorage = () => {
  const stored = localStorage.getItem('flow-templates');
  if (stored) {
    setTemplates(JSON.parse(stored));
  }
};
```

### 2. Template Renaming
```javascript
// Add inline editing to TemplateSidebar
const [editingTemplate, setEditingTemplate] = useState(null);
const [editName, setEditName] = useState('');
```

### 3. Export/Import
```javascript
// Add export functionality
const exportTemplates = () => {
  const dataStr = JSON.stringify(templates, null, 2);
  const dataBlob = new Blob([dataStr], {type: 'application/json'});
  // Trigger download
};

// Add import functionality
const importTemplates = (file) => {
  // Parse and validate imported templates
  // Merge with existing templates
};
```

### 4. Template Categories
```javascript
// Extend Template interface
interface Template {
  id: string;
  name: string;
  category: string;  // New field
  nodes: Node[];
  edges: Edge[];
  createdAt: string;
}
```

### 5. Template Preview
```javascript
// Add thumbnail generation
const generateTemplatePreview = (template) => {
  // Create a small SVG preview of the template
  // Store as base64 data URL
};
```

## Error Handling

The implementation includes comprehensive error handling:
- Template name validation
- Duplicate name prevention
- Selection validation before saving
- Template not found errors
- JSON parsing errors for drag/drop

## Performance Considerations

- Templates are stored in memory (Recoil state)
- No performance impact on large diagrams
- Efficient ID generation with nanoid
- Minimal re-renders with proper useCallback usage

## Browser Compatibility

- Requires modern browsers with ES6+ support
- Uses standard drag/drop API
- Compatible with React 18+ and Recoil 0.7+

## Testing Recommendations

1. **Unit Tests:**
   - Test template creation/deletion
   - Test ID generation and uniqueness
   - Test error handling scenarios

2. **Integration Tests:**
   - Test drag/drop functionality
   - Test template copying to canvas
   - Test selection state management

3. **E2E Tests:**
   - Complete template workflow
   - Multiple template operations
   - Error scenarios and edge cases

## Troubleshooting

### Common Issues:

1. **Templates not saving:**
   - Ensure Developer Mode is enabled
   - Check that nodes are selected before saving
   - Verify template name is not empty

2. **Drag/drop not working:**
   - Check browser console for errors
   - Ensure template data is properly set in drag event
   - Verify drop handler is properly configured

3. **Templates not appearing:**
   - Check Recoil DevTools for state updates
   - Verify TemplateSidebar is properly imported
   - Check for JavaScript errors in console

## Conclusion

The template feature is now fully integrated and ready for use. It provides a powerful way to create reusable components in your React Flow diagrams while maintaining clean, modular code architecture. The implementation follows React and Recoil best practices and is easily extensible for future enhancements.

