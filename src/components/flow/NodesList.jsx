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
} from '../../pages/network/store'
import { BoilerNodeConfig } from './nodes/Boilder';
import { MpNodeConfig } from './nodes/MpNode';
import { BearingNodeConfig } from './nodes/Bearing';
import { CouplingNodeConfig } from './nodes/Coupling';
import BearingNodeSvg from '../../../public/bearing_node.svg' ;
import { CompressorNodeConfig } from './nodes/Compressor';
import { BoxNodeConfig } from './nodes/Box';

export const allNodes = [
  BoilerNodeConfig,
  MpNodeConfig,
  BearingNodeConfig,
  CouplingNodeConfig,
  CompressorNodeConfig,
  BoxNodeConfig,
  


]

const NodesList = () => {
  const params = useParams();
  const appContext = useRecoilValue(AppAtom); // Assuming AppAtom is also converted to Recoil
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
      {   allNodes.map((node) => (
          <div
            data-testid={`node-${node.name}`}
            id={`node-list-${node.name}`}
            className={`${styles.nodeListItem}`}
            style={{backgroundColor:"blue"}}
            onDragStart={(event) => onDragStart(event, node.type)}
            draggable
            onClick={() => {
            
              handleNodeClick(node);
            }}
            key={node.name}

          >
            <p
              className="mt_03 text-14-regular text-center text-uppercase text_primary_white"
            >
              {node.name}
            </p>
          </div>
        ))}
    </div>
  );
};

export default NodesList;