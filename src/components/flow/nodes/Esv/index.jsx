import { memo } from 'react';
import { NodeResizer, useReactFlow } from '@xyflow/react';
import { useRecoilValue } from 'recoil';
import { allTagsDataAtom, selectedNodeIdAtom, highlightedNodeTypeAtom } from "../../../../pages/network/store";
import HorizontalHandles from "../../handles/HorizontalHandles";
import SvgNode from '../../SvgNode'; 
import ESVSvg from '../../../../assets/ADFP SVG/ESV.svg';

export const ESVNodeFieldConfig = {
    fields: [
        { label: "Node Color", name: "nodeColor", type: "gradientColor" },
        { label: "Stroke Color", name: "strokeColor", type: "color" },
        { label: "Sub System", name: "subSystem", type: "text" },
    ],
    showLinkModal: true,
};

export const ESVNodeConfig = {
    name: "ESV Node",
    nodeType: "esv-node",
    type: "esvNode",
    position: { x: 0, y: 0 },
    data: {
        nodeColor: "#d3d3d3",
        strokeColor: "#000000",
        subSystem: null,
        svgPath: ESVSvg,
    },
};

export const ESVNode = ({ data, id, selected }) => {
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

export default memo(ESVNode);