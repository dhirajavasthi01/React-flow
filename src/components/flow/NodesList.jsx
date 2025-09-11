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
import HeatExchangerSvg from '../../assets/ADFP SVG/S&T Exchanger.svg';
import TurbineNodeSvg from '../../assets/ADFP SVG/Turbine.svg';
import { HeatExchangerNodeConfig } from './nodes/HeatExchanger';
import { TurbineNodeConfig } from './nodes/Turbine';
import { SurfaceCondenserNodeConfig } from './nodes/SurfaceCondenser';
import SurfaceCondenserSvg from '../../assets/ADFP SVG/Surface Condensor.svg';
import { KODNodeConfig } from './nodes/Kod';
import KODSvg from '../../assets/ADFP SVG/KOD.svg';
import { CentrifugalPumpNodeConfig } from './nodes/CentrifugalPump';
import CentrifugalPumpSvg from '../../assets/ADFP SVG/Centrifugal Pump.svg';
import { ESVNodeConfig } from './nodes/Esv';
import ESVSvg from '../../assets/ADFP SVG/ESV.svg';
import { EjectorNodeConfig } from './nodes/Ejector';
import EjectorSvg from '../../assets/ADFP SVG/Ejector.svg';
import { TextBoxNodeConfig } from './nodes/TextBox';





// Add SVG references to each node
export const allNodes = [
  { ...BearingNodeConfig, svg: BearingNodeSvg },
  { ...CouplingNodeConfig, svg: CouplingNodeSvg },
  { ...CompressorNodeConfig, svg: CompressorNodeSvg },
  { ...BoxNodeConfig, svg: BoxNodeSvg },
  { ...HeatExchangerNodeConfig, svg: HeatExchangerSvg },
  {...TurbineNodeConfig, svg: TurbineNodeSvg},
  {...SurfaceCondenserNodeConfig, svg: SurfaceCondenserSvg},
  {...KODNodeConfig, svg: KODSvg},
  {...CentrifugalPumpNodeConfig, svg: CentrifugalPumpSvg},
  {...ESVNodeConfig, svg: ESVSvg},
  {...EjectorNodeConfig, svg: EjectorSvg},
  TextBoxNodeConfig
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
