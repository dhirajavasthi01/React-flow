import { memo } from 'react';
import { NodeResizer, useReactFlow } from '@xyflow/react';
import { useRecoilValue } from 'recoil';
import { allTagsDataAtom, selectedNodeIdAtom, highlightedNodeTypeAtom } from "../../../../pages/network/store";
import Handles from "../../handles/Handles";
import SvgNode from '../../SvgNode';
import { svgMap } from '../../svgMap';

export const V2NodeFieldConfig = {
    fields: [
        { label: "Node Color", name: "nodeColor", type: "gradientColor" },
        { label: "Stroke Color", name: "strokeColor", type: "color" },
        { label: "Sub System", name: "subSystem", type: "text" },  
     {
            label: "Target Handles",
            name: "targetHandles",
            type: "multi-select",
        },
    ],
};

export const V2NodeConfig = {
    name: "V2 Node",
    nodeType: "v2-node",
    type: "v2Node",
    position: { x: 0, y: 0 },
    data: {
        nodeColor: "#d3d3d3",
        strokeColor: "#000000",
        subSystem: null,
        svgPath: svgMap["v2-node"] || null,
        targetHandles: [],
    },
};

export const V2Node = ({ data, id, selected, type }) => {
    const { isActive, linkedTag, subSystem, svgPath } = data;
    
    // Use the useReactFlow hook
    const { setNodes } = useReactFlow();

    const selectedId = useRecoilValue(selectedNodeIdAtom);
    const allTagsDataList = useRecoilValue(allTagsDataAtom);
    const highlightedNodeType = useRecoilValue(highlightedNodeTypeAtom);

    const isHighlighted = subSystem !== null &&
                         highlightedNodeType !== null &&
                         highlightedNodeType === subSystem;

    const tagData = allTagsDataList.find(
        (x) => x.tagId && x.tagId === linkedTag
    );

    const isNodeActive = tagData ? tagData?.actual == 1 : isActive;

    const onResizeEnd = (_, params) => {
        // Update the nodes in the React Flow state
        setNodes((nds) => 
            nds.map((node) => {
                if (node.id === id) {
                    return {
                        ...node,
                        style: { ...node.style, width: params.width, height: params.height },
                    };
                }
                return node;
            })
        );
    };

    return (
        <>
            <NodeResizer 
                isVisible={selected} 
                minWidth={10} 
                minHeight={20} 
                onResizeEnd={onResizeEnd}
            />
            <SvgNode
                id={id}
                data={data}
                svgPath={svgPath}
                nodeType={type}
                defaultNodeColor="#d3d3d3"
                defaultStrokeColor="#000000"
                HandlesComponent={Handles}
                isNodeActive={selectedId === id}
                isHighlighted={isHighlighted}
                selected={selected}
            />
        </>
    );
};

export default memo(V2Node);