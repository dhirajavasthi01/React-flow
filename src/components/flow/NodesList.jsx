import { useParams } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import styles from './Flow.module.scss';

import {
  nodeConfigAtom,
  newNodeAtom,
  selectedNodeIdAtom,
  selectedEdgeIdAtom,
  selectedPageAtom,
  dragNodeTypeAtom,
  AppAtom
} from '../../pages/network/store';

// Node Configs
import { BoilerNodeConfig } from './nodes/Boilder';
import { MpNodeConfig } from './nodes/MpNode';
import { BearingNodeConfig } from './nodes/Bearing';
import { CouplingNodeConfig } from './nodes/Coupling';
import { CompressorNodeConfig } from './nodes/Compressor';
import { BoxNodeConfig } from './nodes/Box';

// SVG Imports (🔁 Update these paths based on your actual structure)
import BearingNodeSvg from '../../assets/ADFP SVG/Compressor Bearing.svg';
import CouplingNodeSvg from '../../assets/ADFP SVG/Coupling.svg';
import CompressorNodeSvg from '../../assets/ADFP SVG/Compressor Config 1.svg';
import BoxNodeSvg from '../../assets/ADFP SVG/Box.svg';


// Add SVG references to each node
export const allNodes = [
  { ...BearingNodeConfig, svg: BearingNodeSvg },
  { ...CouplingNodeConfig, svg: CouplingNodeSvg },
  { ...CompressorNodeConfig, svg: CompressorNodeSvg },
  { ...BoxNodeConfig, svg: BoxNodeSvg },
];

const NodesList = () => {
  const params = useParams();
  const appContext = useRecoilValue(AppAtom);

  const setConfig = useSetRecoilState(nodeConfigAtom);
  const setNewNode = useSetRecoilState(newNodeAtom);
  const setSelectedNodeId = useSetRecoilState(selectedNodeIdAtom);
  const setSelectedEdgeId = useSetRecoilState(selectedEdgeIdAtom);
  const selectedPage = useRecoilValue(selectedPageAtom);
  const setNodeType = useSetRecoilState(dragNodeTypeAtom);

  const handleNodeClick = (node) => {
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
    setConfig(null);
    setNewNode(node);
  };

  const onDragStart = (event, nodeType) => {
    setNodeType(nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className={`${styles.nodeListContainer}`}>
      <h3 className="text-14-bold text-uppercase mb_1">Nodes List</h3>

      <div className={styles.nodeGrid}>
        {allNodes.map((node) => (
          <div
            data-testid={`node-${node.name}`}
            id={`node-list-${node.name}`}
            className={`${styles.nodeListItem}`}
            onDragStart={(event) => onDragStart(event, node.type)}
            draggable
            onClick={() => handleNodeClick(node)}
            key={node.name}
          >
            <img
              src={node.svg}
              alt={node.name}
              style={{ width: '40px', height: '40px' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NodesList;
