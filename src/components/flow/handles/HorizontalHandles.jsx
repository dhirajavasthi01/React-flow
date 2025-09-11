import { Handle, Position } from '@xyflow/react'
import { showHandlesAtom } from '../../../pages/network/store'
import { useRecoilValue } from 'recoil'
import { useEffect, useState } from 'react'

const HorizontalHandles = ({ id, containerRef, nodeWidth = 100, nodeHeight = 200 }) => {
  const showHandles = useRecoilValue(showHandlesAtom)
  const [handlePosition, setHandlePosition] = useState({
    left: -10,
    right: -10,
    top: -10,
    bottom: -10
  })

  useEffect(() => {
    if (!containerRef?.current) return;

    const updateHandlePosition = () => {
      const container = containerRef.current;
      const svgElement = container.querySelector('svg') || container.querySelector('img');

      if (!svgElement) return;

      // Get the bounding rectangle of the SVG element
      const svgRect = svgElement.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      // Calculate dynamic offset based on node size
      // Base offset for default size (100x200)
      const baseOffset = 10;

      // Scale offset based on node width (proportional scaling)
      const widthScale = nodeWidth / 100; // 100 is default width
      const heightScale = nodeHeight / 200; // 200 is default height

      // Use average scaling or prioritize width scaling
      const scaleFactor = (widthScale + heightScale) / 2;

      // Calculate dynamic offset
      const dynamicOffset = baseOffset * scaleFactor;

      // Calculate handle positions to be on the SVG stroke
      const leftPosition = svgRect.left - containerRect.left + dynamicOffset;
      const rightPosition = containerRect.right - svgRect.right + dynamicOffset;
      const topPosition = svgRect.top - containerRect.top + dynamicOffset;
      const bottomPosition = containerRect.bottom - svgRect.bottom + dynamicOffset;

      setHandlePosition({
        left: leftPosition,
        right: rightPosition,
        top: topPosition,
        bottom: bottomPosition
      });
    };

    // Initial calculation
    updateHandlePosition();

    // Set up resize observer to update on size changes
    const resizeObserver = new ResizeObserver(updateHandlePosition);
    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, [containerRef, nodeWidth, nodeHeight]); // Add node dimensions to dependencies

  // Handle styles
  const handleStyle = {
    // position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    opacity: showHandles ? 1 : 0,
    transition: 'opacity 0.3s ease',
  }


  return (
    <>
      {/* Target handle on the left side */}
      <Handle
        key={`${id}-target-handle-left`}
        type="target"
        position={Position.Left}
        id={`${id}-target-handle-left`}
        style={{
          ...handleStyle,
          // left: `${handlePosition.left}px`,
          left: -4,
          height: '42px',
          width: '42px'
        }}
      />

      {/* Source handle on the right side */}
      <Handle
        key={`${id}-target-handle-right`}
        type="source"
        position={Position.Right}
        id={`${id}-target-handle-right`}
        style={{
          ...handleStyle,
          // right: `${handlePosition.right}px`,
          right: -4,
          height: '42px',
          width: '42px'
        }}
      />

        {/* Top handle */}
      <Handle
        key={`${id}-handle-top`}
        type="target"
        position={Position.Top}
        id={`${id}-handle-top`}
        style={{
          ...handleStyle,
          top: -4,
          left: '50%',
          transform: 'translateX(-50%)',
          height: '42px',
          width: '42px'
        }}
      />

      {/* Bottom handle */}
      <Handle
        key={`${id}-handle-bottom`}
        type="source"
        position={Position.Bottom}
        id={`${id}-handle-bottom`}
        style={{
          ...handleStyle,
          top: 'auto',
          bottom: -4,
          left: '50%',
          transform: 'translateX(-50%)',
          height: '42px',
          width: '42px'
        }}
      />
    </>
  )
}

export default HorizontalHandles