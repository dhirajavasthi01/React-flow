import { memo, useState, useMemo } from 'react';
import { NodeResizer, useReactFlow } from '@xyflow/react';
import { useRecoilValue } from 'recoil';
import { EXTRA_NODE_COLORS, text_box_resources } from "../utils";
import { allTagsDataAtom, selectedNodeIdAtom } from "../../../pages/network/store";
import Handles from "../handles/Handles";

export const TextBoxNodeFieldConfig = {
    fields: [
        { label: "Label", name: "label", type: "text" },
        { label: "Text Color", name: "color", type: "color" },
        {
            label: "Outlet (Right)",
            name: "numSourceHandlesRight",
            type: "number",
            min: 0,
        },
        {
            label: "Inlet (Top)",
            name: "numTargetHandlesTop",
            type: "number",
            min: 0,
        },
        {
            label: "Outlet (Bottom)",
            name: "numSourceHandlesBottom",
            type: "number",
            min: 0,
        },
        {
            label: "Inlet (Left)",
            name: "numTargetHandlesLeft",
            type: "number",
            min: 0,
        },
    ],
};

export const TextBoxNodeConfig = {
    name: "Textbox",
    nodeType: "text-box-node",
    type: "textBoxNode",
    position: { x: 0, y: 0 },
    data: {
        numSourceHandlesRight: 1,
        numTargetHandlesTop: 1,
        numSourceHandlesBottom: 1,
        numTargetHandlesLeft: 1,
        label: "Text Box Node",
        color: "#000000",
        linkedTag: null,
    },
    template: null,
};

export const TextboxNode = memo(({ data, id, selected }) => {
    const selectedId = useRecoilValue(selectedNodeIdAtom);
    const { setNodes } = useReactFlow();

    const {
        width: initialWidth = 200,
        height: initialHeight = 100,
        color,
        label,
        numSourceHandlesRight,
        numSourceHandlesBottom,
        numTargetHandlesTop,
        numTargetHandlesLeft,
        linkedTag,
        template,
    } = data;

    const [currentDimensions, setCurrentDimensions] = useState({
        width: initialWidth,
        height: initialHeight
    });

    const { bgColor, borderColor } = EXTRA_NODE_COLORS[template] || {};
    const allTagsDataList = useRecoilValue(allTagsDataAtom);
    const tagData = allTagsDataList.find((x) => x.tagId && x.tagId == linkedTag);





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
            <NodeResizer
                isVisible={selected}
                minWidth={80}
                minHeight={40}
                onResizeEnd={onResizeEnd}
            />
            <div
                style={{
                    width: `${currentDimensions.width}px`,
                    height: `${currentDimensions.height}px`,
                    display: "flex",
                    backgroundColor: bgColor || "transparent",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                }}
            >
                <p
                    dangerouslySetInnerHTML={{
                        __html: tagData ? tagData?.actual ?? "-" : label,
                    }}
                    style={{
                        color: label.toLowerCase().includes("header")
                            ? "red"
                            : color,
                        textAlign: "center",
                        fontSize: `10px`,
                        margin: 0,
                        padding: '8px',
                        transition: 'font-size 0.1s ease',
                        fontWeight: 'bold',
                        lineHeight: '1.2',
                    }}
                    className="text-uppercase"
                />

                <Handles
                    width={currentDimensions.width}
                    height={currentDimensions.height}
                    numSourceHandlesRight={numSourceHandlesRight}
                    numTargetHandlesTop={numTargetHandlesTop}
                    numSourceHandlesBottom={numSourceHandlesBottom}
                    numTargetHandlesLeft={numTargetHandlesLeft}
                    key="textBoxNode"
                />
            </div>
        </>
    );
});