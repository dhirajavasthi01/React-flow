import { atom } from 'recoil'

// Helper function to create toggle atoms with Recoil
const atomWithToggle = (key, initialValue) => atom({
  key,
  default: initialValue,
  effects: [
    ({ setSelf, onSet }) => {
      // Optional: Add any persistence or side effects here
      onSet((newValue, oldValue) => {
        // You can add side effects when the value changes
      })
    }
  ]
})


export const subSystemListAtom = atom({
  key: 'subSystemListAtom',
  default: [
    { id: 'mp_dgs', name: 'MP DGS' },
    { id: 'lp_dgs', name: 'LP DGS' },
    { id: 'proc_s2', name: 'PROCESS STG 2' },
    { id: 'proc_s3', name: 'PROCESS STG 3' },
    { id: 'proc_s1', name: 'PROCESS STG 1' },
    { id: 'turbine1', name: 'TURBINE 1' },
  ],
})


export const showHandlesAtom = atomWithToggle('showHandlesAtom', false)
export const nodeConfigAtom = atom({
  key: 'nodeConfigAtom',
  default: null,
})
export const updateConfigAtom = atomWithToggle('updateConfigAtom', false)
export const selectedNodeIdAtom = atom({
  key: 'selectedNodeIdAtom',
  default: null,
})
export const selectedEdgeIdAtom = atom({
  key: 'selectedEdgeIdAtom',
  default: null,
})
export const newNodeAtom = atom({
  key: 'newNodeAtom',
  default: null,
})
export const tagListAtom = atom({
  key: 'tagListAtom',
  default: [],
})
export const selectedPageAtom = atom({
  key: 'selectedPageAtom',
  default: null,
})
export const networkLockedAtom = atomWithToggle('networkLockedAtom', false)
export const developerModeAtom = atomWithToggle('developerModeAtom', true)
export const deleteAtom = atomWithToggle('deleteAtom', false)
export const allTagsAtom = atom({
  key: 'allTagsAtom',
  default: [],
})
export const allTagsDataAtom = atom({
  key: 'allTagsDataAtom',
  default: [],
})
export const newNodeTypeAtom = atom({
  key: 'newNodeTypeAtom',
  default: null,
})
export const plantListAtom = atom({
  key: 'plantListAtom',
  default: [],
})
export const fitViewAtom = atom({
  key: 'fitViewAtom',
  default: 0,
})
export const networkDownloadingAtom = atom({
  key: 'networkDownloadingAtom',
  default: { type: 'png', isDownloading: false },
})

export const dragNodeTypeAtom = atom({
  key: 'dragNodeTypeAtom',
  default: null,
});

export const AppAtom = atom({
  key: 'AppAtom',
  default: {}, // Adjust default value as needed
});


export const highlightedNodeTypeAtom = atom({
  key: 'highlightedNodeTypeAtom',
  default: null, // Can be null or a string like 'boilerNode', 'turbineNode', etc.
});


export const networkFlowDataAtom = atom({
  key: 'networkFlowDataAtom',
  default: {
    nodes: [],
    edges: [],
    saved: false
  },
});

// Template interface and atom for reusable node templates
export const templatesStateAtom = atom({
  key: 'templatesStateAtom',
  default: [],
});