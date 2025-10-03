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
import { NDEJournalBearingNode } from './nodes/NDEJournalBearing';
import { CompressorConfigNode } from './nodes/CompressorConfig';
import { V2Node } from './nodes/V2';
import FlowingPipeEdge from './edges/FlowingPipEdge';

export const nodeTypes = {
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

export const edgeTypes = {
  flowingPipe: (props) => FlowingPipeEdge({ ...props, type: 'default' }),
  flowingPipeFuel: (props) => FlowingPipeEdge({ ...props, type: 'step' }),
  flowingPipePower: (props) => FlowingPipeEdge({ ...props, type: 'power' }),
  flowingPipeHp: (props) => FlowingPipeEdge({ ...props, type: 'hp' }),
  flowingPipeMp: (props) => FlowingPipeEdge({ ...props, type: 'mp' }),
  flowingPipeLp: (props) => FlowingPipeEdge({ ...props, type: 'lp' }),
  flowingPipeWater: (props) => FlowingPipeEdge({ ...props, type: 'water' }),
  flowingPipSuspectCondensate: (props) => FlowingPipeEdge({ ...props, type: 'suspect' }),
  flowingPipeCleanCondensate: (props) => FlowingPipeEdge({ ...props, type: 'clean' }),
  flowingPipeVhp: (props) => FlowingPipeEdge({ ...props, type: 'vhp' }),
  flowingPipeAir: (props) => FlowingPipeEdge({ ...props, type: 'air' }),
  flowingPipeCoolingWater: (props) => FlowingPipeEdge({ ...props, type: 'coolingWater' }),
};


