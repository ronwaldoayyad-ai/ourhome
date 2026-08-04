import { ROOMS } from '../data';

// A simple top-down 2D schematic generated from the same room data used by the
// 3D model. World X→svg x, world Z→svg y. Scale meters→px.
const SCALE = 26;
const OX = 310; // origin x (world x=0) — shifted right to fit the west-side lanai
const OZ = 240; // origin y (world z=0)

export default function FloorPlan() {
  const toX = (x) => OX + x * SCALE;
  const toY = (z) => OZ + z * SCALE;

  return (
    <svg className="floorplan" viewBox="0 0 580 480" role="img" aria-label="Floor plan">
      {/* lot */}
      <rect x="10" y="10" width="560" height="460" rx="10" fill="#f3efe8" stroke="#d8cfbf" />

      {ROOMS.map((r) => {
        const [cx, cz] = r.center;
        const [w, d] = r.size;
        return (
          <g key={r.id}>
            <rect
              x={toX(cx - w / 2)}
              y={toY(cz - d / 2)}
              width={w * SCALE}
              height={d * SCALE}
              fill={r.color}
              fillOpacity={r.zone === 'lanai' ? 0.5 : 0.8}
              stroke="#5b5347"
              strokeWidth="1.5"
              strokeDasharray={r.zone === 'lanai' ? '5 4' : '0'}
            />
            <text x={toX(cx)} y={toY(cz) - 4} textAnchor="middle" className="fp-name">
              {r.name}
            </text>
            <text x={toX(cx)} y={toY(cz) + 12} textAnchor="middle" className="fp-area">
              {r.area} m²
            </text>
          </g>
        );
      })}

      {/* front / rear labels */}
      <text x="330" y="465" textAnchor="middle" className="fp-dir">FRONT (porch)</text>
      <text x="330" y="24" textAnchor="middle" className="fp-dir">REAR (garden)</text>
      <text x="70" y="24" textAnchor="middle" className="fp-dir">WEST (carport)</text>
    </svg>
  );
}
