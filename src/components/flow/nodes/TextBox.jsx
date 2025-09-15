import { memo, useState, useEffect, useRef, useLayoutEffect } from 'react';
import { NodeResizer, useReactFlow } from '@xyflow/react';
import { useRecoilValue } from 'recoil';
import { EXTRA_NODE_COLORS } from "../utils";
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
    const textRef = useRef(null);

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
    const [fontSize, setFontSize] = useState(16);

    useEffect(() => {
        setCurrentDimensions({
            width: initialWidth,
            height: initialHeight
        });
    }, [initialWidth, initialHeight]);

    const { bgColor } = EXTRA_NODE_COLORS[template] || {};
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
                        data: { ...node.data, width: params.width, height: params.height },
                    };
                }
                return node;
            })
        );
    };

    useLayoutEffect(() => {
        const calculateFontSize = () => {
            if (!textRef.current) return;
            const parentWidth = currentDimensions.width - 4;
            const parentHeight = currentDimensions.height - 4;
            if (parentWidth <= 0 || parentHeight <= 0) {
                setFontSize(1);
                return;
            }

            let low = 1;
            let high = 500;
            let bestFit = 1;

            while (low <= high) {
                const mid = Math.floor((low + high) / 2);
                textRef.current.style.fontSize = `${mid}px`;
                const textWidth = textRef.current.scrollWidth;
                const textHeight = textRef.current.scrollHeight;

                if (textWidth <= parentWidth && textHeight <= parentHeight) {
                    bestFit = mid;
                    low = mid + 1;
                } else {
                    high = mid - 1;
                }
            }
            low = 1;
            high = bestFit;
            let finalFit = 1;

            while (low <= high) {
                const mid = Math.floor((low + high) / 2);
                textRef.current.style.fontSize = `${mid}px`;
                const textHeight = textRef.current.scrollHeight;
                if (textHeight <= parentHeight) {
                    finalFit = mid;
                    low = mid + 1;
                } else {
                    high = mid - 1;
                }
            }
            setFontSize(finalFit);
        };
        calculateFontSize();
    }, [currentDimensions.width, currentDimensions.height, label, tagData]);
    const textContent = tagData ? tagData?.actual ?? "-" : label;

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
                    display: "inline-flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    backgroundColor: bgColor || "transparent",
                    width: currentDimensions.width,
                    height: currentDimensions.height,
                    padding: "4px",
                    boxSizing: "border-box",
                }}
            >
                <p
                    ref={textRef}
                    dangerouslySetInnerHTML={{
                        __html: textContent,
                    }}
                    style={{
                        color: label.toLowerCase().includes("header") ? "red" : color,
                        textAlign: "center",
                        fontSize: `${fontSize}px`,
                        margin: 0,
                        padding: 0,
                        fontWeight: 'bold',
                        lineHeight: '1.2',
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                    className="text-uppercase"
                />

                <Handles
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