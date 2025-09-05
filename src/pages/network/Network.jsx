import { useRecoilState } from 'recoil'
import styles from './Network.module.scss'
import { developerModeAtom } from './store'
import App from '../../components/flow/App'


export default function Network() {
  const [isDeveloperMode, setDeveloperMode] = useRecoilState(developerModeAtom)
  console.log("isDeveloperMode =>", isDeveloperMode)

  const handleClick = () => {
    setDeveloperMode(!isDeveloperMode)
    // Example logic (uncomment if needed)
    // if (newDeveloperModeValue) {
    //   setShowHandle(true)
    // } else {
    //   setShowHandle(false)
    // }
  }

  return (
    <div className={`${styles.networkParentContainer} d-flex flex-column w-100 h-100`}>
      <div className={`${styles.dropdownContainer} ${styles.select} w-100 d-flex justify-content-end align-items-center`}>
        <div className="d-flex align-items-center h-100 gap-2 position-relative">
          <button
            onClick={handleClick}
            className={`${styles.primaryBlueButton} text-uppercase text-14-regular`}
            id="developer-mode-button"
            data-testid="developer-mode-button"
          >
            {isDeveloperMode ? 'Exit Developer Mode' : 'Enter Developer Mode'}
          </button>
        </div>
      </div>

      <div className={`${styles.networkFlowContainer} w-100`}>
        <App />
      </div>
    </div>
  )
}