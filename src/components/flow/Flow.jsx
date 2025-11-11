import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  getConnectedEdges,
  ReactFlow,
  useReactFlow,
  useUpdateNodeInternals,
  useNodesState,
  useEdgesState,
  Panel,
  useStore,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './flow.module.scss';
import { allNodes } from './NodesList';
import { useTemplateManager } from '../../hooks/useTemplateManager';
import { useTemplateDrop } from '../../hooks/useTemplateDrop';
import { useFlowSelection } from '../../hooks/useFlowSelection';

import { useRecoilValue, useRecoilState } from 'recoil';

import {
  AppAtom,
  deleteAtom,
  developerModeAtom,
  dragNodeTypeAtom,
  highlightedNodeTypeAtom,
  networkFlowDataAtom,
  networkLockedAtom,
  newNodeAtom,
  nodeConfigAtom,
  plantListAtom,
  selectedEdgeIdAtom,
  selectedEdgeTypeAtom,
  selectedNodeIdAtom,
  selectedPageAtom,
  updateConfigAtom,
} from '../../pages/network/store';


import Marker from './marker';
import { nodeTypes, edgeTypes } from './nodeEdgeTypes';
import { svgMap } from './svgMap';
import { Lasso } from './Lasso';

export function generateRandom8DigitNumber() {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return array[0] % 90000000 + 10000000;
}
const initialFlowData = {}


function Flow() {
  const params = useParams();
  const appContext = useRecoilValue(AppAtom);
  const [networkFlowData, setNetworkFlowData] = useRecoilState(networkFlowDataAtom);
  const highlightedNodeType = useRecoilValue(highlightedNodeTypeAtom);
  const [isPageDataLoading, setPageDataLoading] = useState(false);
  const [newNode, setNewNode] = useRecoilState(newNodeAtom);
  const [config, setConfig] = useRecoilState(nodeConfigAtom);
  const [shouldUpdateConfig, setShouldUpdateConfig] =
    useRecoilState(updateConfigAtom);
  const [selectedNodeId, setSelectedNodeId] = useRecoilState(selectedNodeIdAtom);
  const [selectedEdgeId, setSelectedEdgeId] = useRecoilState(selectedEdgeIdAtom);
  const isNetworkLocked = useRecoilValue(networkLockedAtom);
  const [nodeToUpdate, setNodeToUpdate] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const isDeveloperMode = useRecoilValue(developerModeAtom);

  // Template functionality
  const { saveTemplate } = useTemplateManager();
  const { handleTemplateDrop } = useTemplateDrop();
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const { selectedNodes: selNodes, allEdges: selEdges } = useFlowSelection(nodes, edges);
  const [templateName, setTemplateName] = useState('');
  const [templateDropCounts, setTemplateDropCounts] = useState({});
  const [shouldDelete, setShouldDelete] = useRecoilState(deleteAtom);
  const [type, setType] = useRecoilState(dragNodeTypeAtom);
  const [nodeToCopy, setNodeToCopy] = useState(null);
  const [selectedPage, setSelectedPage] = useRecoilState(selectedPageAtom);
  const plantList = useRecoilValue(plantListAtom);
  const [partial, setPartial] = useState(false);
console.log("nodes===>",nodes)
  const updateNodeInternals = useUpdateNodeInternals();
  const [selectedEdgeType, setSelectedEdgeType] = useRecoilState(selectedEdgeTypeAtom);
  // const [selectedEdgeType, setSelectedEdgeType] = useState(selectedEdgeTypeAtom);

  const { screenToFlowPosition, fitView, zoomTo, getNodes } = useReactFlow();
  const nodeLookup = useStore((s) => s.nodeLookup);

const initialFlowData ={}

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const parsedEdges = JSON.parse(initialFlowData.edges);
        const parsedNodes = JSON.parse(initialFlowData.nodes).map((node) => {
          const matchedSvg = svgMap[node.nodeType] || null;
          return {
            ...node,
            data: {
              ...node?.data,
              svgPath: matchedSvg
            },
          }
        });
        setNodes(parsedNodes);
        setEdges(parsedEdges);
        setNetworkFlowData({
          nodes: parsedNodes,
          edges: parsedEdges,
          saved: initialFlowData.saved,
        });
        setTimeout(() => {
          zoomTo(0.5);
          fitView({ duration: 800 });
        }, 100);
      } catch (error) {
        setNodes([]);
        setEdges([]);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, [setNodes, setEdges, setNetworkFlowData, fitView, zoomTo]);

  const fitViewWithPadding = useCallback(() => {
    setTimeout(() => {
      fitView({ padding: 0.2, duration: 800 });
    }, 100);
  }, [fitView]);


  function deselectAllNodes(nodesArray) {
  return nodesArray.map(node => ({
    ...node,
    selected: false
  }));
}

  useEffect(() => {
    if (nodes.length > 0 && !isDeveloperMode) {
      fitViewWithPadding();
    }
  }, [nodes.length, fitViewWithPadding]);

  useEffect(() => {
    if (shouldDelete) {
      if (selectedNodeId) {
        const newNodes = nodes.filter((node) => node.id !== selectedNodeId);
        const deletedNode = nodes.find((node) => node.id === selectedNodeId);
        setNodes(newNodes);
        setSelectedNodeId(null);
        setConfig(null);
        setShouldDelete(false);
        setEdges(
          [deletedNode].reduce((acc, node) => {
            const connectedEdges = getConnectedEdges([node], edges);
            const remainingEdges = acc.filter(
              (edge) => !connectedEdges.includes(edge),
            );
            return [...remainingEdges];
          }, edges),
        );
      }
      if (selectedEdgeId) {
        const newEdges = edges.filter((edge) => edge.id !== selectedEdgeId);
        setEdges(newEdges);
        setSelectedEdgeId(null);
        setConfig(null);
        setShouldDelete(false);
      }
    }
  }, [shouldDelete, selectedEdgeId, selectedNodeId, nodes, edges]);

  const handleNodesChange = useCallback(
    (changes) => {
      if (!isDeveloperMode) return;

      // Process the changes to update the node's data and style
      const updatedNodes = nodes.map((node) => {
        const resizeChange = changes.find(
          (change) => change.type === 'resize' && change.id === node.id
        );

        if (resizeChange) {
          // Create a new object to maintain immutability
          return {
            ...node,
            style: {
              ...node.style,
              width: resizeChange.dimensions.width,
              height: resizeChange.dimensions.height,
            },
            data: {
              ...node.data,
              width: resizeChange.dimensions.width,
              height: resizeChange.dimensions.height,
            },
          };
        }
        return node; // Return the node unchanged if it's not being resized
      });

      // Now apply all changes (including position changes, etc.) on the updated nodes
      const newNodes = applyNodeChanges(changes, updatedNodes);
      setNodes(newNodes);
    },
    [nodes, setNodes, isDeveloperMode],
  );

  const handleEdgesChange = useCallback(
    (changes) => {
      if (!isDeveloperMode) return;
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    [setEdges, isDeveloperMode],
  );

  const onConnect = useCallback(
    (params) => {
      if (!isDeveloperMode) return;
      let newEdge;

      switch (selectedEdgeType) {
        case 'straightArrow':
          newEdge = {
            ...params,
            type: 'flowingPipeStraightArrow',
            data: { edgeStyleType: 'straightArrow' },
            markerEnd: {
              type: 'arrowclosed',
              width: 20,
              height: 20,
              color: '#000',
            },
          };
          break;

        case 'straight':
          newEdge = {
            ...params,
            type: 'flowingPipeStraight',
            data: { edgeStyleType: 'straight' },
          };
          break;

        case 'dotted':
          newEdge = {
            ...params,
            type: 'flowingPipeDotted',
            data: { edgeStyleType: 'dotted' },
          };
          break;

        case 'dottedArrow':
          newEdge = {
            ...params,
            type: 'flowingPipeDottedArrow',
            data: { edgeStyleType: 'dottedArrow' },
            markerEnd: {
              type: 'arrowclosed',
              width: 20,
              height: 20,
              color: '#000',
            },
          };
          break;

        default:
          newEdge = {
            ...params,
            type: 'flowingPipeStraightArrow',
            data: { edgeStyleType: 'straightArrow' },
            markerEnd: {
              type: 'arrowclosed',
              width: 20,
              height: 20,
              color: '#000',
            },
          };
          break;
      }

      setEdges((eds) => addEdge(newEdge, eds));
    },
    [isDeveloperMode, selectedEdgeType, setEdges],
  );




  const onNodeClick = (event, node) => {
    // Handle text box clicks in non-developer mode to select background node
    if (node.type === 'textBoxNode' && !isDeveloperMode) {
      const point = screenToFlowPosition({ x: event.clientX || 0, y: event.clientY || 0 });
      
      // Find all nodes that contain this point (excluding text boxes and self)
      let bestMatch = null;
      for (const n of nodeLookup.values()) {
        if (!n || n.id === node.id) continue; // skip self
        if (n.type === 'textBoxNode') continue; // ignore other text boxes
        
        const w = n.measured?.width || 0;
        const h = n.measured?.height || 0;
        if (w === 0 || h === 0) continue;
        
        const left = n.internals.positionAbsolute.x;
        const top = n.internals.positionAbsolute.y;
        const right = left + w;
        const bottom = top + h;
        
        // Check if click point is inside this node
        const contains = point.x >= left && point.x <= right && point.y >= top && point.y <= bottom;
        if (!contains) continue;
        
        // Prefer node with highest z-index
        const z = n.internals?.z || 0;
        if (!bestMatch || z > bestMatch.z) {
          bestMatch = { id: n.id, z, node: n };
        }
      }

      if (bestMatch) {
        const allNodes = getNodes();
        const targetNode = allNodes.find((n) => n.id === bestMatch.id);
        
        if (targetNode) {
          // Update React Flow selection state
          setNodes((nodes) =>
            nodes.map((n) => ({
              ...n,
              selected: n.id === bestMatch.id
            }))
          );
          
          // Update Recoil state
          setSelectedEdgeId(null);
          setSelectedNodeId(bestMatch.id);
          setConfig(targetNode);
          return;
        }
      }
      return; // Don't select text box if no background node found
    }
    
    // Skip handling text box nodes in developer mode - they have their own click handler
    if (node.type === 'textBoxNode') {
      return;
    }

    // In non-developer mode, if clicking a node that contains a text box, select background node instead
    if (!isDeveloperMode) {
      const clickedNode = nodeLookup.get(node.id);
      if (!clickedNode) {
        // Fallback to normal behavior
        setSelectedNodeId(node.id);
        setSelectedEdgeId(null);
        setConfig(node);
        return;
      }

      // Check if there are any text box nodes overlapping with this node
      const clickedNodePos = clickedNode.internals.positionAbsolute;
      const clickedNodeWidth = clickedNode.measured?.width || 0;
      const clickedNodeHeight = clickedNode.measured?.height || 0;
      
      const hasTextBoxOverlap = Array.from(nodeLookup.values()).some((n) => {
        if (!n || n.type !== 'textBoxNode' || n.id === node.id) return false;
        
        const textBoxPos = n.internals.positionAbsolute;
        const textBoxWidth = n.measured?.width || 0;
        const textBoxHeight = n.measured?.height || 0;
        
        // Check if text box overlaps with clicked node
        const overlaps = 
          textBoxPos.x < clickedNodePos.x + clickedNodeWidth &&
          textBoxPos.x + textBoxWidth > clickedNodePos.x &&
          textBoxPos.y < clickedNodePos.y + clickedNodeHeight &&
          textBoxPos.y + textBoxHeight > clickedNodePos.y;
        
        return overlaps;
      });

      // If this node has text box overlap, find the background node behind it
      if (hasTextBoxOverlap) {
        const clickedNodeCenterX = clickedNodePos.x + clickedNodeWidth / 2;
        const clickedNodeCenterY = clickedNodePos.y + clickedNodeHeight / 2;

        // Find all nodes that contain this point and are behind the clicked node
        const candidates = [];
        for (const n of nodeLookup.values()) {
          if (!n || n.id === node.id) continue; // skip self
          if (n.type === 'textBoxNode') continue; // ignore text boxes
          
          const w = n.measured?.width || 0;
          const h = n.measured?.height || 0;
          if (w === 0 || h === 0) continue;
          
          const left = n.internals.positionAbsolute.x;
          const top = n.internals.positionAbsolute.y;
          const right = left + w;
          const bottom = top + h;
          
          // Check if center point is inside this node
          const contains = clickedNodeCenterX >= left && clickedNodeCenterX <= right && 
                          clickedNodeCenterY >= top && clickedNodeCenterY <= bottom;
          if (!contains) continue;
          
          // Calculate overlap area with clicked node
          const overlapLeft = Math.max(left, clickedNodePos.x);
          const overlapTop = Math.max(top, clickedNodePos.y);
          const overlapRight = Math.min(right, clickedNodePos.x + clickedNodeWidth);
          const overlapBottom = Math.min(bottom, clickedNodePos.y + clickedNodeHeight);
          const overlapArea = Math.max(0, overlapRight - overlapLeft) * 
                             Math.max(0, overlapBottom - overlapTop);
          
          candidates.push({
            id: n.id,
            node: n,
            overlapArea,
            z: n.internals?.z || 0
          });
        }

        // Sort by overlap area (largest first), then by z-index
        candidates.sort((a, b) => {
          if (b.overlapArea !== a.overlapArea) {
            return b.overlapArea - a.overlapArea;
          }
          return b.z - a.z;
        });

        if (candidates.length > 0) {
          const bestMatch = candidates[0];
          const allNodes = getNodes();
          const targetNode = allNodes.find((n) => n.id === bestMatch.id);
          
          if (targetNode) {
            // Update React Flow selection state
            setNodes((nodes) =>
              nodes.map((n) => ({
                ...n,
                selected: n.id === bestMatch.id
              }))
            );
            
            // Update Recoil state
            setSelectedEdgeId(null);
            setSelectedNodeId(bestMatch.id);
            setConfig(targetNode);
            return;
          }
        }
      }
    }

    // Normal behavior: select the clicked node
    setSelectedNodeId(node.id);
    setSelectedEdgeId(null);
    setConfig(node);
  };

  const onEdgeClick = (event, edge) => {
    if (!isDeveloperMode) return;
    setSelectedEdgeId(edge.id);
    setSelectedNodeId(null);
    setConfig({ ...edge, configType: 'edge' });
  };

  useEffect(() => {
    if (nodeToUpdate) {
      updateNodeInternals(nodeToUpdate);
      setNodeToUpdate(null);
    }
  }, [nodeToUpdate]);

  useEffect(() => {
    if (shouldUpdateConfig && selectedNodeId) {
      const updatedNodes = nodes.map((node) =>
        node.id === selectedNodeId
          ? {
            ...node,
            data: { ...node.data, ...config.data },
            width: config.data.width,
            height: config.data.height,
          }
          : node,
      );
      setNodeToUpdate(selectedNodeId);
      setNodes(updatedNodes);
      setSelectedNodeId(null);
      setShouldUpdateConfig(false);
    }
  }, [shouldUpdateConfig, config, nodes, selectedNodeId]);

  useEffect(() => {
    if (shouldUpdateConfig && selectedEdgeId) {
      const updatedEdges = edges.map((edge) =>
        edge.id === selectedEdgeId
          ? {
            ...edge,
            type: config.type,
            markerEnd: config.markerEnd,
          }
          : edge,
      );
      setEdges(updatedEdges);
      setSelectedEdgeId(null);
      setShouldUpdateConfig(false);
    }
  }, [shouldUpdateConfig, config, edges, selectedEdgeId]);

  useEffect(() => {
    if (newNode) {
      const newId = `${newNode.nodeType}-${generateRandom8DigitNumber()}`;
      setNodes([
        ...nodes,
        {
          ...newNode,
          id: newId,
        },
      ]);
      setSelectedNodeId(newId);
      setConfig({ ...newNode, id: newId });
      setNewNode(null);
    }
  }, [newNode, nodes]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.key === 'v' && nodeToCopy) {
        setNewNode(nodeToCopy);
        setNodeToCopy(null);
      }
      if (e.ctrlKey && e.key === 'c' && config && selectedNodeId) {
        setNodeToCopy(config);
      }
      if (e.key === 'Delete' && config) {
        setShouldDelete(true);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [config, nodeToCopy, selectedNodeId]);

  const handleSaveClick = async () => {
    const data = {
      nodeJson: JSON.stringify(nodes),
      edgeJson: JSON.stringify(edges),
    };
    console.log({
      nodes: JSON.stringify(deselectAllNodes(nodes)),
      edges: JSON.stringify(edges),
      saved: true,
    });

    setNetworkFlowData({
      nodes: JSON.stringify(nodes),
      edges: JSON.stringify(edges),
      saved: true,
    });
  };

  const onPaneClick = (event) => {
    setConfig(null);
    setSelectedEdgeId(null);
    setSelectedNodeId(null);
  };

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    // Prefer copy cursor when dragging templates
    const hasTemplateType = Array.from(event.dataTransfer?.types || []).includes('application/template');
    const plain = event.dataTransfer?.getData && event.dataTransfer.getData('text/plain');
    const isTemplateFallback = plain && plain.startsWith('TEMPLATE:');
    event.dataTransfer.dropEffect = (hasTemplateType || isTemplateFallback) ? 'copy' : 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // Check if it's a template drop
      let templateData = event.dataTransfer.getData('application/template');
      if (!templateData) {
        const fallback = event.dataTransfer.getData('text/plain');
        if (fallback && fallback.startsWith('TEMPLATE:')) {
          templateData = JSON.stringify({ templateId: fallback.replace('TEMPLATE:', '') });
        }
      }

      if (templateData) {
        try {
          const { templateId } = JSON.parse(templateData);

          // Get current drop count for this template
          const currentDropCount = templateDropCounts[templateId] || 0;
          const newDropCount = currentDropCount + 1;

          // Update drop count
          setTemplateDropCounts(prev => ({
            ...prev,
            [templateId]: newDropCount
          }));

          console.log('=== TEMPLATE DROP DEBUG ===');
          console.log('Template ID:', templateId);
          console.log('Drop count:', newDropCount);
          console.log('Drop position:', position);

          const result = handleTemplateDrop(
            templateId,
            position,
            (newNodes) => {
              console.log('Adding nodes:', newNodes.map(n => ({ id: n.id, type: n.type })));
              setNodes(prev => deselectAllNodes([...prev, ...newNodes]));
            },
            (newEdges) => {
              console.log('Adding edges:', newEdges.map(e => ({ id: e.id, source: e.source, target: e.target })));
              setEdges(prev => [...prev, ...newEdges]);
            },
            newDropCount
          );

          if (result.success) {
            console.log('Template dropped successfully:', result);
          } else {
            console.error('Failed to drop template:', result.error);
          }
          console.log('=== END DROP DEBUG ===');
        } catch (error) {
          console.error('Error parsing template data:', error);
        }
        return;
      }

      // Handle regular node drop
      if (!type || !position) {
        return;
      }
      const newNodeData = allNodes.find((x) => x.type === type);
      if (newNodeData) {
        setSelectedNodeId(null);
        setSelectedEdgeId(null);
        setConfig(null);
        setNewNode({ ...newNodeData, position });
        setType(null);
      }
    },
    [screenToFlowPosition, type, handleTemplateDrop],
  );

  // Template-related functions
  const handleSaveTemplate = useCallback(() => {
    const selectedNodes = selNodes;
    const allEdges = selEdges;

    if (selectedNodes.length === 0) {
      alert('Please select at least one node to save as template');
      return;
    }

    const name = prompt('Enter template name:', `Template ${Date.now()}`);
    if (!name || !name.trim()) {
      return;
    }

    try {
      console.log("Selected nodes and edges for template:", selectedNodes, allEdges);
      saveTemplate(name.trim(), selectedNodes, allEdges);
      setShowSaveTemplate(false);
      setTemplateName('');
      alert(`Template "${name}" saved successfully with ${selectedNodes.length} nodes and ${allEdges.length} edges!`);
    } catch (error) {
      alert(`Error saving template: ${error.message}`);
    }
  }, [selNodes, selEdges, saveTemplate]);

  const handleSelectionChange = useCallback(({ nodes: selectedNodes, edges: selectedEdges }) => {
    console.log('Selection changed:', { selectedNodes, selectedEdges });
    setShowSaveTemplate((selectedNodes || []).length > 0);
  }, []);

  return (
    <div
      id="react-flow-container"
      style={{ height: '100%', width: '100%', position: 'relative' }}
    >
      {isDeveloperMode && (
        <button
          className={`${styles.saveButton} ${styles.positionPrimaryButton}  text-14-regular text-uppercase`}
          id="save-button"
          data-testid="save-button"
          onClick={() => {
            handleSaveClick();
          }}
        >
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      )}

      {isDeveloperMode && showSaveTemplate && (
        <button
          className={`${styles.saveButton} ${styles.positionPrimaryButton} text-14-regular text-uppercase`}
          id="save-template-button"
          data-testid="save-template-button"
          style={{
            top: '60px',
            right: '20px',
            backgroundColor: '#28a745',
            zIndex: 1000
          }}
          onClick={handleSaveTemplate}
        >
          Save as Template ({selNodes.length} node{selNodes.length !== 1 ? 's' : ''}, {selEdges.length} edge{selEdges.length !== 1 ? 's' : ''})
        </button>
      )}
      <>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          defaultEdgeOptions={{type: 'flowingPipeStraightArrow'}}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          onSelectionChange={handleSelectionChange}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 2000 }}
          minZoom={0.05}
          maxZoom={3}
          nodesDraggable={isDeveloperMode}
          nodesConnectable={isDeveloperMode}
          multiSelectionKeyCode="Control"
          selectionOnDrag={isDeveloperMode}
          selectionMode="partial"
          onInit={fitViewWithPadding}
          onPaneClick={onPaneClick}
          onDrop={onDrop}
          onDragOver={onDragOver}
          style={{ backgroundColor: 'white' }}
        >
          {partial && <Lasso partial={partial} />}
          <Marker type="flowingPipeStraightArrow" />
          <Marker type="flowingPipe" />
          <Marker type="flowingPipeDotted" />
          <Marker type="flowingPipeDottedArrow" />
            <Panel position="top-left" className="lasso-controls">
            <label>
              <input
                type="checkbox"
                checked={partial}
                onChange={() => setPartial((p) => !p)}
                className="xy-theme__checkbox"
              />
              Partial selection
            </label>
          </Panel>
          <Controls position="bottom-right" showInteractive={isDeveloperMode} />
          <Background variant={isDeveloperMode ? 'lines' : 'none'} />
        </ReactFlow>
      </>
    </div>
  );
}

export default Flow;
