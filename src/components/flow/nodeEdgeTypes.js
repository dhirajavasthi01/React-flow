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
import { Dot } from './nodes/Dot';

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
  dotNode: Dot
};

export const edgeTypes = {
  flowingPipeStraightArrow: (props) => FlowingPipeEdge({ ...props, type: "straightArrow" }),
  flowingPipe: (props) => FlowingPipeEdge({ ...props, type: "straight" }),
  flowingPipeDotted: (props) => FlowingPipeEdge({ ...props, type: "dotted" }),
  flowingPipeDottedArrow: (props) => FlowingPipeEdge({ ...props, type: "dottedArrow" })
};


