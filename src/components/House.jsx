import { useMemo } from 'react';
import * as THREE from 'three';
import { WALL_H } from '../data';

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
          // offset each segment toward its end from the midpoint
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

// Dark aluminium window frame bar.
function FrameBar({ position, args }) {
  return (
    <mesh position={position} castShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial color="#2c2d30" metalness={0.65} roughness={0.35} />
    </mesh>
  );
}

// A framed tinted-glass window sitting flush on an exterior wall. Adds an
// aluminium frame + mullions so it reads as real glazing.
function Window({ position, size = [1.6, 1.3], rotation = [0, 0, 0] }) {
  const [w, h] = size;
  const t = 0.07;
  return (
    <group position={position} rotation={rotation}>
      {/* glass */}
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
      {/* outer frame */}
      <FrameBar position={[0, h / 2, 0.02]} args={[w + t, t, 0.1]} />
      <FrameBar position={[0, -h / 2, 0.02]} args={[w + t, t, 0.1]} />
      <FrameBar position={[-w / 2, 0, 0.02]} args={[t, h + t, 0.1]} />
      <FrameBar position={[w / 2, 0, 0.02]} args={[t, h + t, 0.1]} />
      {/* mullions on large panes */}
      {w > 2 && <FrameBar position={[0, 0, 0.02]} args={[t * 0.7, h, 0.07]} />}
      {h > 2 && <FrameBar position={[0, 0, 0.02]} args={[w, t * 0.7, 0.07]} />}
    </group>
  );
}

// A visible wooden door leaf standing in a doorway on an X-running wall.
// Hinged at one side and left ajar so it clearly reads as a door.
function Door({ x, z, w = 0.9, open = 0.5, flip = 1 }) {
  const leafW = w - 0.06;
  return (
    <group position={[x - flip * (w / 2), 0, z]} rotation={[0, flip * open, 0]}>
      {/* door leaf */}
      <mesh position={[flip * (leafW / 2), 1.05, 0]} castShadow>
        <boxGeometry args={[leafW, 2.1, 0.05]} />
        <meshStandardMaterial color="#6f5334" roughness={0.85} />
      </mesh>
      {/* handle */}
      <mesh position={[flip * (leafW - 0.12), 1.0, 0.06]}>
        <sphereGeometry args={[0.045, 10, 10]} />
        <meshStandardMaterial color="#caa94a" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}

// A parked sedan (three-box: hood, cabin, trunk) for the carport.
function Car({ x, z, rot = 0 }) {
  const paint = '#8f9aa6'; // metallic silver-grey
  const glass = '#cfe0ea';
  return (
    <group position={[x, 0, z]} rotation={[0, rot, 0]}>
      {/* lower body */}
      <mesh position={[0, 0.52, 0]} castShadow>
        <boxGeometry args={[1.82, 0.44, 4.4]} />
        <meshStandardMaterial color={paint} metalness={0.6} roughness={0.35} />
      </mesh>
      {/* rocker / sill */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[1.86, 0.2, 4.3]} />
        <meshStandardMaterial color="#2b2e33" roughness={0.7} />
      </mesh>
      {/* cabin greenhouse (middle) */}
      <mesh position={[0, 0.94, -0.25]} castShadow>
        <boxGeometry args={[1.64, 0.48, 1.9]} />
        <meshStandardMaterial color={paint} metalness={0.6} roughness={0.35} />
      </mesh>
      {/* roof panel */}
      <mesh position={[0, 1.18, -0.3]} castShadow>
        <boxGeometry args={[1.5, 0.06, 1.7]} />
        <meshStandardMaterial color={paint} metalness={0.6} roughness={0.35} />
      </mesh>
      {/* sloped windshield + rear window */}
      <mesh position={[0, 0.99, 0.72]} rotation={[0.62, 0, 0]}>
        <boxGeometry args={[1.5, 0.55, 0.04]} />
        <meshStandardMaterial color={glass} metalness={0.4} roughness={0.1} transparent opacity={0.7} />
      </mesh>
      <mesh position={[0, 0.99, -1.22]} rotation={[-0.6, 0, 0]}>
        <boxGeometry args={[1.5, 0.5, 0.04]} />
        <meshStandardMaterial color={glass} metalness={0.4} roughness={0.1} transparent opacity={0.7} />
      </mesh>
      {/* side windows */}
      {[-0.83, 0.83].map((sx) => (
        <mesh key={sx} position={[sx, 0.98, -0.3]}>
          <boxGeometry args={[0.03, 0.4, 1.55]} />
          <meshStandardMaterial color={glass} metalness={0.4} roughness={0.1} transparent opacity={0.6} />
        </mesh>
      ))}
      {/* headlights + grille (front, +Z) */}
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
      {/* taillights (rear, -Z) */}
      {[-0.6, 0.6].map((hx) => (
        <mesh key={`t${hx}`} position={[hx, 0.54, -2.19]}>
          <boxGeometry args={[0.34, 0.15, 0.04]} />
          <meshStandardMaterial color="#a01c1c" emissive="#c62222" emissiveIntensity={0.35} />
        </mesh>
      ))}
      {/* wheels with alloy hubcaps */}
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

// Wall-mounted split-AC indoor head unit.
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

// Outdoor split-AC condenser (compressor) unit, sits on the ground.
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

// Kitchen exhaust fan (square housing + circular fan) mounted high on a wall.
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

export default function House({ showRoof = true, showWalls = true, realistic = false, tex = null }) {
  const FLOOR = '#d8d2c7';
  const EXT = '#efe9df';
  const stucco = realistic && tex ? tex.stucco : null;
  const roofMap = realistic && tex ? tex.roof : null;
  const floorMap = realistic && tex ? tex.floor : null;

  // triangular gable-end profile (base ±4.8 along the ridge, 0.95 m peak)
  const gableShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-4.8, 0);
    s.lineTo(4.8, 0);
    s.lineTo(0, 0.95);
    s.closePath();
    return s;
  }, []);

  return (
    <group>
      {/* ---------------- Elevated foundation plinth (raises the whole house ~0.5 m) ---------------- */}
      <mesh position={[-2.75, -0.26, 0.65]} receiveShadow castShadow>
        <boxGeometry args={[19.1, 0.5, 12.3]} />
        <meshStandardMaterial color="#a9a396" map={floorMap} bumpMap={floorMap} bumpScale={0.03} roughness={0.95} />
      </mesh>
      <mesh position={[-2.75, 0.0, 0.65]}>
        <boxGeometry args={[19.3, 0.08, 12.5]} />
        <meshStandardMaterial color="#8f897c" roughness={0.9} />
      </mesh>

      {/* ---------------- Floor slabs ---------------- */}
      {/* main house floor: X[-6.5,6.5] Z[-5,4] */}
      <mesh position={[0, 0.02, -0.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[13, 9]} />
        <meshStandardMaterial color={FLOOR} map={floorMap} bumpMap={floorMap} bumpScale={0.04} roughness={0.9} />
      </mesh>
      {/* front veranda slab — right half only, aligned with the living room: X[-1,6.5] Z[4,6.6] */}
      <mesh position={[2.75, 0.02, 5.3]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[7.5, 2.6]} />
        <meshStandardMaterial color="#cfc8bc" map={floorMap} roughness={0.92} />
      </mesh>
      {/* front-left integrated kitchen floor (extended from the dining): X[-6.5,-1] Z[4,6.6] */}
      <mesh position={[-3.75, 0.02, 5.3]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[5.5, 2.6]} />
        <meshStandardMaterial color={FLOOR} map={floorMap} roughness={0.9} />
      </mesh>
      {/* veranda entrance steps down to the yard (spanning the ~0.5 m foundation rise) */}
      {[
        [-0.09, 6.7],
        [-0.22, 6.98],
        [-0.35, 7.26],
        [-0.48, 7.54],
      ].map(([y, z], i) => (
        <mesh key={i} position={[3.5, y, z]} receiveShadow castShadow>
          <boxGeometry args={[2.0, 0.16, 0.34]} />
          <meshStandardMaterial color="#c2bbae" />
        </mesh>
      ))}
      {/* driveway ramp up onto the raised carport pad */}
      <mesh position={[-9.25, -0.25, 6.05]} rotation={[0.32, 0, 0]} receiveShadow>
        <boxGeometry args={[5.0, 0.14, 3.0]} />
        <meshStandardMaterial color="#aca596" roughness={0.95} />
      </mesh>
      {/* outdoor lanai slab — west side, beside the master bedroom & carport: X[-11.5,-6.5] Z[-5,-1.6] */}
      <mesh position={[-9, 0.015, -3.3]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[5, 3.4]} />
        <meshStandardMaterial color="#c4bdb0" />
      </mesh>
      {/* carport driveway slab (full bay): X[-12,-6.5] Z[-1.6,4.4] */}
      <mesh position={[-9.25, 0.015, 1.4]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[5.5, 6]} />
        <meshStandardMaterial color="#b3ada0" roughness={0.95} />
      </mesh>

      {/* ---------------- Walls ---------------- */}
      {showWalls && (
        <group>
          {/* --- Exterior perimeter --- */}
          {/* front wall (Z=4): living front only — the dining now opens forward into the kitchen extension */}
          <Wall a={[-1, 4]} b={[0.5, 4]} color={EXT} map={stucco} />
          <Wall a={[0.5, 4]} b={[6.5, 4]} color={EXT} door={1.1} map={stucco} />
          {/* integrated Dining+Kitchen extension to the front (X[-6.5,-1] Z[4,6.6]), walled off from the veranda */}
          <Wall a={[-6.5, 4]} b={[-6.5, 6.6]} height={3.3} color={EXT} map={stucco} />
          <Wall a={[-6.5, 6.6]} b={[-1, 6.6]} height={3.3} color={EXT} map={stucco} />
          <Wall a={[-1, 4]} b={[-1, 6.6]} height={3.3} color={EXT} map={stucco} />
          <Window position={[-3.75, 1.6, 6.69]} size={[2.6, 1.7]} />
          {/* back wall (Z=-5) */}
          <Wall a={[-6.5, -5]} b={[6.5, -5]} color={EXT} map={stucco} />
          {/* right wall (X=6.5) */}
          <Wall a={[6.5, -5]} b={[6.5, 4]} color={EXT} map={stucco} />
          {/* left wall (X=-6.5): solid beside the master (bathroom access closed) + side door to the carport */}
          <Wall a={[-6.5, -5]} b={[-6.5, -1]} color={EXT} map={stucco} />
          <Wall a={[-6.5, -1]} b={[-6.5, 4]} color={EXT} door={1.0} map={stucco} />

          {/* --- Interior partitions --- */}
          {/* bedroom front wall (Z=-1): 3 evenly-spaced bedrooms across the full back,
             each with a doorway. Bathroom & indoor kitchen removed to widen the living area. */}
          <Wall a={[-6.5, -1]} b={[-2.17, -1]} door={0.9} />
          <Wall a={[-2.17, -1]} b={[2.17, -1]} door={0.9} />
          <Wall a={[2.17, -1]} b={[6.5, -1]} door={0.9} />
          {/* bedroom dividers */}
          <Wall a={[-2.17, -5]} b={[-2.17, -1]} />
          <Wall a={[2.17, -5]} b={[2.17, -1]} />

          {/* the entire front + center is now one wide open-plan living–dining volume */}

          {/* --- Windows on exterior walls --- */}
          {/* LIVING floor-to-ceiling front glazing (Z=4), either side of the entrance */}
          <Window position={[1.4, 1.92, 4.09]} size={[2.6, 3.6]} />
          <Window position={[5.4, 1.92, 4.09]} size={[1.9, 3.6]} />
          {/* mullions between the tall glass panels */}
          {[0.05, 2.75, 4.4, 6.4].map((x) => (
            <mesh key={x} position={[x, 1.9, 4.12]}>
              <boxGeometry args={[0.08, 3.7, 0.08]} />
              <meshStandardMaterial color="#3a3f47" />
            </mesh>
          ))}
          {/* DINING front window (front-left) */}
          <Window position={[-4, 1.5, 4.09]} size={[2.6, 1.5]} />
          {/* bedroom rear windows (Z=-5) — one per bedroom */}
          {[-4.33, 0, 4.33].map((x) => (
            <Window key={x} position={[x, 1.4, -5.09]} size={[1.6, 1.2]} rotation={[0, Math.PI, 0]} />
          ))}
          {/* right side: living floor-to-ceiling window only (Bedroom 3's east window removed) */}
          <Window position={[6.59, 1.55, 2.5]} size={[2.6, 3.0]} rotation={[0, Math.PI / 2, 0]} />

          {/* --- Doors --- */}
          {/* one visible door per bedroom, on the Z=-1 wall, swung open into the room */}
          <Door x={-4.33} z={-1} open={0.6} flip={1} />
          <Door x={0} z={-1} open={0.6} flip={-1} />
          <Door x={4.33} z={-1} open={0.6} flip={1} />
          {/* front entrance door */}
          <Door x={3.5} z={4} w={1.1} open={0.5} flip={1} />

          {/* ---- Bathroom + Laundry (rear-west; the former outdoor-kitchen enclosure) ---- */}
          {/* rear wall, west wall, north wall (with door to the carport side) */}
          <Wall a={[-11.5, -5]} b={[-6.5, -5]} height={2.7} color={EXT} map={stucco} />
          <Wall a={[-11.5, -5]} b={[-11.5, -1.6]} height={2.7} color={EXT} map={stucco} />
          <Wall a={[-11.5, -1.6]} b={[-8, -1.6]} height={2.7} color={EXT} map={stucco} />
          {/* laundry (west) / bathroom (east) divider with a door */}
          <Wall a={[-9, -5]} b={[-9, -1.6]} height={2.7} door={0.85} />
          {/* windows: big picture window on the left/west wall + rear + north vents */}
          <Window position={[-10.2, 1.5, -4.91]} size={[2.0, 1.6]} />
          <Window position={[-11.41, 1.35, -3.3]} size={[3.2, 2.3]} rotation={[0, Math.PI / 2, 0]} />
          <Window position={[-7.5, 1.5, -1.69]} size={[2.0, 1.5]} rotation={[0, Math.PI, 0]} />
          {/* bathroom exhaust fan */}
          <ExhaustFan pos={[-7.4, 2.3, -4.86]} rot={0} />
          {/* access door from the carport side (north) */}
          <Door x={-7.25} z={-1.6} w={1.4} open={0.5} flip={-1} />

          {/* ---- Split-type AC indoor head units (3 bedrooms + living room) ---- */}
          <ACHead pos={[-4.33, 3.0, -4.82]} rot={0} /> {/* master */}
          <ACHead pos={[0, 3.0, -4.82]} rot={0} /> {/* bedroom 2 */}
          <ACHead pos={[4.33, 3.0, -4.82]} rot={0} /> {/* bedroom 3 */}
          <ACHead pos={[6.33, 3.4, 2]} rot={-Math.PI / 2} /> {/* living room — east wall, above its condenser */}
        </group>
      )}

      {/* (west-lanai support posts removed — the enclosure walls now carry the roof) */}

      {/* ---------------- Left-side driveway / open carport ---------------- */}
      <group>
        {/* four carport posts (full bay: X[-12,-6.5]) */}
        {[
          [-11.9, -1.3],
          [-6.7, -1.3],
          [-11.9, 4.2],
          [-6.7, 4.2],
        ].map(([x, z], i) => (
          <mesh key={i} position={[x, 1.4, z]} castShadow>
            <boxGeometry args={[0.22, 2.8, 0.22]} />
            <meshStandardMaterial color="#8a7c6a" />
          </mesh>
        ))}
        {/* parked car */}
        <Car x={-9.3} z={0.4} rot={0} />
      </group>

      {/* ---------------- Front veranda + outdoor-kitchen posts / railing ---------------- */}
      <group>
        {/* veranda support posts (right half only; the front-left kitchen is now walled) */}
        {[0, 3, 6].map((x) => (
          <mesh key={x} position={[x, 1.67, 6.4]} castShadow>
            <boxGeometry args={[0.2, 3.35, 0.2]} />
            <meshStandardMaterial color="#8a7c6a" />
          </mesh>
        ))}
        {/* veranda railing (right half only), with a gap at the entrance steps (x=3.5) */}
        <Wall a={[-1, 6.5]} b={[2.6, 6.5]} height={0.9} thickness={0.12} color="#e6ddcd" />
        <Wall a={[4.4, 6.5]} b={[6.5, 6.5]} height={0.9} thickness={0.12} color="#e6ddcd" />
      </group>

      {/* ---------------- Split-AC outdoor condenser units ---------------- */}
      <group>
        <ACCondenser pos={[-4.33, 0, -5.5]} rot={Math.PI} /> {/* master */}
        <ACCondenser pos={[0, 0, -5.5]} rot={Math.PI} /> {/* bedroom 2 */}
        <ACCondenser pos={[4.33, 0, -5.5]} rot={Math.PI} /> {/* bedroom 3 */}
        <ACCondenser pos={[6.9, 0, 2]} rot={Math.PI / 2} /> {/* living */}
      </group>

      {/* ---------------- Entrance wall sconces (warm) ---------------- */}
      {[2.55, 4.45].map((x) => (
        <group key={x} position={[x, 2.25, 4.09]}>
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

      {/* ---------------- Roofs ---------------- */}
      {showRoof && (
        <group>
          {/* modern low-pitch gable roof (ridge runs east–west at Z=-0.5) */}
          <mesh position={[0, WALL_H + 0.55, 1.9]} rotation={[0.1853, 0, 0]} castShadow>
            <boxGeometry args={[13.8, 0.2, 4.88]} />
            <meshStandardMaterial color="#3f434b" map={roofMap} bumpMap={roofMap} bumpScale={0.06} roughness={0.85} />
          </mesh>
          <mesh position={[0, WALL_H + 0.55, -2.9]} rotation={[-0.1853, 0, 0]} castShadow>
            <boxGeometry args={[13.8, 0.2, 4.88]} />
            <meshStandardMaterial color="#3f434b" map={roofMap} bumpMap={roofMap} bumpScale={0.06} roughness={0.85} />
          </mesh>
          {/* ridge cap */}
          <mesh position={[0, WALL_H + 1.02, -0.5]} castShadow>
            <boxGeometry args={[13.9, 0.16, 0.32]} />
            <meshStandardMaterial color="#2f333a" />
          </mesh>
          {/* gable-end infill triangles (east & west) */}
          <mesh position={[6.5, WALL_H + 0.05, -0.5]} rotation={[0, -Math.PI / 2, 0]}>
            <shapeGeometry args={[gableShape]} />
            <meshStandardMaterial color={EXT} map={stucco} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[-6.5, WALL_H + 0.05, -0.5]} rotation={[0, Math.PI / 2, 0]}>
            <shapeGeometry args={[gableShape]} />
            <meshStandardMaterial color={EXT} map={stucco} side={THREE.DoubleSide} />
          </mesh>
          {/* full-width front veranda roof */}
          <mesh position={[0, WALL_H - 0.45, 5.35]} castShadow>
            <boxGeometry args={[13.6, 0.16, 2.9]} />
            <meshStandardMaterial color="#565b64" map={roofMap} roughness={0.85} />
          </mesh>
          {/* carport roof (widened back to full bay; the front-west wing is gone) */}
          <mesh position={[-9.25, 2.85, 1.45]} castShadow>
            <boxGeometry args={[5.5, 0.16, 6.0]} />
            <meshStandardMaterial color="#565b64" map={roofMap} roughness={0.85} />
          </mesh>
          {/* rear-west Bathroom + Laundry wing roof */}
          <mesh position={[-9, 2.85, -3.3]} castShadow>
            <boxGeometry args={[5.4, 0.16, 3.8]} />
            <meshStandardMaterial color="#565b64" map={roofMap} roughness={0.85} />
          </mesh>
        </group>
      )}
    </group>
  );
}
