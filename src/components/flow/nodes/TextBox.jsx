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
        setCurrentDimensions({
            width: params.width,
            height: params.height,
        });

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

    const dynamicFontSize = Math.max(10, Math.min(currentDimensions.height / 4, 40));


    return (
        <>
            <NodeResizer
                isVisible={selected}
                onResizeEnd={onResizeEnd}
            />
            <div
                style={{
                    display: "inline-block",
                    backgroundColor: bgColor || "transparent",
                    position: "relative",
                    padding: 0,
                    margin: 0,
                    lineHeight: 1,
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
                        fontSize: `${dynamicFontSize}px`,
                        margin: 0,
                        padding: 0,
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
            <style>
                {`
                .react-flow__node-textBoxNode {
                    width: auto !important;
                    height: auto !important;
                }
            `}
            </style>
        </>
    );
});