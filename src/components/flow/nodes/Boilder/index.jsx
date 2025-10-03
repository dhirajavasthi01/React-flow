import { Position } from "@xyflow/react";
import Handles from "../../handles/Handles";
import { useRecoilValue } from 'recoil';

import styles from './BoilerNode.module.scss';
import { allTagsDataAtom, selectedNodeIdAtom } from "../../../../pages/network/store";

export const BoilerNodeFieldConfig = {
  fields: [
    { label: "Is Turned ON", name: "isTurnedOn", type: "switch" },
    { label: "Tag", name: "tag", type: "text" },
    { label: "Sub Tag", name: "subTag", type: "text" },
    { label: "Node Color", name: "nodeColor", type: "color" },
  ],
  showLinkModal: true,
};

export const BoilerNodeConfig = {
  name: "Boiler",
  nodeType: "boiler-node",
  type: "boilerNode",
  position: { x: 0, y: 0 },
  data: {
    isTurnedOn: false,
    tag: "UN.UO.71FI1101.PV",
    subTag: "Boiler",
    linkedTag: null,
    nodeColor: "#3498db",
  },
  // Ensure you define the initial width and height for your node
  width: 500, 
  height: 280,
};

export const BoilerNode = ({ data, id }) => {
  const { isTurnedOn, tag, subTag, linkedTag, nodeColor,isHighlighted  } = data;



  const selectedId = useRecoilValue(selectedNodeIdAtom);
  const allTagsDataList = useRecoilValue(allTagsDataAtom);

  const tagData = allTagsDataList.find(
    (x) => x.tagId && x.tagId === linkedTag
  );

  // Apply the nodeColor to the component background
 const nodeStyle = {
    border: selectedId === id ? "2px solid green" : 
            isHighlighted ? "2px solid red" : "none",
    maxWidth: "170px",
  };

  if (tagData ? tagData?.actual == 1 : isTurnedOn) {
    return (
      <div
        className={`text-center ${styles.boilerCompOn}`}
        style={nodeStyle}
      >
        <div className={`w-100 text-center h-100 ${styles.s}`}>
          <div className={`w-100 text-break text-center ${styles.label}`}>
            <p className={`text-break text-center text-14px-regular w-100 ${styles.textWrapper}`}>{tag}</p>
          </div>

          <div className={`${styles.boilerOn}`}>
            {/* Green upward pointing triangle for "on" state */}
            <svg 
              width="40" 
              height="40" 
              viewBox="0 0 100 100"
              style={{ fill: nodeColor }}
            >
              <polygon points="50,15 90,85 10,85" />
            </svg>
            <Handles id={id} leftStyles={{ left: '5px' }} rightStyles={{ right: '5px' }} />
          </div>

          <div className={`w-100 text-center ${styles.key}`}>
            <p className={`text-break text-14px-regular text-center w-100 ${styles.textWrapper}`}>{subTag}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`text-center ${styles.boilerCompOff}`}
      style={nodeStyle}
    >
      <div data-tooltip-id="logout" className={`w-100 text-center h-100 ${styles.s}`}>
        <div className={`w-100 text-center ${styles.label}`}>
          <p className={`text-break text-center text-14px-regular w-100 ${styles.textWrapper}`}>{tag}</p>
        </div>

        <div className={`${styles.boilerOff}`}>
          {/* Gray downward pointing triangle for "off" state */}
          <svg 
            width="40" 
            height="40" 
            viewBox="0 0 100 100"
            style={{ fill: nodeColor }}
          >
            <polygon points="50,85 90,15 10,15" />
          </svg>
          <Handles id={id} leftStyles={{ left: '0px' }} rightStyles={{ right: '60px' }} />
        </div>

        <div className={`w-100 text-center ${styles.key}`}>
          <p className={`text-14px-regular text-center w-100 ${styles.textWrapper}`}>{subTag}</p>
        </div>
      </div>
    </div>
  );
};

export default BoilerNode;