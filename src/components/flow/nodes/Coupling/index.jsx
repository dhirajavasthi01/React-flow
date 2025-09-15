import { memo } from 'react';
import { NodeResizer, useReactFlow } from '@xyflow/react';
import { useRecoilValue } from 'recoil';
import { allTagsDataAtom, selectedNodeIdAtom, highlightedNodeTypeAtom } from "../../../../pages/network/store";
import HorizontalHandles from "../../handles/HorizontalHandles";
import CouplingNodeSvg from '../../../../assets/ADFP SVG/Coupling.svg'
import SvgNode from "../../SvgNode";

export const CouplingNodeFieldConfig = {
    fields: [
        { label: "Is Active", name: "isActive", type: "switch" },
        { label: "Node Color", name: "nodeColor", type: "gradientColor" },
        { label: "Stroke Color", name: "strokeColor", type: "color" },
        { label: "Width", name: "width", type: "number", min: 100 },
        { label: "Height", name: "height", type: "number", min: 100 },
    ],
    showLinkModal: true,
};
export const CouplingNodeConfig = {
    name: "Coupling Node",
    nodeType: "coupling-node",
    type: "couplingNode",
    position: { x: 0, y: 0 },
    data: {
        isActive: false,
        linkedTag: null,
        subSystem: null,
        nodeColor: "#a9a6a6",
        strokeColor: "#000000",
        svgPath: CouplingNodeSvg,
        // width: 230,
        // height: 260,
    },
};

const CouplingNode = ({ data, id, selected, type }) => {
    const { isActive, linkedTag, subSystem, svgPath } = data;
    // Use the useReactFlow hook to get access to the setNodes function
    const { setNodes } = useReactFlow();

    const selectedId = useRecoilValue(selectedNodeIdAtom);
    const allTagsDataList = useRecoilValue(allTagsDataAtom);
    const highlightedNodeType = useRecoilValue(highlightedNodeTypeAtom);

    // Handle highlighting internally in the node component
    const isHighlighted = subSystem !== null && 
                          highlightedNodeType !== null && 
                          highlightedNodeType === subSystem;

    const tagData = allTagsDataList.find(
        (x) => x.tagId && x.tagId === linkedTag
    );

    const isNodeActive = tagData ? tagData?.actual == 1 : isActive;

    // Callback to update the node's style after resizing
    const onResizeEnd = (_, params) => {
        setNodes((nds) => 
            nds.map((node) => {
                if (node.id === id) {
                    return {
                        ...node,
                        // Update the style object with the new dimensions
                        style: { ...node.style, width: params.width, height: params.height },
                    };
                }
                return node;
            })
        );
    };

    return (
        <>
            {/* The NodeResizer component should wrap the node content */}
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
                defaultWidth={data.width}
                defaultHeight={data.height}
                defaultNodeColor="#d3d3d3"
                defaultStrokeColor="#000000"
                HandlesComponent={HorizontalHandles}
                isNodeActive={selectedId === id}
                isHighlighted={isHighlighted}
                selected={selected}
            />
        </>
    );
};

export default memo(CouplingNode);