import React, { useState } from 'react';
import { useTemplateManager } from '../../hooks/useTemplateManager';
import styles from './Flow.module.scss';


const TemplateSidebar = () => {
  const { templates, deleteTemplate } = useTemplateManager();
  const [draggedTemplate, setDraggedTemplate] = useState(null);

  const handleDragStart = (event, template) => {
    setDraggedTemplate(template);
    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData('application/template', JSON.stringify({
      type: 'template',
      templateId: template.id,
      templateName: template.name
    }));
    event.dataTransfer.setData('text/plain', `TEMPLATE:${template.id}`);
  };

  const handleDragEnd = () => {
    setDraggedTemplate(null);
  };

  const handleDeleteTemplate = (templateId, templateName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the template "${templateName}"?\n\nThis will not affect any nodes already placed in the diagram.`
    );
    
    if (confirmed) {
      deleteTemplate(templateId);
    }
  };

  const formatDate = (createdAt) => {
    const date = new Date(createdAt);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.templateSidebar}>
      <h3 className="text-14-bold text-uppercase mb_1">Saved Groups</h3>
      
      {templates.length === 0 ? (
        <div className={styles.emptyState}>
          <p className="text-12-regular text-muted">
            No saved templates yet.<br />
            Select nodes and edges, then click "Save as Template" to create your first template.
          </p>
        </div>
      ) : (
        <div className={styles.templateList}>
          {templates.map((template) => (
            <div
              key={template.id}
              className={`${styles.templateItem} ${
                draggedTemplate?.id === template.id ? styles.dragging : ''
              }`}
              draggable
              onDragStart={(event) => handleDragStart(event, template)}
              onDragEnd={handleDragEnd}
              title={`Drag to canvas to create a copy of "${template.name}"`}
            >
              <div className={styles.templateContent}>
                <div className={styles.templateHeader}>
                  <span className={`${styles.templateName} text-12-bold`}>
                    {template.name}
                  </span>
                  <button
                    className={styles.deleteButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTemplate(template.id, template.name);
                    }}
                    title={`Delete template "${template.name}"`}
                    aria-label={`Delete template "${template.name}"`}
                  >
                    ×
                  </button>
                </div>
                
                <div className={styles.templateInfo}>
                  <span className="text-10-regular text-muted">
                    {template.nodes.length} node{template.nodes.length !== 1 ? 's' : ''}
                    {template.edges.length > 0 && `, ${template.edges.length} edge${template.edges.length !== 1 ? 's' : ''}`}
                  </span>
                  <span className="text-10-regular text-muted">
                    {formatDate(template.createdAt)}
                  </span>
                </div>
              </div>
              
              <div className={styles.dragIndicator}>
                <span className="text-10-regular">Drag to canvas</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateSidebar;

