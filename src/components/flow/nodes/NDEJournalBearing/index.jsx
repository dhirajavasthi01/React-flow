import { memo } from 'react';
import { NodeResizer, useReactFlow } from '@xyflow/react';
import { useRecoilValue } from 'recoil';
import { allTagsDataAtom, selectedNodeIdAtom, highlightedNodeTypeAtom } from "../../../../pages/network/store";
import HorizontalHandles from "../../handles/HorizontalHandles";
import SvgNode from '../../SvgNode';
import NDEJournalBearingSvg from '../../../../assets/ADFP SVG/NDE Journal Bearing.svg';

export const NDEJournalBearingNodeFieldConfig = {
    fields: [
        { label: "Node Color", name: "nodeColor", type: "gradientColor" },
        { label: "Stroke Color", name: "strokeColor", type: "color" },
        { label: "Sub System", name: "subSystem", type: "text" },  
    ],
};

export const NDEJournalBearingNodeConfig = {
    name: "NDE Journal Bearing Node",
    nodeType: "nde-journal-bearing-node",
    type: "ndeJournalBearingNode",
    position: { x: 0, y: 0 },
    data: {
        nodeColor: "#d3d3d3",
        strokeColor: "#000000",
        subSystem: null,
        svgPath: NDEJournalBearingSvg,
    },
};

export const NDEJournalBearingNode = ({ data, id, selected, type }) => {
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
                HandlesComponent={HorizontalHandles}
                isNodeActive={selectedId === id}
                isHighlighted={isHighlighted}
                selected={selected}
            />
        </>
    );
};

export default memo(NDEJournalBearingNode);