import { memo } from 'react';
import { NodeResizer, useReactFlow } from '@xyflow/react';
import { useRecoilValue } from 'recoil';
import { allTagsDataAtom, selectedNodeIdAtom, highlightedNodeTypeAtom } from "../../../../pages/network/store";
import Handles from "../../handles/Handles";
import SvgNode from '../../SvgNode';
import { getNodeGradient } from "../../utils";
import { svgMap } from '../../svgMap';

export const CompressorConfigNodeFieldConfig = {
    fields: [
        { label: "Node Color", name: "gradientColor", type: "gradientColor" },
        { label: "Stroke Color", name: "strokeColor", type: "color" },
        { label: "Sub System", name: "subSystem", type: "text" },
    ],
};

export const CompressorConfigNodeConfig = {
    name: "Compressor Config Node",
    nodeType: "compressor-config-node",
    type: "compressorConfigNode",
    position: { x: 0, y: 0 },
    data: {
        gradientStart: getNodeGradient()[0],
        gradientEnd: getNodeGradient()[1],
        strokeColor: "#000000",
        subSystem: null,
        svgPath: svgMap["compressor-config-node"] || null,
    },
};

export const CompressorConfigNode = ({ data, id, selected, type }) => {
    const { isActive, linkedTag, subSystem, svgPath } = data;

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

export default memo(CompressorConfigNode);