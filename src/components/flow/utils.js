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
export const EXTRA_NODE_COLORS = {

  "Green": {
    bgColor: "rgba(181, 213, 167, 0.8)",
    borderColor: "rgb(181, 213, 167)",
  },
  "Blue": {
    bgColor: "rgba(91, 155, 213, 0.8)",
    borderColor: "rgb(91, 155, 213)",
  },
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

const NETWORK_COLOUR_OPTIONS = {
  default: {
    bgColor: '#ffffff',
    borderColor: '#000000',
  },
  fuel: {
    bgColor: 'rgba(255, 0, 0, 0.5)',
    borderColor: 'red',
  },
  power: {
    bgColor: 'rgba(169, 169, 169, 0.5)',
    borderColor: 'gray',
  },
  hp: {
    bgColor: 'rgba(255, 165, 0, 0.5)',
    borderColor: 'orange',
  },
  mp: {
    bgColor: 'rgba(255, 255, 0, 0.5)',
    borderColor: 'rgb(255, 255, 0)',
  },
  lp: {
    bgColor: 'rgba(0, 0, 255, 0.5)',
    borderColor: 'blue',
  },
  water: {
    bgColor: 'rgba(154, 194, 246, 0.5)',
    borderColor: 'rgb(154, 194, 246)',
  },
  suspect: {
    bgColor: 'rgba(104, 52, 155, 0.5)',
    borderColor: 'rgb(104, 52, 155)',
  },
  clean: {
    bgColor: 'rgba(79, 113, 190, 0.5)',
    borderColor: 'rgb(79, 113, 190)',
  },
  vhp: {
    bgColor: 'rgba(255, 102, 0, 0.5)',
    borderColor: 'rgb(255, 102, 0)',
  },
  air: {
    bgColor: 'rgba(153, 173, 170, 0.5)',
    borderColor: 'rgb(153, 173, 170)',
  },
  coolingWater: {
    bgColor: 'rgba(66, 197, 245, 0.5)',
    borderColor: 'rgb(66, 197, 245)',
  },
};

export const EDGE_COLORS = {
  flowingPipe: NETWORK_COLOUR_OPTIONS.default,
  flowingPipeFuel: NETWORK_COLOUR_OPTIONS.fuel,
  flowingPipePower: NETWORK_COLOUR_OPTIONS.power,
  flowingPipeHp: NETWORK_COLOUR_OPTIONS.hp,
  flowingPipeMp: NETWORK_COLOUR_OPTIONS.mp,
  flowingPipeLp: NETWORK_COLOUR_OPTIONS.lp,
  flowingPipeWater: NETWORK_COLOUR_OPTIONS.water,
  flowingPipSuspectCondensate: NETWORK_COLOUR_OPTIONS.suspect,
  flowingPipeCleanCondensate: NETWORK_COLOUR_OPTIONS.clean,
  flowingPipeVhp: NETWORK_COLOUR_OPTIONS.vhp,
  flowingPipeAir: NETWORK_COLOUR_OPTIONS.air,
  flowingPipeCoolingWater: NETWORK_COLOUR_OPTIONS.coolingWater,
};


export const edgeOptions = [
  {
    name: 'Default',
    id: 'default',
    bgColor: 'rgba(0, 0, 0, 0.7)',
    legendSortOrder: 1,
  },
  {
    name: 'Fuel',
    id: 'flowingPipeFuel',
    bgColor: 'rgba(255, 165, 0, 0.7)',
    legendSortOrder: 2,
  },
  {
    name: 'Power',
    id: 'flowingPipePower',
    bgColor: 'rgba(169, 169, 169, 0.7)',
    legendSortOrder: 2,
  },
  {
    name: 'HP Steam',
    id: 'flowingPipeHp',
    bgColor: 'rgba(255, 165, 0, 0.7)',
    legendSortOrder: 3,
  },
  {
    name: 'MP Steam',
    id: 'flowingPipeMp',
    bgColor: 'rgba(30, 144, 255, 0.7)',
    legendSortOrder: 4,
  },
  {
    name: 'LP Steam',
    id: 'flowingPipeLp',
    bgColor: 'rgba(0, 255, 0, 0.7)',
    legendSortOrder: 5,
  },
  {
    name: 'Water',
    id: 'flowingPipeWater',
    bgColor: 'rgba(135, 206, 250, 0.7)',
    legendSortOrder: 6,
  },
  {
    name: 'Suspect Condensate',
    id: 'flowingPipSuspectCondensate',
    bgColor: 'rgba(152, 51, 153, 0.8)',
    legendSortOrder: 7,
  },
  {
    name: 'Clean Condensate',
    id: 'flowingPipeCleanCondensate',
    bgColor: 'rgba(95, 158, 160, 0.7)',
    legendSortOrder: 8,
  },
  {
    name: 'Air',
    id: 'flowingPipeAir',
    bgColor: 'rgba(139, 170, 170, 0.5)',
    legendSortOrder: 13,
  },
  {
    name: 'Cooling Water',
    id: 'flowingPipeCoolingWater',
    bgColor: 'rgba(0, 191, 255, 0.5)',
    legendSortOrder: 14,
  },
]
