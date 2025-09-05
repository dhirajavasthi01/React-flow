import { Position } from "@xyflow/react";
import HorizontalHandles from "../../handles/HorizontalHandles";
import { useRecoilValue } from 'recoil';

import styles from './MpNode.module.scss';
import { allTagsDataAtom, selectedNodeIdAtom } from "../../../../pages/network/store";

export const MpNodeFieldConfig = {
    fields: [
        { label: "Is Active", name: "isActive", type: "switch" },
        { label: "Tag", name: "tag", type: "text" },
        { label: "Sub Tag", name: "subTag", type: "text" },
        { label: "Node Color", name: "nodeColor", type: "color" },
        { label: "Stage 2 Text", name: "stage2Text", type: "text" },
        { label: "Stage 3 Text", name: "stage3Text", type: "text" },
    ],
    showLinkModal: true,
};

export const MpNodeConfig = {
    name: "MP Node",
    nodeType: "mp-node",
    type: "mpNode",
    position: { x: 0, y: 0 },
    data: {
        isActive: false,
        tag: "MP.NODE.001",
        subTag: "Multi-Stage",
        linkedTag: null,
        nodeColor: "#FFEB00",
        stage2Text: "STAGE 2",
        stage3Text: "STAGE 3",
    },
    width: 170,
    height: 240,
};

export const MpNode = ({ data, id }) => {
    const { isActive, tag, subTag, linkedTag, nodeColor, stage2Text, stage3Text, isHighlighted } = data;

    const selectedId = useRecoilValue(selectedNodeIdAtom);
    const allTagsDataList = useRecoilValue(allTagsDataAtom);

    const tagData = allTagsDataList.find(
        (x) => x.tagId && x.tagId === linkedTag
    );

    const nodeStyle = {
        border: selectedId === id ? "2px solid green" :
            isHighlighted ? "2px solid red" : "none",
    };

    const isNodeActive = tagData ? tagData?.actual == 1 : isActive;

    return (
        <div
            className={`text-center ${isNodeActive ? styles.mpNodeActive : styles.mpNodeInactive}`}
            style={nodeStyle}
        >
            <div className={`w-100 text-center h-100 ${styles.container}`}>
                <div className={`w-100 text-break text-center ${styles.label}`}>
                    <p className={`text-break text-center text-14px-regular w-100 ${styles.textWrapper}`}>{tag}</p>
                </div>

                <div className={styles.iconContainer}>
                    <svg viewBox="0 0 210 120" width="105" height="60">
                        {/* Yellow bow-tie shape */}
                        <polygon points="6,9 105,55 105,65 6,111"
                            fill={nodeColor} stroke="#4F575E" strokeWidth="1.5" strokeLinejoin="round" />
                        <polygon points="105,55 204,9 204,111 105,65"
                            fill={nodeColor} stroke="#4F575E" strokeWidth="1.5" strokeLinejoin="round" />

                        {/* Labels */}
                        <text x="62.5" y="69" fontFamily="Inter, Arial, sans-serif"
                            fontSize="15" fontWeight="700" textAnchor="middle" fill="#4F575E">
                            {stage2Text}
                        </text>
                        <text x="147.5" y="69" fontFamily="Inter, Arial, sans-serif"
                            fontSize="15" fontWeight="700" textAnchor="middle" fill="#4F575E">
                            {stage3Text}
                        </text>
                    </svg>
                    <HorizontalHandles id={id} leftStyles={{ left: '5px' }} rightStyles={{ right: '5px' }} />
                </div>

                <div className={`w-100 text-center ${styles.key}`}>
                    <p className={`text-break text-14px-regular text-center w-100 ${styles.textWrapper}`}>{subTag}</p>
                </div>
            </div>
        </div>
    );
};

export default MpNode;