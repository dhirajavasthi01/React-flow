import { useState, useEffect, useRef } from 'react';
import styles from './SvgNode.module.scss';

const SvgNode = ({ 
  id,
  data,
  svgPath,
  defaultNodeColor = "#d3d3d3",
  defaultStrokeColor = "#000000",
  HandlesComponent,
  isHighlighted = false,
}) => {
  const { 
    nodeColor = defaultNodeColor, 
    strokeColor = defaultStrokeColor,
    tag,
    subTag
  } = data;

  const [svgContent, setSvgContent] = useState(null);
  const [useDefaultSvgColors, setUseDefaultSvgColors] = useState(true);
  const svgContainerRef = useRef(null);

  const processSvg = (svgText, fillColor, strokeColor, isHighlighted, useDefaultColors = false) => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgText, 'image/svg+xml');
      const svgElement = doc.documentElement;
      
      // Use 100% width and height to fill the parent container
      svgElement.setAttribute('width', '100%');
      svgElement.setAttribute('height', '100%');
      svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      
      // Add highlight class if isHighlighted is true
      if (isHighlighted) {
        const existingClass = svgElement.getAttribute('class') || '';
        svgElement.setAttribute('class', `${existingClass} ${styles.highlighted}`.trim());
      }
      
      // Only apply custom colors if not using default SVG colors
      if (!useDefaultColors) {
        const elementsWithFill = svgElement.querySelectorAll('[fill]');
        elementsWithFill.forEach(el => {
          if (el.getAttribute('fill') !== 'none') {
            el.setAttribute('fill', fillColor);
          }
        });
        
        const elementsWithStroke = svgElement.querySelectorAll('[stroke]');
        elementsWithStroke.forEach(el => {
          if (el.getAttribute('stroke') !== 'none') {
            el.setAttribute('stroke', strokeColor);
          }
        });
      }
      
      return svgElement.outerHTML;
    } catch (error) {
      console.error('Error processing SVG:', error);
      return svgText;
    }
  };

  useEffect(() => {
    const fetchSvg = async () => {
      try {
        const response = await fetch(svgPath);
        let svgText = await response.text();
        
        // Do not set explicit dimensions on the SVG here, let CSS handle it
        svgText = processSvg(svgText, nodeColor, strokeColor, isHighlighted, useDefaultSvgColors);
        console.log(svgText)
        setSvgContent(svgText);
      } catch (error) {
        console.error('Error loading SVG:', error);
        setSvgContent(null);
      }
    };

    fetchSvg();
  }, [svgPath, isHighlighted, nodeColor, strokeColor, useDefaultSvgColors]);

  useEffect(() => {
    if (useDefaultSvgColors && (nodeColor !== defaultNodeColor || strokeColor !== defaultStrokeColor)) {
      setUseDefaultSvgColors(false);
    }
  }, [nodeColor, strokeColor, defaultNodeColor, defaultStrokeColor]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        // border: isNodeActive ? '2px solid green' : 'none',
      }}
    >
      {/* Tag label if provided */}
      {tag && tag.trim() !== '' && (
        <div style={{ marginBottom: '8px', textAlign: 'center' }}>
          <p style={{ 
            margin: 0, 
            fontSize: '14px', 
            fontWeight: 'regular',
            wordBreak: 'break-word'
          }}>
            {tag}
          </p>
        </div>
      )}

      {/* SVG with customization */}
      <div
        ref={svgContainerRef}
        style={{ 
          position: 'relative', 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
        }}
      >
        {svgContent ? (
          <div 
            dangerouslySetInnerHTML={{ __html: svgContent }}
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
        ) : (
          <img 
            src={svgPath} 
            alt="Node" 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
            className={` ${isHighlighted ? styles.highlighted : ''}`}
          />
        )}
        
        {/* Handles if provided - pass node dimensions */}
        {HandlesComponent && (
          <HandlesComponent 
            id={id} 
            containerRef={svgContainerRef} 
          />
        )}
      </div>

      {/* Subtag label if provided */}
      {subTag && subTag.trim() !== '' && (
        <div style={{ marginTop: '8px', textAlign: 'center' }}>
          <p style={{ 
            margin: 0, 
            fontSize: '14px', 
            fontWeight: 'regular',
            wordBreak: 'break-word'
          }}>
            {subTag}
          </p>
        </div>
      )}
    </div>
  );
};

export default SvgNode;