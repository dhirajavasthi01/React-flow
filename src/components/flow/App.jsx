import { ReactFlowProvider } from '@xyflow/react'
import Flow from './Flow'
import styles from './Flow.module.scss'
import NodeConfigurator from './NodeCongigurator'
import NodesList from './NodesList'
import TemplateSidebar from './TemplateSidebar'
import { highlightedNodeTypeAtom, showHandlesAtom, subSystemListAtom } from '../../pages/network/store'
import { useRecoilState } from 'recoil'

const App = () => {
  const [highlightedNodeType, setHighlightedNodeType] = useRecoilState(highlightedNodeTypeAtom);
  const [subSystemList] = useRecoilState(subSystemListAtom);
  const [show, toggle] = useRecoilState(showHandlesAtom)
  const handleMouseEnter = (subSystem) => {
    setHighlightedNodeType(subSystem);
  };

  const handleMouseLeave = () => {
    setHighlightedNodeType(null);
  };

  return (
    <div className={styles.flowMainContainer}>
      <div className={styles.flowContainer}>
        <div className={`${styles.flowContainer_left}`}>
        <div id='node-list' className={`${styles.leftSection}`}>
        <div className={`${styles.leftTopSection__scrollContainer}`} >
            <NodesList />
            <TemplateSidebar />
        </div>
        </div>
        </div>
        <div className={`${styles.flowContainer_middle}`}>
          {true && (
            <button
              className={`${styles.primaryBlueButton} ${styles.hideHandleBtn} text-14-regular text-uppercase`}
              id="handles-button"
              data-testid="handles-button"
              onClick={() => toggle(!show)}
            >
              {show ? 'Hide Handles' : 'Show Handles'}
            </button>
          )}
           <ReactFlowProvider>
             <Flow />
           </ReactFlowProvider>
        </div>
        <div className={`${styles.flowContainer_right}`}>
         <div className={`${styles.rightSection}`}>
            <div className={`${styles.scrollContainer}`}>
              <NodeConfigurator/>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.buttonContainer} style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        {subSystemList.map((subSystem) => (
          <button
            key={subSystem.id}
            className={`${styles.primaryBlueButton} text-uppercase text-14-regular`}
            onMouseEnter={() => handleMouseEnter(subSystem.id)}
            onMouseLeave={handleMouseLeave}
            style={{
              border: highlightedNodeType === subSystem.id ? '2px solid red' : 'none'
            }}
          >
            {subSystem.name}
          </button>
        ))}
      </div>
    </div>
  )
}


export default App