export const extractColorsFromSvg = async (svgPath) => {
  try {
    const response = await fetch(svgPath);
    const svgText = await response.text();
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgText, 'image/svg+xml');
    const svgElement = doc.documentElement;
    
    let gradientStart = null;
    let gradientEnd = null;
    let fillColor = null;
    
    // Check for gradients
    const gradients = svgElement.querySelectorAll('linearGradient, radialGradient');
    if (gradients.length > 0) {
      const gradient = gradients[0];
      const stops = gradient.querySelectorAll('stop');
      
      if (stops.length >= 2) {
        gradientStart = stops[0].getAttribute('stop-color') || null;
        gradientEnd = stops[stops.length - 1].getAttribute('stop-color') || null;
      }
    }
    
    // If no gradient found, look for fill colors
    if (!gradientStart && !gradientEnd) {
      const filledElements = svgElement.querySelectorAll('[fill]:not([fill="none"]):not([fill^="url"])');
      if (filledElements.length > 0) {
        for (let el of filledElements) {
          const color = el.getAttribute('fill');
          if (color && color !== 'none' && !color.startsWith('url')) {
            fillColor = color;
            break;
          }
        }
      }
    }
    
    return {
      gradientStart: gradientStart || fillColor,
      gradientEnd: gradientEnd || fillColor
    };
    
  } catch (error) {
    console.error('Error extracting SVG colors:', error);
    return {
      gradientStart: null,
      gradientEnd: null
    };
  }
};



export const text_box_resources = [
  {
    name: 'Green',
    id: 'Green',
  },
  {
    name: 'Blue',
    id: 'Blue',
  },
]

export const edgeOptions = [
  {
    name: 'Default',
    id: 'default',
    bgColor: 'rgba(0, 0, 0, 0.7)',
    legendSortOrder: 1,
  },
  {
    name: 'Fuel',
    id: 'flowingPipeline1',
    bgColor: 'rgba(255, 165, 0, 0.7)',
    legendSortOrder: 2,
  },
  {
    name: 'Power',
    id: 'flowingPipelinePower',
    bgColor: 'rgba(169, 169, 169, 0.7)',
    legendSortOrder: 2,
  },
  {
    name: 'HP Steam',
    id: 'flowingPipeline4',
    bgColor: 'rgba(255, 165, 0, 0.7)',
    legendSortOrder: 3,
  },
  {
    name: 'MP Steam',
    id: 'flowingPipeline5',
    bgColor: 'rgba(30, 144, 255, 0.7)',
    legendSortOrder: 4,
  },
  {
    name: 'LP Steam',
    id: 'flowingPipeline6',
    bgColor: 'rgba(0, 255, 0, 0.7)',
    legendSortOrder: 5,
  },
  {
    name: 'Water',
    id: 'flowingPipelineWater',
    bgColor: 'rgba(135, 206, 250, 0.7)',
    legendSortOrder: 6,
  },
  {
    name: 'Suspect Condensate',
    id: 'flowingPipelineCondensate',
    bgColor: 'rgba(152, 51, 153, 0.8)',
    legendSortOrder: 7,
  },
  {
    name: 'Clean Condensate',
    id: 'flowingPipelineCleanCondensate',
    bgColor: 'rgba(95, 158, 160, 0.7)',
    legendSortOrder: 8,
  },
  {
    name: 'Air',
    id: 'flowingPipelineAir',
    bgColor: 'rgba(139, 170, 170, 0.5)',
    legendSortOrder: 13,
  },
  {
    name: 'Cooling Water',
    id: 'flowingPipelineCoolingWater',
    bgColor: 'rgba(0, 191, 255, 0.5)',
    legendSortOrder: 14,
  },
]
