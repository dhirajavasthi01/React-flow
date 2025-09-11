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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './flow.module.scss';
import { allNodes } from './NodesList';

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

function generateRandom8DigitNumber() {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return array[0] % 90000000 + 10000000;
}

const initialFlowData = {}
// {
//   nodes:
//     '[{"name":"Box Node","nodeType":"box-node","type":"boxNode","position":{"x":-396.7701295286419,"y":100.62019049455893},"data":{"nodeColor":"#d3d3d3","strokeColor":"#000000","subSystem":null,"width":"50","height":"100"},"width":100,"height":200,"id":"box-node-46608568","measured":{"width":100,"height":200},"selected":false,"dragging":false},{"name":"Bearing Node","nodeType":"bearing-node","type":"bearingNode","position":{"x":-410.040124030589,"y":93.47813687835114},"data":{"nodeColor":"#e6f514","strokeColor":"#000000","subSystem":null,"width":"70","height":"140"},"width":100,"height":200,"id":"bearing-node-55739917","measured":{"width":100,"height":200},"selected":false,"dragging":false},{"name":"Compressor Node","nodeType":"compressor-node","type":"compressorNode","position":{"x":-553.0244491963454,"y":17.783118505453842},"data":{"nodeColor":"#d3d3d3","strokeColor":"#000000","subSystem":null,"width":200,"height":200},"width":200,"height":200,"id":"compressor-node-53380309","measured":{"width":200,"height":200},"selected":false,"dragging":false},{"name":"Box Node","nodeType":"box-node","type":"boxNode","position":{"x":-462.68132826257056,"y":102.09108840962288},"data":{"nodeColor":"#d3d3d3","strokeColor":"#000000","subSystem":null,"width":"50","height":"100"},"width":100,"height":200,"id":"box-node-41137516","measured":{"width":100,"height":200},"selected":false,"dragging":false},{"name":"Box Node","nodeType":"box-node","type":"boxNode","position":{"x":-542.7178800627687,"y":100.06750938031176},"data":{"nodeColor":"#d3d3d3","strokeColor":"#000000","subSystem":null,"width":"50","height":"100"},"width":100,"height":200,"id":"box-node-21670138","measured":{"width":100,"height":200},"selected":false,"dragging":false},{"name":"Compressor Node","nodeType":"compressor-node","type":"compressorNode","position":{"x":-366.3436458983136,"y":19.040161538426105},"data":{"nodeColor":"#d3d3d3","strokeColor":"#000000","subSystem":null,"width":200,"height":200},"width":200,"height":200,"id":"compressor-node-44163100","measured":{"width":200,"height":200},"selected":false,"dragging":false},{"name":"Bearing Node","nodeType":"bearing-node","type":"bearingNode","position":{"x":-557.2432779554008,"y":92.50092411584126},"data":{"nodeColor":"#d3d3d3","strokeColor":"#000000","subSystem":null,"width":"70","height":"140"},"width":100,"height":200,"id":"bearing-node-49610808","measured":{"width":100,"height":200},"selected":false,"dragging":false},{"name":"Coupling Node","nodeType":"coupling-node","type":"couplingNode","position":{"x":-435.2787785171985,"y":98.19360913912826},"data":{"isActive":false,"linkedTag":null,"subSystem":null,"nodeColor":"#a9a6a6","width":"120","height":"120"},"width":230,"height":260,"id":"coupling-node-87051841","measured":{"width":230,"height":260},"selected":false,"dragging":false},{"name":"Box Node","nodeType":"box-node","type":"boxNode","position":{"x":-276.0340691715118,"y":103.34351965847817},"data":{"nodeColor":"#d3d3d3","strokeColor":"#000000","subSystem":null,"width":"50","height":"100"},"width":100,"height":200,"id":"box-node-30007213","measured":{"width":100,"height":200},"selected":false,"dragging":false},{"name":"Coupling Node","nodeType":"coupling-node","type":"couplingNode","position":{"x":-502.5564106874336,"y":99.20439951407397},"data":{"isActive":false,"linkedTag":null,"subSystem":null,"nodeColor":"#a9a6a6","width":"120","height":"120"},"width":230,"height":260,"id":"coupling-node-52826100","measured":{"width":230,"height":260},"selected":false,"dragging":false}]',
//   edges:
//     '[{"source":"box-node-41137516","sourceHandle":"box-node-41137516-target-handle-right","target":"box-node-41137516","targetHandle":"box-node-41137516-target-handle-left","type":"flowingPipe","markerEnd":"flowingPipe","id":"xy-edge__box-node-41137516box-node-41137516-target-handle-right-box-node-41137516box-node-41137516-target-handle-left"}]',
//   saved: true,
// };
// Define custom node types
const nodeTypes = {
  bearingNode: BearingNode,
  couplingNode: CouplingNode,
  compressorNode: CompressorNode,
  boxNode: BoxNode,
  heatExchangerNode: HeatExchangerNode,
  turbineNode: TurbineNode

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
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const isDeveloperMode = useRecoilValue(developerModeAtom);
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
        const parsedNodes = JSON.parse(initialFlowData.nodes);
        const parsedEdges = JSON.parse(initialFlowData.edges);
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

const onNodesChange = useCallback(
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
    setNodes(applyNodeChanges(changes, updatedNodes));
  },
  [nodes, setNodes, isDeveloperMode],
);

  const onEdgesChange = useCallback(
    (changes) => {
      if (!isDeveloperMode) return;
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    [setEdges, isDeveloperMode],
  );

  const onConnect = useCallback(
    (params) => {
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
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
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
    [screenToFlowPosition, type],
  );

  return (
    <div
      id="react-flow-container"
      style={{ height: '100%', width: '100%', position: 'relative' }}
    >
      {isDeveloperMode && (
        <button
          className={`${styles.saveButton} ${styles.positionPrimaryButton}  text-14-regular text-uppercase`}
          id="save-button"
          data-testid="save-button"
          onClick={() => {
            handleSaveClick();
          }}
        >
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      )}
      <>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 2000 }}
          minZoom={0.05}
          maxZoom={3}
          nodesDraggable={isDeveloperMode}
          nodesConnectable={isDeveloperMode}
          onInit={fitViewWithPadding}
          onPaneClick={onPaneClick}
          onDrop={onDrop}
          onDragOver={onDragOver}
          style={{ backgroundColor: 'white' }}
        >
          <Controls position="bottom-right" showInteractive={isDeveloperMode} />
          <Background variant={isDeveloperMode ? 'lines' : 'none'} />
        </ReactFlow>
      </>
    </div>
  );
}

export default Flow;