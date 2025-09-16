import { EDGE_COLORS } from "../utils";

const Marker = ({ type }) => {
    const { borderColor } = EDGE_COLORS[type] || {};
    return (
        <svg
            className="react-flow__marker"
            style={{ position: "absolute", width: 0, height: 0 }}
        >
            <defs>
                <marker
                    id={type}
                    markerWidth="7"
                    markerHeight="7"
                    viewBox="-10 -10 20 20"
                    markerUnits="strokeWidth"
                    orient="auto-start-reverse"
                    refX="0"
                    refY="0"
                >
                    <polyline
                        points="-8,-6 0,0 -8,6 -8,-6"
                        style={{
                            stroke: borderColor,
                            fill: borderColor,
                            strokeWidth: 1.5,
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                        }}
                    />
                </marker>

            </defs>
        </svg>
    );
};

export default Marker;
