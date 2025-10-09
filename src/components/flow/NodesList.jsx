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
  AppAtom,
  showHandlesAtom
} from '../../pages/network/store';
import { BearingNodeConfig } from './nodes/Bearing';
import { CouplingNodeConfig } from './nodes/Coupling';
import { CompressorNodeConfig } from './nodes/Compressor';
import { BoxNodeConfig } from './nodes/Box';
import { HeatExchangerNodeConfig } from './nodes/HeatExchanger';
import { TurbineNodeConfig } from './nodes/Turbine';
import { SurfaceCondenserNodeConfig } from './nodes/SurfaceCondenser';
import { KODNodeConfig } from './nodes/Kod';
import { CentrifugalPumpNodeConfig } from './nodes/CentrifugalPump';
import { ESVNodeConfig } from './nodes/Esv';
import { EjectorNodeConfig } from './nodes/Ejector';
import { TextBoxNodeConfig } from './nodes/TextBox';
import { NDEJournalBearingNodeConfig } from './nodes/NDEJournalBearing';
import { CompressorConfigNodeConfig } from './nodes/CompressorConfig';
import { V2NodeConfig } from './nodes/V2';
import { DotConfig } from './nodes/Dot';
import DotSvg from '../../assets/ADFP SVG/Dot.svg';


export const allNodes = [
  BearingNodeConfig,
  CouplingNodeConfig,
  CompressorNodeConfig,
  CompressorConfigNodeConfig,
  BoxNodeConfig,
  HeatExchangerNodeConfig,
  TurbineNodeConfig,
  SurfaceCondenserNodeConfig,
  KODNodeConfig,
  CentrifugalPumpNodeConfig,
  ESVNodeConfig,
  EjectorNodeConfig,
  TextBoxNodeConfig,
  NDEJournalBearingNodeConfig,
  V2NodeConfig,
  DotConfig
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
  const showHandles = useRecoilValue(showHandlesAtom);

  const handleNodeClick = (node) => {
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
    setConfig(null);
    setNewNode(node);
  };

  const onDragStart = (event, nodeType) => {
    setNodeType(nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className={styles.nodeListContainer}>
      <h3 className="text-14-bold text-uppercase mb_1">Nodes List</h3>

      <div className={styles.nodeGrid}>
        {allNodes.map((node) => {
          const isDotNode = node.name === 'Dot Node'
          const listItemStyle = isDotNode && !showHandles ? {display: 'none'} : {}

          return (
            <div
              data-testid={`node-${node.name}`}
              id={`node-list-${node.name}`}
              className={styles.nodeListItem}
              onDragStart={(event) => onDragStart(event, node.type)}
              draggable
              onClick={() => handleNodeClick(node)}
              key={node.name}
              style={listItemStyle}
            >
              {node?.data?.svgPath ? (
                <img
                  src={node?.data?.svgPath}
                  alt={node.name}
                  style={{
                    width: node.name === 'Dot Node' ? '15px' : '40px',
                    height: node.name === 'Dot Node' ? '15px' : '40px',
                  }}
                />
              ) : (
                <div style={{ color: 'black' }}>{node.name}</div>
              )}
            </div>
          )
        }
        )}
      </div>
    </div>
  );
};

export default NodesList;
