import { useState, useEffect, useRef } from 'react';
import styles from './SvgNode.module.scss';

const SvgNode = ({
  id,
  data,
  svgPath,
  nodeType,
  defaultNodeColor = "#d3d3d3",
  defaultStrokeColor = "#000000",
  HandlesComponent,
  isHighlighted = false,
}) => {
  const {
    nodeColor = defaultNodeColor,
    color = defaultNodeColor,
    strokeColor = defaultStrokeColor,
    tag,
    subTag,
    targetHandles = [],
  } = data;

  const [svgContent, setSvgContent] = useState(null);
  const [useDefaultSvgColors, setUseDefaultSvgColors] = useState(true);
  const svgContainerRef = useRef(null);

  const processSvg = (svgText, fillColor, strokeColor, isHighlighted, useDefaultColors = false, gradientStart, gradientEnd, nodeId) => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgText, 'image/svg+xml');
      const svgElement = doc.documentElement;

      // --- calculate bounding box ---
      // create a throwaway <svg> in memory so getBBox works
       const tempSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        tempSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        tempSvg.style.position = "absolute";
        tempSvg.style.visibility = "hidden";
        tempSvg.style.width = "0";
        tempSvg.style.height = "0";
        document.body.appendChild(tempSvg);
        Array.from(svgElement.childNodes).forEach(node => tempSvg.appendChild(node.cloneNode(true)));
        const bbox = tempSvg.getBBox();
        document.body.removeChild(tempSvg);
        svgElement.setAttribute("viewBox", `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);
        svgElement.setAttribute("width", "100%");
        svgElement.setAttribute("height", "100%");
        svgElement.setAttribute("preserveAspectRatio", "none");

      // highlight
      if (isHighlighted) {
        const existingClass = svgElement.getAttribute('class') || '';
        svgElement.setAttribute('class', `${existingClass} ${styles.highlighted}`.trim());
      }
        const gradientId = `customGradient-${nodeId}`;
        svgElement.setAttribute("id", `svg-node-${nodeType}`);
      // --- Gradient ---
    if (gradientStart && gradientEnd) {
        const defs = doc.createElementNS("http://www.w3.org/2000/svg", "defs");
        const linearGrad = doc.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
        linearGrad.setAttribute("id", gradientId);
        linearGrad.setAttribute("x1", "0%");
        linearGrad.setAttribute("y1", "0%");
        linearGrad.setAttribute("x2", "0%");
        linearGrad.setAttribute("y2", "100%");
 
        const stop1 = doc.createElementNS("http://www.w3.org/2000/svg", "stop");
        stop1.setAttribute("offset", "0%");
        stop1.setAttribute("stop-color", gradientEnd);
        linearGrad.appendChild(stop1);
 
        const stop2 = doc.createElementNS("http://www.w3.org/2000/svg", "stop");
        stop2.setAttribute("offset", "50%");
        stop2.setAttribute("stop-color", gradientStart);
        linearGrad.appendChild(stop2);
 
        const stop3 = doc.createElementNS("http://www.w3.org/2000/svg", "stop");
        stop3.setAttribute("offset", "100%");
        stop3.setAttribute("stop-color", gradientEnd);
        linearGrad.appendChild(stop3);
 
        defs.appendChild(linearGrad);
        svgElement.insertBefore(defs, svgElement.firstChild);
 
        svgElement.querySelectorAll("[fill]").forEach(el => {
          if (el.getAttribute("fill") !== "none") {
            el.setAttribute("fill", `url(#${gradientId})`);
          }
        });
        svgElement.querySelectorAll("[stroke]").forEach(el => {
          if (el.getAttribute("stroke") !== "none") {
            el.setAttribute("stroke", strokeColor);
          }
        });
      } else if (fillColor) {
        svgElement.querySelectorAll("[fill]").forEach(el => {
          if (el.getAttribute("fill") !== "none") el.setAttribute("fill", fillColor);
        });
        svgElement.querySelectorAll("[stroke]").forEach(el => {
          if (el.getAttribute("stroke") !== "none") el.setAttribute("stroke", strokeColor);
        });
      }

      // recolor
      // if (!useDefaultColors) {
      //   svgElement.querySelectorAll('[fill]').forEach(el => {
      //     if (el.getAttribute('fill') !== 'none') el.setAttribute('fill', fillColor);
      //   });
      //   svgElement.querySelectorAll('[stroke]').forEach(el => {
      //     if (el.getAttribute('stroke') !== 'none') el.setAttribute('stroke', strokeColor);
      //   });
      // }

      return svgElement.outerHTML;
    } catch (err) {
      console.error('Error processing SVG:', err);
      return svgText;
    }
  };

  useEffect(() => {
    const fetchSvg = async () => {
      try {
        const response = await fetch(svgPath);
        let svgText = await response.text();

        // Do not set explicit dimensions on the SVG here, let CSS handle it
        svgText = processSvg(svgText,color, strokeColor, isHighlighted, useDefaultSvgColors, data.gradientStart, data.gradientEnd, id);
        console.log(svgText)
        setSvgContent(svgText);
      } catch (error) {
        console.error('Error loading SVG:', error);
        setSvgContent(null);
      }
    };

    fetchSvg();
  }, [svgPath, isHighlighted, color, strokeColor, useDefaultSvgColors, data.gradientStart, data.gradientEnd, id]);

  // useEffect(() => {
  //   if (useDefaultSvgColors && (nodeColor !== defaultNodeColor || strokeColor !== defaultStrokeColor)) {
  //     setUseDefaultSvgColors(false);
  //   }
  // }, [nodeColor, strokeColor, defaultNodeColor, defaultStrokeColor]);


  useEffect(() => {
    if (useDefaultSvgColors && (nodeColor !== defaultNodeColor || strokeColor !== defaultStrokeColor || data.gradientStart || data.gradientEnd)) {
      setUseDefaultSvgColors(false);
    }
  }, [nodeColor, strokeColor, defaultNodeColor, defaultStrokeColor, data.gradientStart, data.gradientEnd]);

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
            targetHandles={targetHandles}
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