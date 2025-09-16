import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Select from 'react-select'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import styles from './flow.module.scss'

import { edgeOptions, extractColorsFromSvg, text_box_resources } from './utils'

import {
    AppAtom,
    allTagsDataAtom,
    deleteAtom,
    nodeConfigAtom,
    plantListAtom,
    selectedEdgeIdAtom,
    selectedNodeIdAtom,
    selectedPageAtom,
    tagListAtom,
    updateConfigAtom,
    subSystemListAtom,
} from '../../pages/network/store'
import { BearingNodeFieldConfig } from './nodes/Bearing'
import { CouplingNodeFieldConfig } from './nodes/Coupling'
import { CompressorNodeFieldConfig } from './nodes/Compressor'
import { BoxNodeFieldConfig } from './nodes/Box'

import { HeatExchangerNodeFieldConfig } from './nodes/HeatExchanger'
import { TurbineNodeFieldConfig } from './nodes/Turbine'
import { SurfaceCondenserNodeFieldConfig } from './nodes/SurfaceCondenser'
import { KODNodeFieldConfig } from './nodes/Kod'
import { CentrifugalPumpNodeFieldConfig } from './nodes/CentrifugalPump'
import { ESVNodeFieldConfig } from './nodes/Esv'
import { EjectorNodeFieldConfig } from './nodes/Ejector'
import { TextBoxNodeFieldConfig } from './nodes/TextBox'
import { NDEJournalBearingNodeFieldConfig } from './nodes/NDEJournalBearing'
import { CompressorConfigNodeFieldConfig } from './nodes/CompressorConfig'
import { V2NodeFieldConfig } from './nodes/V2'

const nodeTypesConfig = {
    'bearing-node': BearingNodeFieldConfig,
    'coupling-node': CouplingNodeFieldConfig,
    'compressor-node': CompressorNodeFieldConfig,
    "compressor-config-node": CompressorConfigNodeFieldConfig,
    'box-node': BoxNodeFieldConfig,
    "heat-exchanger-node": HeatExchangerNodeFieldConfig,
    "turbine-node": TurbineNodeFieldConfig,
    "surface-condenser-node": SurfaceCondenserNodeFieldConfig,
    "kod-node": KODNodeFieldConfig,
    "centrifugal-pump-node": CentrifugalPumpNodeFieldConfig,
    "esv-node": ESVNodeFieldConfig,
    "ejector-node": EjectorNodeFieldConfig,
    "text-box-node": TextBoxNodeFieldConfig,
    "nde-journal-bearing-node": NDEJournalBearingNodeFieldConfig,
    "v2-node": V2NodeFieldConfig,
}
const switchStyles = {
    display: 'flex',
    alignItems: 'center',
}

const switchContainerStyles = {
    position: 'relative',
    width: '40px',
    height: '20px',
    borderRadius: '20px',
    transition: 'background-color 0.3s ease',
}

const switchKnobStyles = {
    position: 'absolute',
    top: '50%',
    width: '14px',
    height: '14px',
    backgroundColor: 'white',
    borderRadius: '50%',
    transition: 'left 0.3s ease-in-out',
    transform: 'translateY(-50%)',
}

// Hidden checkbox input
const inputStyles = {
    opacity: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    cursor: 'pointer',
    zIndex: 1,
}

const NodeConfigurator = () => {
    const params = useParams()
    const appContext = useRecoilValue(AppAtom)
    const [config, setConfig] = useRecoilState(nodeConfigAtom)
    const setShouldUpdateConfig = useSetRecoilState(updateConfigAtom)
    const plantList = useRecoilValue(plantListAtom)
    const [selectedNodeId, setSelectedNodeId] = useRecoilState(selectedNodeIdAtom)
    const [selectedEdgeId, setSelectedEdgeId] = useRecoilState(selectedEdgeIdAtom)
    const setDelete = useSetRecoilState(deleteAtom)
    const [showLinkModal, setShowLinkModal] = useState(false)
    const [selectedLink, setSelectedLink] = useState('linkedTag')
    const [selectedTag, setSelectedTag] = useState({})
    const tagsList = useRecoilValue(tagListAtom)
    const selectedPage = useRecoilValue(selectedPageAtom)
    const allTagsDataList = useRecoilValue(allTagsDataAtom)
    const subSystemList = useRecoilValue(subSystemListAtom) // ADD THIS
    const [extractedColors, setExtractedColors] = useState(null)
    const tagData = allTagsDataList?.find(
        (x) => x.tagId && x.tagId == config?.data?.linkedTag,
    )
    const tagData2 = allTagsDataList?.find(
        (x) => x.tagId && x.tagId == config?.data?.linkedTag2,
    )

    useEffect(() => {
        setConfig(null)
        setSelectedEdgeId(null)
        setSelectedNodeId(null)
        setSelectedTag({})
        setShowLinkModal(false)
    }, [selectedPage, setConfig, setSelectedEdgeId, setSelectedNodeId])

    useEffect(() => {
        if (config?.data?.svgPath) {
            extractColorsFromSvg(config.data.svgPath).then((colors) => {
                setExtractedColors(colors)
            })
        }
    }, [config?.data?.svgPath])

    function onSaveLinkModal() {
        if (selectedNodeId && selectedTag?.tagId) {
            if (selectedLink === 'linkedTag') {
                setConfig((p) => ({
                    ...p,
                    data: {
                        ...p.data,
                        linkedTag: selectedTag.tagId,
                    },
                }))
            } else if (selectedLink === 'linkedTag2') {
                setConfig((p) => ({
                    ...p,
                    data: {
                        ...p.data,
                        linkedTag2: selectedTag.tagId,
                    },
                }))
            } else if (selectedLink === 'linkedTag3') {
                setConfig((p) => ({
                    ...p,
                    data: {
                        ...p.data,
                        linkedTag3: selectedTag.tagId,
                    },
                }))
            }
            setSelectedTag({})
            setShowLinkModal(false)
        }
    }

    const handleUnlink = (tagName) => {
        setConfig((p) => ({
            ...p,
            data: {
                ...p.data,
                [tagName]: null,
            },
        }))
    }

    const handleColorChange = (e, counterpartName, counterpartValue) => {
        onConfigChange(e);
        const syntheticEvent = {
            target: {
                name: counterpartName,
                value: counterpartValue,
                type: 'color',
                checked: false,
            },
        };
        onConfigChange(syntheticEvent);
    };

    const onConfigChange = (event) => {
        const { name, value, type, checked } = event.target
        if (type === 'multi-select') {
            setConfig((prev) => ({
                ...prev,
                data: {
                    ...prev.data,
                    [name]: value, // This will be an array of selected values
                },
            }))
        } else if (name === 'template') {
            const selectedData = text_box_resources.find((x) => x.id === value)
            setConfig((prev) => ({
                ...prev,
                data: {
                    ...prev.data,
                    [name]: value,
                    backgroundColor: selectedData.bgColor,
                    borderColor: selectedData.borderColor,
                },
            }))
        } else if (type === 'checkbox') {
            setConfig((prev) => ({
                ...prev,
                data: {
                    ...prev.data,
                    [name]: checked,
                },
            }))
        } else {
            setConfig((prev) => ({
                ...prev,
                data: {
                    ...prev.data,
                    [name]:
                        name === 'numSourceHandles' ||
                            name === 'numTargetHandles' ||
                            name === 'numSourceHandlesRight' ||
                            name === 'numTargetHandlesTop' ||
                            name === 'numSourceHandlesBottom' ||
                            name === 'numTargetHandlesLeft'
                            ? parseInt(value)
                            : value,
                },
            }))
        }
    }

    const onEdgeConfigChange = (event) => {
        const { name, value } = event.target
        setConfig((prev) => ({
            ...prev,
            [name]: value,
            markerEnd: value,
        }))
    }

    const getOptionsList = (key) => {
        if (key === 'plant') {
            return [
                { id: null, name: 'Select Plant' },
                ...plantList.map((x) => ({
                    id: x.pageId,
                    name: x.pageName,
                })),
            ]
        }

        if (key === 'subSystem') {
            return [
                { id: null, name: 'Select Sub System' },
                ...subSystemList.map((x) => ({
                    id: x.id,
                    name: x.name,
                })),
            ]
        }

        return []
    }

    const getData = (selectedEdgeId, config) => {
        if (selectedEdgeId) {
            return config
        } else {
            return config?.data
        }
    }

    const getInputField = (field, data) => {
        if (field.type === 'number') {
            return (
                <div key={field.name}>
                    <label className="text-13-bold text-uppercase">
                        {field.label} :{' '}
                    </label>
                    <input
                        className="form-control text-14-regular"
                        type="number"
                        name={field.name}
                        value={data?.[field.name] || ''}
                        min={field.min}
                        onChange={onConfigChange}
                    />
                </div>
            )
        }

        if (field.type === 'text') {
            return (
                <div key={field.name}>
                    <label className="text-13-bold text-uppercase">
                        {field.label} :{' '}
                    </label>
                    <input
                        className="form-control text-14-regular"
                        type="text"
                        name={field.name}
                        value={data?.[field.name] || ''}
                        onChange={onConfigChange}
                    />
                </div>
            )
        }

        if (field.type === 'color') {
            return (
                <div key={field.name}>
                    <label className="text-13-bold text-uppercase">
                        {field.label} :{' '}
                    </label>
                    <input
                        className="form-control text-14-regular "
                        type="color"
                        name={field.name}
                        value={data?.[field.name] || ''}
                        onChange={onConfigChange}
                    />
                </div>
            )
        }

        if (field.type === 'gradientColor') {
            const colors = [
                {
                    name: 'gradientStart',
                    value: data.gradientStart ?? extractedColors?.gradientStart,
                    counterpart: 'gradientEnd',
                },
                {
                    name: 'gradientEnd',
                    value: data.gradientEnd ?? extractedColors?.gradientEnd,
                    counterpart: 'gradientStart',
                },
            ];
            return (
                <div key={field.name}>
                    <label className="text-13-bold text-uppercase">
                        {field.label} :
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {colors.map(({ name, value, counterpart }) => (
                            <input
                                key={name}
                                type="color"
                                name={name}
                                value={value}
                                onChange={(e) =>
                                    handleColorChange(
                                        e,
                                        counterpart,
                                        data[counterpart] ?? extractedColors?.[counterpart]
                                    )
                                }
                                className="form-control text-14-regular"
                            />
                        ))}
                    </div>
                </div>
            )
        }

        {
            if (field.name === 'strokeColor') {
                return (
                    <div key={field.name}>
                        <label className="text-13-bold text-uppercase">
                            {field.label} :
                        </label>
                        <input
                            type="color"
                            name="strokeColor"
                            value={data.strokeColor}
                            onChange={onConfigChange}
                            className="form-control text-14-regular"
                        />
                    </div>
                );
            }
        }


        if (field.type === 'switch') {
            const isChecked = data?.[field.name] || false
            return (
                <div
                    className="d-flex align-items-center gap-1"
                    key={field.name}
                    style={{ marginTop: '10px' }}
                >
                    <label className="text-13-bold text-uppercase">
                        {field.label} :
                    </label>
                    <div className={``} style={switchStyles}>
                        <label
                            style={{
                                ...switchContainerStyles,
                                backgroundColor: isChecked ? '#009fdf' : '#939598',
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={data?.[field.name] || ''}
                                name={field.name}
                                onChange={onConfigChange}
                                style={inputStyles}
                            />
                            <div
                                style={{
                                    ...switchKnobStyles,
                                    left: isChecked ? 'calc(100% - 17px)' : '3px',
                                }}
                            ></div>
                        </label>
                    </div>
                </div>
            )
        }
        if (field.type === 'multi-select') {
            const options = field.options ||  [
                { value: 'left', label: 'Left' },
                { value: 'right', label: 'Right' },
                { value: 'top', label: 'Top' },
                { value: 'bottom', label: 'Bottom' }
            ]
            const selectedValues = data?.[field.name] || []

            // Convert selected values to react-select format
            const selectedOptions = options.filter(option =>
                selectedValues.includes(option.value)
            )

            return (
                <div key={field.name}>
                    <label className="text-13-bold text-uppercase">
                        {field.label} :
                    </label>
                    <Select
                        isMulti
                        options={options}
                        value={selectedOptions}
                        onChange={(selected) => {
                            const selectedValues = selected ? selected.map(option => option.value) : []
                            // Create a synthetic event to maintain consistency
                            const syntheticEvent = {
                                target: {
                                    name: field.name,
                                    value: selectedValues,
                                    type: 'multi-select'
                                }
                            }
                            onConfigChange(syntheticEvent)
                        }}
                        className="text-14-regular"
                        styles={{
                            control: (base) => ({
                                ...base,
                                fontSize: '1.4vmin',
                                minHeight: '30px'
                            }),
                            menu: (base) => ({
                                ...base,
                                fontSize: '1.4vmin'
                            })
                        }}
                    />
                </div>
            )
        }

        return (
            <div key={field.name}>
                <label className="text-13-bold text-uppercase">
                    {field.label} :{' '}
                </label>
                <select
                    className="form-select"
                    name={field.name}
                    value={data?.[field.name] || ''}
                    onChange={onConfigChange}
                    style={{
                        fontSize: '1.4vmin',
                        width: '100',
                        borderRadius: '.3vmin',
                        border: 'none',
                    }}
                >
                    {(field.customOptionsKey
                        ? getOptionsList(field.customOptionsKey)
                        : field.options || []
                    ).map((resource) => (
                        <option key={resource.id} value={resource.id}>
                            {resource.name}
                        </option>
                    ))}
                </select>
            </div>
        )
    }

    // ADD THIS FUNCTION TO RENDER SUB SYSTEM SELECT BOX
    const renderSubSystemSelect = (data) => {
        return (
            <div key="sub-system-select">
                <label className="text-13-bold text-uppercase">
                    Sub System :{' '}
                </label>
                <select
                    className="form-select"
                    name="subSystem"
                    value={data?.subSystem || ''}
                    onChange={onConfigChange}
                    style={{
                        fontSize: '1.4vmin',
                        width: '100',
                        borderRadius: '.3vmin',
                        border: 'none',
                    }}
                >
                    <option value="">Select Sub System</option>
                    {subSystemList.map((system) => (
                        <option key={system.id} value={system.id}>
                            {system.name}
                        </option>
                    ))}
                </select>
            </div>
        )
    }

    const getLinkUnlinkBtn = (isLinkBtn, tag) => {
        if (isLinkBtn) {
            return <button
                className={`${styles.primaryBlueButton} text-14-regular text-uppercase`}
                onClick={() => {
                    //   TRACKEVENTOBJ.network.ConfigNodeLinkClick({
                    //     params,
                    //     caseData: appContext.caseData,
                    //   })
                    setShowLinkModal(true)
                    setSelectedLink(tag)
                }}
            >
                Link
            </button>
        } else {
            return <button
                className={`${styles.primaryGrayButton} text-14-regular text-uppercase`}
                onClick={() => handleUnlink(tag)}
            >
                Unlink
            </button>
        }
    }

    const data = getData(selectedEdgeId, config)
    const fieldsToRender = nodeTypesConfig[config?.nodeType]?.fields || []
    const showLinkModalButton =
        nodeTypesConfig[config?.nodeType]?.showLinkModal || false

    if (!selectedNodeId && !selectedEdgeId) {
        return (
            <div className='h-100'>
                <h3 className="text-14-bold text-uppercase mb_1">Configure Node</h3>
                <p className="text-12-regular text-uppercase">
                    Please select a node/edge to configure
                </p>
            </div>
        )
    }

    if (selectedNodeId) {
        return (
            <div className='h-100'>
                <h3 className="text-14-bold mb_1 text-uppercase">Configure Node</h3>
                <p className="text-13-bold text-uppercase mb_05">
                    Node id :{' '}
                    <span className="text-13-bold text_primary_gray_2">{config.id}</span>
                </p>
                <p className="text-13-bold text-uppercase mb_1">
                    Node Name :{' '}
                    <span className="text-13-bold text_primary_gray_2">
                        {config.name}
                    </span>
                </p>
                <>
                    {fieldsToRender.map((field) => getInputField(field, data))}

                    {/* ADD SUB SYSTEM SELECT BOX HERE - IT WILL APPEAR FOR ALL NODES */}
                    {renderSubSystemSelect(data)}

                    <div className="d-flex align-items-center flex-wrap mt-2 gap-2">
                        <button
                            className={`${styles.primaryBlueButton} text-14-regular text-uppercase`}
                            onClick={() => {
                                // TRACKEVENTOBJ.network.ConfigNodeApplyClick({
                                //   params,
                                //   caseData: appContext.caseData,
                                // })
                                setShouldUpdateConfig(true)
                            }}
                        >
                            Apply
                        </button>
                        <button
                            className={`${styles.primaryGrayButton} text-14-regular text-uppercase`}
                            onClick={() => {
                                // TRACKEVENTOBJ.network.ConfigNodeCloseClick({
                                //   params,
                                //   caseData: appContext.caseData,
                                // })
                                setSelectedNodeId(null)
                            }}
                        >
                            Close
                        </button>
                        <button
                            className={`${styles.primaryRedButton} text-14-regular text-uppercase`}
                            onClick={() => {
                                // TRACKEVENTOBJ.network.ConfigNodeDeleteClick({
                                //   params,
                                //   caseData: appContext?.caseData,
                                // })
                                setDelete(true)
                            }}
                        >
                            Delete
                        </button>
                    </div>

                    <div className="text-13-regular text-uppercase">
                        Note: All changes to the node will only be applied upon clicking
                        Apply button
                    </div>
                </>
            </div>
        )
    }

    return (
        <div className='h-100'>
            <h3 className="text-14-bold mb_1">Configure Edge</h3>
            <p className="text-13-bold">
                Edge id : <span className="text_primary_gray_2">{config.id}</span>
            </p>
            <div>
                <label className="text-13-bold text-uppercase">Color : </label>
                <select
                    className="form-select"
                    name={'type'}
                    value={data?.type || ''}
                    onChange={onEdgeConfigChange}
                    style={{
                        fontSize: '1.4vmin',
                        width: '100%',
                        borderRadius: '.3vmin',
                        border: 'none',
                    }}
                >
                    {edgeOptions.map((resource) => (
                        <option key={resource.id} value={resource.id}>
                            {resource.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="d-flex flex-wrap gap-1 mt-2">
                <button
                    className={`${styles.primaryBlueButton} text-14-regular text-uppercase`}
                    onClick={() => setShouldUpdateConfig(true)}
                >
                    Apply
                </button>
                <button
                    className={`${styles.primaryGrayButton} text-14-regular text-uppercase`}
                    onClick={() => setSelectedEdgeId(null)}
                >
                    Close
                </button>
                <button
                    className={`${styles.primaryRedButton} text-14-regular text-uppercase`}
                    onClick={() => setDelete(true)}
                >
                    Delete
                </button>
            </div>
        </div>
    )
}

export default NodeConfigurator