import { useMemo } from 'react';
import * as THREE from 'three';
import { WALL_H, GRID } from '../data';

const { xW, x1, x2, xE, zR, z1, z2, zF } = GRID;
const bathDiv = -4.45; // bathroom | laundry divider (left-rear)

// A wall drawn between two points on the XZ plane. Optionally leaves a
// centered doorway gap of `door` meters wide (split into two segments).
function Wall({ a, b, height = WALL_H, thickness = 0.15, color = '#eae4da', door = 0, map = null, roughness = 0.95 }) {
  const [ax, az] = a;
  const [bx, bz] = b;
  const dx = bx - ax;
  const dz = bz - az;
  const len = Math.hypot(dx, dz);
  const angle = Math.atan2(dz, dx);
  const mx = (ax + bx) / 2;
  const mz = (az + bz) / 2;

  const segments =
    door > 0 && door < len
      ? [(len - door) / 2, (len - door) / 2].map((segLen, i) => {
          const dir = i === 0 ? -1 : 1;
          const off = dir * (door / 2 + segLen / 2);
          return { segLen, cx: mx + Math.cos(angle) * off, cz: mz + Math.sin(angle) * off };
        })
      : [{ segLen: len, cx: mx, cz: mz }];

  return (
    <group>
      {segments.map((s, i) => (
        <mesh key={i} position={[s.cx, height / 2, s.cz]} rotation={[0, -angle, 0]} castShadow receiveShadow>
          <boxGeometry args={[s.segLen, height, thickness]} />
          <meshStandardMaterial color={color} map={map} bumpMap={map} bumpScale={0.05} roughness={roughness} />
        </mesh>
      ))}
    </group>
  );
}

function FrameBar({ position, args }) {
  return (
    <mesh position={position} castShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial color="#2c2d30" metalness={0.65} roughness={0.35} />
    </mesh>
  );
}

// A framed tinted-glass window sitting flush on an exterior wall.
function Window({ position, size = [1.6, 1.3], rotation = [0, 0, 0] }) {
  const [w, h] = size;
  const t = 0.07;
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial
          color="#9ec3d6"
          transparent
          opacity={0.42}
          roughness={0.04}
          metalness={0.5}
          emissive="#33566a"
          emissiveIntensity={0.18}
        />
      </mesh>
      <FrameBar position={[0, h / 2, 0.02]} args={[w + t, t, 0.1]} />
      <FrameBar position={[0, -h / 2, 0.02]} args={[w + t, t, 0.1]} />
      <FrameBar position={[-w / 2, 0, 0.02]} args={[t, h + t, 0.1]} />
      <FrameBar position={[w / 2, 0, 0.02]} args={[t, h + t, 0.1]} />
      {w > 2 && <FrameBar position={[0, 0, 0.02]} args={[t * 0.7, h, 0.07]} />}
      {h > 2 && <FrameBar position={[0, 0, 0.02]} args={[w, t * 0.7, 0.07]} />}
    </group>
  );
}

// A visible wooden door leaf standing in a doorway on an X-running wall.
function Door({ x, z, w = 0.9, open = 0.5, flip = 1 }) {
  const leafW = w - 0.06;
  return (
    <group position={[x - flip * (w / 2), 0, z]} rotation={[0, flip * open, 0]}>
      <mesh position={[flip * (leafW / 2), 1.05, 0]} castShadow>
        <boxGeometry args={[leafW, 2.1, 0.05]} />
        <meshStandardMaterial color="#6f5334" roughness={0.85} />
      </mesh>
      <mesh position={[flip * (leafW - 0.12), 1.0, 0.06]}>
        <sphereGeometry args={[0.045, 10, 10]} />
        <meshStandardMaterial color="#caa94a" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}

// A parked sedan for the carport.
function Car({ x, z, rot = 0 }) {
  const paint = '#8f9aa6';
  const glass = '#cfe0ea';
  return (
    <group position={[x, 0, z]} rotation={[0, rot, 0]}>
      <mesh position={[0, 0.52, 0]} castShadow>
        <boxGeometry args={[1.82, 0.44, 4.4]} />
        <meshStandardMaterial color={paint} metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[1.86, 0.2, 4.3]} />
        <meshStandardMaterial color="#2b2e33" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.94, -0.25]} castShadow>
        <boxGeometry args={[1.64, 0.48, 1.9]} />
        <meshStandardMaterial color={paint} metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0, 1.18, -0.3]} castShadow>
        <boxGeometry args={[1.5, 0.06, 1.7]} />
        <meshStandardMaterial color={paint} metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.99, 0.72]} rotation={[0.62, 0, 0]}>
        <boxGeometry args={[1.5, 0.55, 0.04]} />
        <meshStandardMaterial color={glass} metalness={0.4} roughness={0.1} transparent opacity={0.7} />
      </mesh>
      <mesh position={[0, 0.99, -1.22]} rotation={[-0.6, 0, 0]}>
        <boxGeometry args={[1.5, 0.5, 0.04]} />
        <meshStandardMaterial color={glass} metalness={0.4} roughness={0.1} transparent opacity={0.7} />
      </mesh>
      {[-0.83, 0.83].map((sx) => (
        <mesh key={sx} position={[sx, 0.98, -0.3]}>
          <boxGeometry args={[0.03, 0.4, 1.55]} />
          <meshStandardMaterial color={glass} metalness={0.4} roughness={0.1} transparent opacity={0.6} />
        </mesh>
      ))}
      {[-0.6, 0.6].map((hx) => (
        <mesh key={`h${hx}`} position={[hx, 0.54, 2.19]}>
          <boxGeometry args={[0.34, 0.15, 0.04]} />
          <meshStandardMaterial color="#eef2f0" emissive="#ffffff" emissiveIntensity={0.3} />
        </mesh>
      ))}
      <mesh position={[0, 0.46, 2.2]}>
        <boxGeometry args={[0.75, 0.18, 0.03]} />
        <meshStandardMaterial color="#191b1e" />
      </mesh>
      {[-0.6, 0.6].map((hx) => (
        <mesh key={`t${hx}`} position={[hx, 0.54, -2.19]}>
          <boxGeometry args={[0.34, 0.15, 0.04]} />
          <meshStandardMaterial color="#a01c1c" emissive="#c62222" emissiveIntensity={0.35} />
        </mesh>
      ))}
      {[
        [-0.9, 1.45],
        [0.9, 1.45],
        [-0.9, -1.45],
        [0.9, -1.45],
      ].map(([wx, wz], i) => (
        <group key={i} position={[wx, 0.33, wz]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.33, 0.33, 0.2, 18]} />
            <meshStandardMaterial color="#161616" roughness={0.8} />
          </mesh>
          <mesh position={[wx > 0 ? 0.11 : -0.11, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.17, 0.17, 0.02, 12]} />
            <meshStandardMaterial color="#c8ccd0" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function ACHead({ pos, rot = 0 }) {
  return (
    <group position={pos} rotation={[0, rot, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.85, 0.26, 0.2]} />
        <meshStandardMaterial color="#f5f4ef" />
      </mesh>
      <mesh position={[0, -0.11, 0.055]}>
        <boxGeometry args={[0.78, 0.05, 0.12]} />
        <meshStandardMaterial color="#cfcfc8" />
      </mesh>
    </group>
  );
}

function ACCondenser({ pos, rot = 0 }) {
  return (
    <group position={pos} rotation={[0, rot, 0]}>
      <mesh position={[0, 0.32, 0]} castShadow>
        <boxGeometry args={[0.82, 0.6, 0.34]} />
        <meshStandardMaterial color="#dcdcd7" metalness={0.2} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.32, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.02, 20]} />
        <meshStandardMaterial color="#3a3a3a" />
      </mesh>
    </group>
  );
}

function ExhaustFan({ pos, rot = 0 }) {
  return (
    <group position={pos} rotation={[0, rot, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.55, 0.55, 0.16]} />
        <meshStandardMaterial color="#c9c6bd" />
      </mesh>
      <mesh position={[0, 0, 0.09]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.04, 16]} />
        <meshStandardMaterial color="#2f2f2f" />
      </mesh>
    </group>
  );
}

// A flat covered-porch roof on four posts.
function PorchRoof({ cx, cz, w, d, h = WALL_H - 0.5, color = '#565b64', roofMap = null, postColor = '#8a7c6a' }) {
  const px = w / 2 - 0.2;
  const pz = d / 2 - 0.2;
  return (
    <group>
      <mesh position={[cx, h, cz]} castShadow>
        <boxGeometry args={[w, 0.16, d]} />
        <meshStandardMaterial color={color} map={roofMap} roughness={0.85} />
      </mesh>
      {[
        [cx - px, cz - pz],
        [cx + px, cz - pz],
        [cx - px, cz + pz],
        [cx + px, cz + pz],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, h / 2, z]} castShadow>
          <boxGeometry args={[0.2, h, 0.2]} />
          <meshStandardMaterial color={postColor} />
        </mesh>
      ))}
    </group>
  );
}

export default function House({ showRoof = true, showWalls = true, realistic = false, tex = null }) {
  const FLOOR = '#d8d2c7';
  const EXT = '#efe9df';
  const stucco = realistic && tex ? tex.stucco : null;
  const roofMap = realistic && tex ? tex.roof : null;
  const floorMap = realistic && tex ? tex.floor : null;

  // triangular gable-end profile (base spans the 10 m depth, ~1 m peak)
  const gableShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-5.2, 0);
    s.lineTo(5.2, 0);
    s.lineTo(0, 1.0);
    s.closePath();
    return s;
  }, []);

  return (
    <group>
      {/* ---------------- Elevated foundation plinth ---------------- */}
      {/* main house + carport pad */}
      <mesh position={[0, -0.26, -0.5]} receiveShadow castShadow>
        <boxGeometry args={[14.2, 0.5, 10.6]} />
        <meshStandardMaterial color="#a9a396" map={floorMap} bumpMap={floorMap} bumpScale={0.03} roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.0, -0.5]}>
        <boxGeometry args={[14.4, 0.08, 10.8]} />
        <meshStandardMaterial color="#8f897c" roughness={0.9} />
      </mesh>
      {/* front entry-porch raised pad (center only) */}
      <mesh position={[0, -0.26, 5.9]} receiveShadow castShadow>
        <boxGeometry args={[4.7, 0.5, 2.8]} />
        <meshStandardMaterial color="#a9a396" map={floorMap} roughness={0.95} />
      </mesh>

      {/* ---------------- Floor slabs ---------------- */}
      {/* main house floor: X[-6.75,6.75] Z[-5.5,4.5] */}
      <mesh position={[0, 0.02, -0.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[13.5, 10]} />
        <meshStandardMaterial color={FLOOR} map={floorMap} bumpMap={floorMap} bumpScale={0.04} roughness={0.9} />
      </mesh>
      {/* carport pad (left-front cell) — a harder-wearing finish */}
      <mesh position={[(xW + x1) / 2, 0.03, (z2 + zF) / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[x1 - xW, zF - z2]} />
        <meshStandardMaterial color="#b3ada0" map={floorMap} roughness={0.95} />
      </mesh>
      {/* front entry-porch slab */}
      <mesh position={[0, 0.03, 5.9]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[4.5, 2.8]} />
        <meshStandardMaterial color="#cfc8bc" map={floorMap} roughness={0.92} />
      </mesh>
      {/* side-porch slab (east of family room) */}
      <mesh position={[7.55, -0.14, -1.0]} receiveShadow castShadow>
        <boxGeometry args={[1.6, 0.36, 3.0]} />
        <meshStandardMaterial color="#c4bdb0" roughness={0.92} />
      </mesh>
      {/* back-porch slab (rear of kitchen) */}
      <mesh position={[0, -0.14, -6.35]} receiveShadow castShadow>
        <boxGeometry args={[3.0, 0.36, 1.7]} />
        <meshStandardMaterial color="#c4bdb0" roughness={0.92} />
      </mesh>

      {/* front-porch steps down to the path */}
      {[
        [-0.09, 7.35],
        [-0.22, 7.63],
        [-0.35, 7.91],
      ].map(([y, z], i) => (
        <mesh key={i} position={[0, y, z]} receiveShadow castShadow>
          <boxGeometry args={[2.4, 0.16, 0.34]} />
          <meshStandardMaterial color="#c2bbae" />
        </mesh>
      ))}
      {/* driveway apron / ramp in front of the open carport */}
      <mesh position={[(xW + x1) / 2, -0.24, zF + 1.5]} rotation={[0.3, 0, 0]} receiveShadow>
        <boxGeometry args={[x1 - xW - 0.2, 0.14, 3.2]} />
        <meshStandardMaterial color="#aca596" roughness={0.95} />
      </mesh>

      {/* ---------------- Walls ---------------- */}
      {showWalls && (
        <group>
          {/* ===== Exterior perimeter ===== */}
          {/* rear wall (Z=zR): kitchen back-door gap at x=0 */}
          <Wall a={[xW, zR]} b={[-1.0, zR]} color={EXT} map={stucco} />
          <Wall a={[1.0, zR]} b={[xE, zR]} color={EXT} map={stucco} />
          {/* east wall (X=xE): family-room side-porch door gap near z=-1 */}
          <Wall a={[xE, zR]} b={[xE, z1]} color={EXT} map={stucco} />
          <Wall a={[xE, z1]} b={[xE, 0.5]} color={EXT} door={1.1} map={stucco} />
          <Wall a={[xE, 0.5]} b={[xE, zF]} color={EXT} map={stucco} />
          {/* west wall (X=xW): solid the whole height (bath, master, carport-west) */}
          <Wall a={[xW, zR]} b={[xW, zF]} color={EXT} map={stucco} />
          {/* front wall (Z=zF): only center + right (living entrance + bed3).
             The left-front carport bay is left open (posts carry the roof). */}
          <Wall a={[x1, zF]} b={[-0.7, zF]} color={EXT} map={stucco} />
          <Wall a={[0.7, zF]} b={[xE, zF]} color={EXT} door={1.2} map={stucco} />

          {/* ===== Column dividers ===== */}
          {/* x1 (LEFT | CENTER) */}
          <Wall a={[x1, zR]} b={[x1, z1]} door={0.95} /> {/* laundry | kitchen */}
          <Wall a={[x1, z1]} b={[x1, z2]} door={0.95} /> {/* master | dining */}
          <Wall a={[x1, z2]} b={[x1, zF]} /> {/* carport | living (solid) */}
          {/* x2 (CENTER | RIGHT) */}
          <Wall a={[x2, zR]} b={[x2, z1]} /> {/* kitchen | bed2 (solid) */}
          <Wall a={[x2, z1]} b={[x2, z2]} door={1.6} /> {/* dining | family (wide opening) */}
          <Wall a={[x2, z2]} b={[x2, zF]} door={0.95} /> {/* living | bed3 */}

          {/* ===== Row dividers ===== */}
          {/* z1 (REAR | MID) */}
          <Wall a={[xW, z1]} b={[x1, z1]} door={0.9} /> {/* bath/laundry | master */}
          <Wall a={[x1, z1]} b={[x2, z1]} door={1.8} /> {/* kitchen | dining (wide) */}
          <Wall a={[x2, z1]} b={[xE, z1]} door={0.9} /> {/* bed2 | family */}
          {/* z2 (MID | FRONT) */}
          <Wall a={[xW, z2]} b={[x1, z2]} /> {/* master | carport (solid) */}
          <Wall a={[x1, z2]} b={[x2, z2]} door={2.2} /> {/* dining | living (wide opening) */}
          <Wall a={[x2, z2]} b={[xE, z2]} /> {/* family | bed3 (solid) */}

          {/* bath | laundry divider */}
          <Wall a={[bathDiv, zR]} b={[bathDiv, z1]} door={0.8} />

          {/* ===== Windows ===== */}
          {/* rear wall (Z=zR) */}
          <Window position={[-5.6, 1.5, zR - 0.09]} size={[1.4, 1.3]} rotation={[0, Math.PI, 0]} />
          <Window position={[-3.35, 1.5, zR - 0.09]} size={[1.4, 1.3]} rotation={[0, Math.PI, 0]} />
          <Window position={[4.5, 1.4, zR - 0.09]} size={[1.8, 1.3]} rotation={[0, Math.PI, 0]} />
          {/* west wall (X=xW) */}
          <Window position={[xW - 0.09, 1.5, -4.0]} size={[1.4, 1.4]} rotation={[0, -Math.PI / 2, 0]} />
          <Window position={[xW - 0.09, 1.5, -1.0]} size={[2.0, 1.5]} rotation={[0, -Math.PI / 2, 0]} />
          {/* east wall (X=xE) */}
          <Window position={[xE + 0.09, 1.4, -4.0]} size={[1.8, 1.3]} rotation={[0, Math.PI / 2, 0]} />
          <Window position={[xE + 0.09, 1.5, 2.5]} size={[2.0, 1.6]} rotation={[0, Math.PI / 2, 0]} />
          {/* front wall (Z=zF): living floor-to-ceiling glazing + bed3 garden window */}
          <Window position={[-1.4, 1.75, zF + 0.09]} size={[1.4, 3.1]} />
          <Window position={[1.5, 1.5, zF + 0.09]} size={[1.4, 1.6]} />
          <Window position={[4.5, 1.5, zF + 0.09]} size={[2.4, 1.6]} />
          {/* front-glazing mullions */}
          {[-2.05, -0.75].map((x) => (
            <mesh key={x} position={[x, 1.75, zF + 0.12]}>
              <boxGeometry args={[0.08, 3.2, 0.08]} />
              <meshStandardMaterial color="#3a3f47" />
            </mesh>
          ))}

          {/* ===== Visible doors (on X-running walls) ===== */}
          <Door x={0} z={zF} w={1.2} open={0.5} flip={1} /> {/* main entrance → living */}
          <Door x={0} z={zR} w={1.0} open={0.5} flip={-1} /> {/* kitchen → back porch */}
          <Door x={4.5} z={z1} w={0.9} open={0.6} flip={1} /> {/* family → bedroom 2 */}
          <Door x={-5.0} z={z1} w={0.8} open={0.55} flip={-1} /> {/* master → bathroom */}

          {/* ===== Fixtures ===== */}
          <ExhaustFan pos={[0.9, 2.6, zR + 0.1]} rot={0} /> {/* kitchen */}
          <ACHead pos={[-4.5, 3.0, zR + 0.12]} rot={0} /> {/* master area */}
          <ACHead pos={[4.5, 3.0, zR + 0.12]} rot={0} /> {/* bedroom 2 */}
          <ACHead pos={[4.5, 3.2, zF - 0.12]} rot={Math.PI} /> {/* bedroom 3 */}
          <ACHead pos={[-2.1, 3.2, 2.4]} rot={-Math.PI / 2} /> {/* living */}
        </group>
      )}

      {/* ---------------- Carport (open front-left bay) ---------------- */}
      <group>
        {/* two posts at the open front corners */}
        {[
          [xW + 0.25, zF - 0.25],
          [x1 - 0.25, zF - 0.25],
        ].map(([x, z], i) => (
          <mesh key={i} position={[x, WALL_H / 2, z]} castShadow>
            <boxGeometry args={[0.22, WALL_H, 0.22]} />
            <meshStandardMaterial color="#8a7c6a" />
          </mesh>
        ))}
        <Car x={(xW + x1) / 2 + 0.1} z={2.4} rot={0} />
      </group>

      {/* ---------------- Front entry porch ---------------- */}
      <group>
        <PorchRoof cx={0} cz={5.9} w={4.9} d={3.0} roofMap={roofMap} />
        {/* railing either side of the entry steps */}
        <Wall a={[-2.25, 7.2]} b={[-0.7, 7.2]} height={0.9} thickness={0.12} color="#e6ddcd" />
        <Wall a={[0.7, 7.2]} b={[2.25, 7.2]} height={0.9} thickness={0.12} color="#e6ddcd" />
      </group>

      {/* ---------------- Side porch (east of family room) ---------------- */}
      <PorchRoof cx={7.55} cz={-1.0} w={1.9} d={3.2} h={WALL_H - 0.7} roofMap={roofMap} />

      {/* ---------------- Back porch (rear of kitchen) ---------------- */}
      <PorchRoof cx={0} cz={-6.35} w={3.2} d={1.9} h={WALL_H - 0.7} roofMap={roofMap} />

      {/* ---------------- Garden (front-right, off bedroom 3) ---------------- */}
      <group>
        <mesh position={[4.5, 0.02, 5.7]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[4.5, 2.4]} />
          <meshStandardMaterial color="#6f9e52" roughness={1} map={realistic && tex ? tex.grass : null} />
        </mesh>
        {/* planting-bed shrubs */}
        {[
          [3.3, 5.2],
          [4.4, 6.2],
          [5.5, 5.3],
          [3.6, 6.4],
        ].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.35, z]} castShadow>
            <sphereGeometry args={[0.32, 12, 10]} />
            <meshStandardMaterial color="#4f7a44" roughness={1} />
          </mesh>
        ))}
        {/* low garden edging */}
        <Wall a={[2.25, 6.9]} b={[6.75, 6.9]} height={0.3} thickness={0.12} color="#cdbfa6" />
      </group>

      {/* ---------------- AC outdoor condensers ---------------- */}
      <group>
        <ACCondenser pos={[-4.5, 0, zR - 0.55]} rot={Math.PI} /> {/* master */}
        <ACCondenser pos={[4.5, 0, zR - 0.55]} rot={Math.PI} /> {/* bedroom 2 */}
        <ACCondenser pos={[xE + 0.5, 0, 2.5]} rot={Math.PI / 2} /> {/* bedroom 3 */}
      </group>

      {/* ---------------- Entrance wall sconces ---------------- */}
      {[-0.85, 0.85].map((x) => (
        <group key={x} position={[x, 2.25, zF + 0.09]}>
          <mesh castShadow>
            <boxGeometry args={[0.13, 0.38, 0.1]} />
            <meshStandardMaterial color="#2c2d30" metalness={0.5} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0, 0.07]}>
            <boxGeometry args={[0.08, 0.3, 0.03]} />
            <meshStandardMaterial color="#ffe0ad" emissive="#ffbf6b" emissiveIntensity={2.2} />
          </mesh>
          <pointLight position={[0, 0, 0.35]} intensity={0.45} distance={4.5} color="#ffcf8a" />
        </group>
      ))}

      {/* ---------------- Roof ---------------- */}
      {showRoof && (
        <group>
          {/* modern low-pitch gable, ridge running east–west at Z=-0.5 */}
          <mesh position={[0, WALL_H + 0.6, 2.0]} rotation={[0.1853, 0, 0]} castShadow>
            <boxGeometry args={[14.2, 0.2, 5.25]} />
            <meshStandardMaterial color="#3f434b" map={roofMap} bumpMap={roofMap} bumpScale={0.06} roughness={0.85} />
          </mesh>
          <mesh position={[0, WALL_H + 0.6, -3.0]} rotation={[-0.1853, 0, 0]} castShadow>
            <boxGeometry args={[14.2, 0.2, 5.25]} />
            <meshStandardMaterial color="#3f434b" map={roofMap} bumpMap={roofMap} bumpScale={0.06} roughness={0.85} />
          </mesh>
          {/* ridge cap */}
          <mesh position={[0, WALL_H + 1.05, -0.5]} castShadow>
            <boxGeometry args={[14.3, 0.16, 0.32]} />
            <meshStandardMaterial color="#2f333a" />
          </mesh>
          {/* gable-end infill triangles (east & west) */}
          <mesh position={[xE, WALL_H + 0.05, -0.5]} rotation={[0, -Math.PI / 2, 0]}>
            <shapeGeometry args={[gableShape]} />
            <meshStandardMaterial color={EXT} map={stucco} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[xW, WALL_H + 0.05, -0.5]} rotation={[0, Math.PI / 2, 0]}>
            <shapeGeometry args={[gableShape]} />
            <meshStandardMaterial color={EXT} map={stucco} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}
    </group>
  );
}
