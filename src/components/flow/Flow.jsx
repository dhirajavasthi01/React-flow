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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './flow.module.scss';
import { allNodes } from './NodesList';
import { useTemplateManager } from '../../hooks/useTemplateManager';
import { useTemplateDrop } from '../../hooks/useTemplateDrop';

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
  selectedNodeIdAtom,
  selectedPageAtom,
  updateConfigAtom,
} from '../../pages/network/store';


import BearingNode from './nodes/Bearing';
import CouplingNode from './nodes/Coupling';
import CompressorNode from './nodes/Compressor';
import BoxNode from './nodes/Box';
import { HeatExchangerNode } from './nodes/HeatExchanger';
import { TurbineNode } from './nodes/Turbine';
import { SurfaceCondenserNode } from './nodes/SurfaceCondenser';
import { KODNode } from './nodes/Kod';
import { CentrifugalPumpNode } from './nodes/CentrifugalPump';
import { ESVNode } from './nodes/Esv';
import { EjectorNode } from './nodes/Ejector';
import { TextboxNode } from './nodes/TextBox';
import FlowingPipeEdge from './edges/FlowingPipEdge';
import Marker from './marker';
import { NDEJournalBearingNode } from './nodes/NDEJournalBearing';
import { CompressorConfigNode } from './nodes/CompressorConfig';
import { V2Node } from './nodes/V2';
import { svgMap } from './svgMap';

function generateRandom8DigitNumber() {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return array[0] % 90000000 + 10000000;
}
const initialFlowData={}
// Define custom node types
const nodeTypes = {
  bearingNode: BearingNode,
  couplingNode: CouplingNode,
  compressorNode: CompressorNode,
  compressorConfigNode: CompressorConfigNode,
  boxNode: BoxNode,
  heatExchangerNode: HeatExchangerNode,
  turbineNode: TurbineNode,
  surfaceCondenserNode: SurfaceCondenserNode,
  kodNode: KODNode,
  centrifugalPumpNode: CentrifugalPumpNode,
  esvNode: ESVNode,
  ejectorNode: EjectorNode,
  textBoxNode: TextboxNode,
  ndeJournalBearingNode: NDEJournalBearingNode,
  v2Node: V2Node,
};

const edgeTypes = {
  flowingPipe: (props) => FlowingPipeEdge({ ...props, type: "default" }),
  flowingPipeFuel: (props) => FlowingPipeEdge({ ...props, type: "step" }),
  flowingPipePower: (props) => FlowingPipeEdge({ ...props, type: "power" }),
  flowingPipeHp: (props) => FlowingPipeEdge({ ...props, type: "hp" }),
  flowingPipeMp: (props) => FlowingPipeEdge({ ...props, type: "mp" }),
  flowingPipeLp: (props) => FlowingPipeEdge({ ...props, type: "lp" }),
  flowingPipeWater: (props) => FlowingPipeEdge({ ...props, type: "water" }),
  flowingPipSuspectCondensate: (props) =>
    FlowingPipeEdge({ ...props, type: "suspect" }),
  flowingPipeCleanCondensate: (props) =>
    FlowingPipeEdge({ ...props, type: "clean" }),
  flowingPipeVhp: (props) => FlowingPipeEdge({ ...props, type: "vhp" }),
  flowingPipeAir: (props) => FlowingPipeEdge({ ...props, type: "air" }),
  flowingPipeCoolingWater: (props) =>
    FlowingPipeEdge({ ...props, type: "coolingWater" }),
};


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
  const [templateName, setTemplateName] = useState('');
  const [templateDropCounts, setTemplateDropCounts] = useState({});
  const [shouldDelete, setShouldDelete] = useRecoilState(deleteAtom);
  const [type, setType] = useRecoilState(dragNodeTypeAtom);
  const [nodeToCopy, setNodeToCopy] = useState(null);
  const [selectedPage, setSelectedPage] = useRecoilState(selectedPageAtom);
  const plantList = useRecoilValue(plantListAtom);
  const updateNodeInternals = useUpdateNodeInternals();
  const { screenToFlowPosition, fitView, zoomTo } = useReactFlow();

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
      console.log(params, "params")
      if (!isDeveloperMode) return;
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'flowingPipe',
            markerEnd: 'flowingPipe',
          },
          eds,
        ),
      );
    },
    [isDeveloperMode],
  );

  const onNodeClick = (event, node) => {
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
      nodes: JSON.stringify(nodes),
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
              setNodes(prev => [...prev, ...newNodes]);
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
    // Get selected nodes and edges directly from the flow state
    const selectedNodes = nodes.filter(node => node.selected);
    const selectedEdges = edges.filter(edge => edge.selected);
    
    // Get all edges connected to selected nodes (including those not explicitly selected)
    const connectedEdges = edges.filter(edge => {
      const sourceSelected = selectedNodes.some(node => node.id === edge.source);
      const targetSelected = selectedNodes.some(node => node.id === edge.target);
      return sourceSelected && targetSelected;
    });
    
    // Also get edges where only one end is selected (for partial connections)
    const partialEdges = edges.filter(edge => {
      const sourceSelected = selectedNodes.some(node => node.id === edge.source);
      const targetSelected = selectedNodes.some(node => node.id === edge.target);
      return sourceSelected || targetSelected;
    });
    
    // Combine explicitly selected edges with connected edges
    const allEdges = [...new Set([...selectedEdges, ...connectedEdges])];
    
    console.log('=== TEMPLATE SAVE DEBUG ===');
    console.log('Selected nodes:', selectedNodes.map(n => ({ id: n.id, type: n.type })));
    console.log('All edges in flow:', edges.map(e => ({ id: e.id, source: e.source, target: e.target })));
    console.log('Selected edges:', selectedEdges.map(e => ({ id: e.id, source: e.source, target: e.target })));
    console.log('Connected edges (both ends selected):', connectedEdges.map(e => ({ id: e.id, source: e.source, target: e.target })));
    console.log('Partial edges (one end selected):', partialEdges.map(e => ({ id: e.id, source: e.source, target: e.target })));
    console.log('Final edges to save:', allEdges.map(e => ({ id: e.id, source: e.source, target: e.target })));
    console.log('=== END DEBUG ===');
    
    if (selectedNodes.length === 0) {
      alert('Please select at least one node to save as template');
      return;
    }

    const name = prompt('Enter template name:', `Template ${Date.now()}`);
    if (!name || !name.trim()) {
      return;
    }

    try {
      saveTemplate(name.trim(), selectedNodes, allEdges);
      setShowSaveTemplate(false);
      setTemplateName('');
      alert(`Template "${name}" saved successfully with ${selectedNodes.length} nodes and ${allEdges.length} edges!`);
    } catch (error) {
      alert(`Error saving template: ${error.message}`);
    }
  }, [nodes, edges, saveTemplate]);

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
      
      {isDeveloperMode && showSaveTemplate && (() => {
        const selectedNodes = nodes.filter(node => node.selected);
        const selectedEdges = edges.filter(edge => edge.selected);
        const connectedEdges = edges.filter(edge => {
          const sourceSelected = selectedNodes.some(node => node.id === edge.source);
          const targetSelected = selectedNodes.some(node => node.id === edge.target);
          return sourceSelected && targetSelected;
        });
        const allEdges = [...new Set([...selectedEdges, ...connectedEdges])];
        
        return (
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
            Save as Template ({selectedNodes.length} node{selectedNodes.length !== 1 ? 's' : ''}, {allEdges.length} edge{allEdges.length !== 1 ? 's' : ''})
          </button>
        );
      })()}
      <>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
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
          <Marker type="flowingPipe" />
          <Marker type="flowingPipeFuel" />
          <Marker type="flowingPipePower" />
          <Marker type="flowingPipeHp" />
          <Marker type="flowingPipeMp" />
          <Marker type="flowingPipeLp" />
          <Marker type="flowingPipeWater" />
          <Marker type="flowingPipSuspectCondensate" />
          <Marker type="flowingPipeCleanCondensate" />
          <Marker type="flowingPipeAir" />
          <Marker type="flowingPipeCoolingWater" />

          <Controls position="bottom-right" showInteractive={isDeveloperMode} />
          <Background variant={isDeveloperMode ? 'lines' : 'none'} />
        </ReactFlow>
      </>
    </div>
  );
}

export default Flow;