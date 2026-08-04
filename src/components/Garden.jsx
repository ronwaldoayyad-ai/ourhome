// Perimeter fence + modern landscaping. All static/outdoor, always visible.
// Property bounds (meters): west X=-13.5, east X=8.5, rear Z=-8, front Z=9.

const WX = -13.5;
const EX = 8.5;
const NZ = -8; // rear
const SZ = 9; // front (street side)

// A modern horizontal-slat fence run between two points on the XZ plane.
function Fence({ a, b, height = 1.5 }) {
  const [ax, az] = a;
  const [bx, bz] = b;
  const dx = bx - ax;
  const dz = bz - az;
  const len = Math.hypot(dx, dz);
  const angle = Math.atan2(dz, dx);
  const mx = (ax + bx) / 2;
  const mz = (az + bz) / 2;
  const nPosts = Math.max(2, Math.round(len / 2.2) + 1);
  const posts = [];
  for (let i = 0; i < nPosts; i++) {
    const t = i / (nPosts - 1);
    posts.push([ax + dx * t, az + dz * t]);
  }
  const rails = [0.55, 0.9, 1.25, 1.5];
  return (
    <group>
      {/* concrete base plinth (retained) */}
      <mesh position={[mx, 0.19, mz]} rotation={[0, -angle, 0]} castShadow receiveShadow>
        <boxGeometry args={[len, 0.38, 0.2]} />
        <meshStandardMaterial color="#b6b0a3" roughness={0.95} />
      </mesh>
      {posts.map(([px, pz], i) => (
        <group key={i}>
          {/* white PVC post */}
          <mesh position={[px, height / 2, pz]} castShadow>
            <boxGeometry args={[0.14, height, 0.14]} />
            <meshStandardMaterial color="#eeece6" roughness={0.5} metalness={0.04} />
          </mesh>
          {/* post-cap fence light (glows at night) */}
          <mesh position={[px, height + 0.06, pz]}>
            <boxGeometry args={[0.17, 0.12, 0.17]} />
            <meshStandardMaterial color="#d8d5cd" emissive="#ffd489" emissiveIntensity={1.4} />
          </mesh>
        </group>
      ))}
      {/* white PVC horizontal rails */}
      {rails.map((h, i) => (
        <mesh key={`r${i}`} position={[mx, h, mz]} rotation={[0, -angle, 0]} castShadow>
          <boxGeometry args={[len, 0.12, 0.05]} />
          <meshStandardMaterial color="#f2f0ea" roughness={0.45} metalness={0.04} />
        </mesh>
      ))}
    </group>
  );
}

function GatePost({ x, z }) {
  return (
    <mesh position={[x, 0.95, z]} castShadow>
      <boxGeometry args={[0.24, 1.9, 0.24]} />
      <meshStandardMaterial color="#2b2723" />
    </mesh>
  );
}

// Slatted gate panel (for the pedestrian gate), slightly ajar.
function GatePanel({ x, z, w = 1.1, open = 0.4 }) {
  return (
    <group position={[x - w / 2, 0, z]} rotation={[0, open, 0]}>
      {[0.35, 0.75, 1.15, 1.45].map((h, i) => (
        <mesh key={i} position={[w / 2, h, 0]} castShadow>
          <boxGeometry args={[w, 0.1, 0.04]} />
          <meshStandardMaterial color="#8a745a" />
        </mesh>
      ))}
      <mesh position={[w, 0.8, 0]} castShadow>
        <boxGeometry args={[0.08, 1.6, 0.08]} />
        <meshStandardMaterial color="#2b2723" />
      </mesh>
    </group>
  );
}

// A double-swing horizontal-slat carport gate, shown open.
function CarportGate({ x1, x2, z }) {
  const leafW = (x2 - x1) / 2;
  const slats = [0.35, 0.68, 1.01, 1.34];
  const Leaf = ({ hinge, dir }) => (
    <group position={[hinge, 0, z]} rotation={[0, dir * 1.15, 0]}>
      {slats.map((h, i) => (
        <mesh key={i} position={[(dir * leafW) / 2, h, 0]} castShadow>
          <boxGeometry args={[leafW, 0.14, 0.05]} />
          <meshStandardMaterial color="#3a3d42" metalness={0.5} roughness={0.5} />
        </mesh>
      ))}
      <mesh position={[dir * leafW, 0.85, 0]} castShadow>
        <boxGeometry args={[0.08, 1.65, 0.08]} />
        <meshStandardMaterial color="#2b2d31" />
      </mesh>
    </group>
  );
  return (
    <group>
      <Leaf hinge={x1} dir={1} />
      <Leaf hinge={x2} dir={-1} />
    </group>
  );
}

// A big elevated water tank on a steel tower — the property's main water source.
function WaterTank({ x, z }) {
  const legs = [
    [-0.6, -0.6],
    [0.6, -0.6],
    [-0.6, 0.6],
    [0.6, 0.6],
  ];
  return (
    <group position={[x, 0, z]}>
      {/* tower legs */}
      {legs.map(([lx, lz], i) => (
        <mesh key={i} position={[lx, 1.3, lz]} castShadow>
          <boxGeometry args={[0.13, 2.6, 0.13]} />
          <meshStandardMaterial color="#5f584e" metalness={0.3} roughness={0.6} />
        </mesh>
      ))}
      {/* cross braces */}
      {[-0.6, 0.6].map((lz) => (
        <mesh key={lz} position={[0, 0.9, lz]}>
          <boxGeometry args={[1.35, 0.08, 0.06]} />
          <meshStandardMaterial color="#5f584e" />
        </mesh>
      ))}
      {/* platform */}
      <mesh position={[0, 2.65, 0]} castShadow>
        <boxGeometry args={[1.6, 0.1, 1.6]} />
        <meshStandardMaterial color="#7a7268" />
      </mesh>
      {/* tank body */}
      <mesh position={[0, 3.75, 0]} castShadow>
        <cylinderGeometry args={[0.78, 0.78, 2.1, 22]} />
        <meshStandardMaterial color="#3a6ea5" roughness={0.5} metalness={0.1} />
      </mesh>
      {/* domed top */}
      <mesh position={[0, 4.8, 0]} castShadow>
        <sphereGeometry args={[0.78, 22, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#325f8d" roughness={0.5} />
      </mesh>
      {/* down pipe */}
      <mesh position={[0.72, 1.9, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 3.8, 10]} />
        <meshStandardMaterial color="#cfcfca" />
      </mesh>
    </group>
  );
}

function Tree({ x, z, s = 1 }) {
  return (
    <group position={[x, 0, z]} scale={s}>
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.17, 1.6, 8]} />
        <meshStandardMaterial color="#6b5540" roughness={0.9} />
      </mesh>
      <mesh position={[0, 2.05, 0]} castShadow>
        <sphereGeometry args={[0.95, 14, 14]} />
        <meshStandardMaterial color="#4f7a44" roughness={1} />
      </mesh>
      <mesh position={[0.35, 2.5, 0.1]} castShadow>
        <sphereGeometry args={[0.6, 12, 12]} />
        <meshStandardMaterial color="#5c8a4e" roughness={1} />
      </mesh>
    </group>
  );
}

// A trimmed rectangular hedge.
function Hedge({ x, z, w, d, h = 0.7, color = '#4d7a3f' }) {
  return (
    <mesh position={[x, h / 2, z]} castShadow receiveShadow>
      <boxGeometry args={[w, h, d]} />
      <meshStandardMaterial color={color} roughness={1} />
    </mesh>
  );
}

// A clump of ornamental grass (a few thin blades/cones).
function Grass({ x, z, color = '#8aa35a' }) {
  const blades = [
    [0, 0, 0.55],
    [0.15, 0.1, 0.45],
    [-0.15, -0.08, 0.5],
    [0.05, -0.15, 0.4],
  ];
  return (
    <group position={[x, 0, z]}>
      {blades.map(([bx, bz, bh], i) => (
        <mesh key={i} position={[bx, bh / 2, bz]} castShadow>
          <coneGeometry args={[0.09, bh, 6]} />
          <meshStandardMaterial color={color} roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

// A raised rectangular planter box with grasses inside.
function Planter({ x, z, w = 2.2, d = 0.7 }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, 0.4, d]} />
        <meshStandardMaterial color="#c8c2b6" roughness={0.9} />
      </mesh>
      {Array.from({ length: Math.max(2, Math.round(w / 0.7)) }).map((_, i, arr) => {
        const gx = -w / 2 + 0.4 + (i * (w - 0.8)) / Math.max(1, arr.length - 1);
        return <Grass key={i} x={gx} z={0} />;
      })}
    </group>
  );
}

export default function Garden() {
  return (
    <group>
      {/* ---------- Perimeter fence ---------- */}
      <Fence a={[WX, NZ]} b={[EX, NZ]} /> {/* rear */}
      <Fence a={[EX, NZ]} b={[EX, SZ]} /> {/* east */}
      <Fence a={[WX, NZ]} b={[WX, SZ]} /> {/* west */}
      {/* front run, with a wide carport/driveway gate (X[-12.2,-8.2]) and a pedestrian gate (X[2.9,4.1]) */}
      <Fence a={[WX, SZ]} b={[-12.2, SZ]} />
      <Fence a={[-8.2, SZ]} b={[2.9, SZ]} />
      <Fence a={[4.1, SZ]} b={[EX, SZ]} />
      {/* gate posts */}
      <GatePost x={-12.2} z={SZ} />
      <GatePost x={-8.2} z={SZ} />
      <GatePost x={2.9} z={SZ} />
      <GatePost x={4.1} z={SZ} />
      {/* pedestrian gate panel, ajar */}
      <GatePanel x={4.1} z={SZ} w={1.1} open={0.5} />
      {/* carport double-swing gate, open */}
      <CarportGate x1={-12.2} x2={-8.2} z={SZ} />

      {/* ---------- Driveway path out to the gate ---------- */}
      <mesh position={[-9, 0.012, 7.6]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3, 3]} />
        <meshStandardMaterial color="#a7a196" roughness={0.95} />
      </mesh>

      {/* ---------- Front stepping-stone path (ped gate → veranda steps) ---------- */}
      {[8.4, 7.9, 7.4].map((z) => (
        <mesh key={z} position={[3.5, 0.03, z]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[1.1, 0.36]} />
          <meshStandardMaterial color="#c7c1b4" roughness={0.95} />
        </mesh>
      ))}

      {/* ---------- Trees (architectural placement) ---------- */}
      <Tree x={6.8} z={7.4} s={1.1} />
      <Tree x={-12.6} z={7.2} s={1.0} />
      <Tree x={7.2} z={-6.8} s={1.15} />
      <Tree x={-12.4} z={-6.8} s={1.05} />
      <Tree x={8} z={-1} s={0.9} />

      {/* ---------- Main water tank, next to the laundry (rear-west) ---------- */}
      <WaterTank x={-12.9} z={-3.5} />

      {/* ---------- Clipped hedges flanking the front path ---------- */}
      <Hedge x={2.5} z={8} w={0.6} d={1.8} />
      <Hedge x={4.6} z={8} w={0.6} d={1.8} />

      {/* ---------- Low hedge band along the front yard (either side of the path) ---------- */}
      <Hedge x={-1.5} z={7.1} w={5.5} d={0.6} h={0.55} color="#4f8040" />
      <Hedge x={6} z={7.1} w={3.6} d={0.6} h={0.55} color="#4f8040" />

      {/* ---------- Modern planters + ornamental grasses ---------- */}
      <Planter x={-5.5} z={8.3} w={3.2} d={0.7} />
      <Planter x={7.4} z={3} w={0.7} d={3.4} />
      <Grass x={-11.5} z={8} />
      <Grass x={-10.8} z={8.2} />
      <Grass x={6.2} z={-6} />
      <Grass x={-2.5} z={-7.3} color="#7f9a52" />
      <Grass x={0} z={-7.3} color="#7f9a52" />
      <Grass x={2.5} z={-7.3} />
    </group>
  );
}
