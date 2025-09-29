import { memo } from 'react';
import { NodeResizer, useReactFlow } from '@xyflow/react';
import { useRecoilValue } from 'recoil';
import { allTagsDataAtom, selectedNodeIdAtom, highlightedNodeTypeAtom } from "../../../../pages/network/store";
import HorizontalHandles from "../../handles/HorizontalHandles";
import SvgNode from '../../SvgNode';
import { svgMap } from '../../svgMap';

export const BoxNodeFieldConfig = {
    fields: [
        { label: "Node Color", name: "color", type: "color" },
        { label: "Stroke Color", name: "strokeColor", type: "color" },
        { label: "Sub System", name: "subSystem", type: "text" },
    ],
    showLinkModal: true,
};

export const BoxNodeConfig = {
    name: "Box Node",
    nodeType: "box-node",
    type: "boxNode",
    position: { x: 0, y: 0 },
    data: {
        nodeColor: "#d3d3d3",
        strokeColor: "#000000",
        subSystem: null,
        svgPath: svgMap["box-node"] || null,
    },
    style: {
        width: 100,
        height: 150,
    },
};

const BoxNode = ({ data, id, selected, type }) => {
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
                minWidth={20}
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

export default memo(BoxNode);