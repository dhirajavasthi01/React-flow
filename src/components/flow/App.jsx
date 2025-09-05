import { ReactFlowProvider } from '@xyflow/react'
import Flow from './Flow'
import styles from './Flow.module.scss'
import NodeConfigurator from './NodeCongigurator'
import NodesList from './NodesList'
import { highlightedNodeTypeAtom, showHandlesAtom, subSystemListAtom } from '../../pages/network/store'
import { useRecoilState } from 'recoil'

const App = ({ isDeveloperMode}) => {
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
        <div className={`${styles.flowContainer_left}`} style={style.leftSection}>
          <div id='node-list' className={`${styles.leftTopSection}`} style={style.topLeft}>
          <div className={`${styles.leftTopSection__scrollContainer}`} >
            <NodesList />
          </div>
          </div>
           <div className={`${styles.leftBottomSection}`} style={style.bottomLeft}>
            <div className={`${styles.scrollContainer}`}>
              <NodeConfigurator/>
            </div>
        </div>
        </div>

        <div
          className={`${styles.flowContainer_right}`}
          style={style.rightSection}
          id="network-flow"
          data-testid="network-flow"
        >
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
      </div>
      
      {/* SubSystem buttons for highlighting */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
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

const style = {
  leftSection: {
    display: 'flex',
    flexDirection: 'column',
  },
  topLeft: {
    backgroundColor: '#e3e3e3',
    boxSizing: 'border-box',
  },
  bottomLeft: {
    backgroundColor: '#dcdcdc',
    boxSizing: 'border-box',
  },
  rightSection: {
    backgroundColor: '#b8b8b0ff',
    boxSizing: 'border-box',
    position: 'relative',
  },
}

export default App