// Low-poly stylized furniture grouped by room. Everything is built from simple
// boxes / cylinders so it stays light and reliable. Coordinates follow the
// 3x3 room grid in data.js.
import { GRID } from '../data';

const { xW, xE, zR, zF } = GRID;

function Box({ pos, size, color, rot }) {
  return (
    <mesh position={pos} rotation={rot} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
function Cyl({ pos, args, color, rot }) {
  return (
    <mesh position={pos} rotation={rot} castShadow>
      <cylinderGeometry args={args} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function Bed({ x, z, rot = 0 }) {
  return (
    <group position={[x, 0, z]} rotation={[0, rot, 0]}>
      <Box pos={[0, 0.25, 0]} size={[1.6, 0.4, 2.0]} color="#8d6e57" />
      <Box pos={[0, 0.55, -0.05]} size={[1.5, 0.25, 1.9]} color="#f2ede4" />
      <Box pos={[-0.4, 0.72, -0.7]} size={[0.6, 0.18, 0.4]} color="#dfe6ea" />
      <Box pos={[0.4, 0.72, -0.7]} size={[0.6, 0.18, 0.4]} color="#dfe6ea" />
      <Box pos={[0, 0.9, -1.02]} size={[1.7, 1.0, 0.1]} color="#9c8067" />
    </group>
  );
}

function Wardrobe({ x, z, rot = 0 }) {
  return <Box pos={[x, 1.0, z]} size={[1.2, 2.0, 0.55]} color="#6f5b45" rot={[0, rot, 0]} />;
}

function Sofa({ x, z, rot = 0 }) {
  return (
    <group position={[x, 0, z]} rotation={[0, rot, 0]}>
      <Box pos={[0, 0.25, 0]} size={[2.4, 0.4, 0.9]} color="#5f7a8a" />
      <Box pos={[0, 0.6, -0.35]} size={[2.4, 0.5, 0.25]} color="#6f8a9a" />
      <Box pos={[-1.1, 0.5, 0]} size={[0.25, 0.4, 0.9]} color="#6f8a9a" />
      <Box pos={[1.1, 0.5, 0]} size={[0.25, 0.4, 0.9]} color="#6f8a9a" />
    </group>
  );
}

function CoffeeTable({ x, z }) {
  return <Box pos={[x, 0.25, z]} size={[1.2, 0.15, 0.6]} color="#7a614a" />;
}

function TV({ x, z, rot = 0 }) {
  return (
    <group position={[x, 0, z]} rotation={[0, rot, 0]}>
      <Box pos={[0, 0.32, 0]} size={[2.6, 0.4, 0.4]} color="#3b3d42" /> {/* console */}
      <Box pos={[0, 1.4, -0.16]} size={[1.52, 0.9, 0.05]} color="#1b1c1f" />
      <mesh position={[0, 1.4, -0.13]} castShadow>
        <boxGeometry args={[1.46, 0.83, 0.04]} />
        <meshStandardMaterial color="#0d0f13" metalness={0.3} roughness={0.3} emissive="#0b1a2c" emissiveIntensity={0.35} />
      </mesh>
    </group>
  );
}

function DiningSet({ x, z }) {
  return (
    <group position={[x, 0, z]}>
      <Box pos={[0, 0.75, 0]} size={[1.8, 0.1, 0.9]} color="#8a6f52" />
      <Cyl pos={[-0.7, 0.375, 0]} args={[0.06, 0.06, 0.75, 8]} color="#6f5b45" />
      <Cyl pos={[0.7, 0.375, 0]} args={[0.06, 0.06, 0.75, 8]} color="#6f5b45" />
      {[-0.6, 0.6].map((cx) =>
        [-0.65, 0.65].map((cz) => (
          <group key={`${cx}-${cz}`} position={[cx, 0, cz]}>
            <Box pos={[0, 0.45, 0]} size={[0.42, 0.08, 0.42]} color="#b7c9a2" />
            <Box pos={[0, 0.7, -0.18]} size={[0.42, 0.5, 0.08]} color="#a7b992" />
          </group>
        ))
      )}
    </group>
  );
}

// L-counter kitchen. Counter runs along local +Z and +X; rotate the group to
// aim it at the room's walls.
function KitchenSet({ x, z, rot = 0 }) {
  return (
    <group position={[x, 0, z]} rotation={[0, rot, 0]}>
      <Box pos={[0, 0.45, 1.1]} size={[3.2, 0.9, 0.6]} color="#d7d2c8" />
      <Box pos={[1.3, 0.45, 0]} size={[0.6, 0.9, 2.0]} color="#d7d2c8" />
      <Box pos={[0, 0.92, 1.1]} size={[3.3, 0.06, 0.65]} color="#3b3f47" />
      <Box pos={[1.3, 0.92, 0]} size={[0.65, 0.06, 2.05]} color="#3b3f47" />
      <Box pos={[0, 1.9, 1.35]} size={[3.0, 0.6, 0.35]} color="#c9c3b8" />
      <Box pos={[-0.8, 0.96, 1.1]} size={[0.6, 0.05, 0.5]} color="#222" />
      <Box pos={[0.7, 0.96, 1.1]} size={[0.5, 0.04, 0.4]} color="#8fa5ad" />
    </group>
  );
}

function LoungeChair({ x, z, rot = 0 }) {
  return (
    <group position={[x, 0, z]} rotation={[0, rot, 0]}>
      <Box pos={[0, 0.25, 0]} size={[0.8, 0.4, 0.8]} color="#7d8a6a" />
      <Box pos={[0, 0.6, -0.32]} size={[0.8, 0.5, 0.16]} color="#8b9877" />
      <Box pos={[-0.48, 0.42, 0]} size={[0.12, 0.35, 0.8]} color="#6f7d5c" />
      <Box pos={[0.48, 0.42, 0]} size={[0.12, 0.35, 0.8]} color="#6f7d5c" />
    </group>
  );
}

export default function Furniture() {
  return (
    <group>
      {/* ---- Living Room (center-front) ---- */}
      <TV x={-2.0} z={2.5} rot={Math.PI / 2} /> {/* TV on the west (carport) wall */}
      <Sofa x={0.6} z={2.5} rot={-Math.PI / 2} /> {/* faces the TV */}
      <CoffeeTable x={-0.6} z={2.5} />
      <mesh position={[-0.4, 0.025, 2.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3.2, 2.6]} />
        <meshStandardMaterial color="#c3bcae" roughness={1} />
      </mesh>
      {/* corner plant by the front glazing */}
      <Cyl pos={[1.6, 0.35, 3.9]} args={[0.24, 0.17, 0.7, 12]} color="#6a6258" />
      <mesh position={[1.6, 0.95, 3.9]} castShadow>
        <sphereGeometry args={[0.42, 12, 12]} />
        <meshStandardMaterial color="#4f7a44" roughness={1} />
      </mesh>

      {/* ---- Dining Room (center) ---- */}
      <DiningSet x={0} z={-1.0} />

      {/* ---- Kitchen (center-rear) — L-counter along the rear + east walls ---- */}
      <group position={[0.2, 0, -4.0]} rotation={[0, Math.PI, 0]}>
        <KitchenSet x={0} z={0} />
      </group>
      {/* 2-door fridge in the rear-east kitchen corner */}
      <group position={[1.7, 0, -5.0]}>
        <Box pos={[0, 0.97, 0]} size={[0.9, 1.9, 0.72]} color="#d8dade" />
        <Box pos={[0, 0.97, -0.37]} size={[0.9, 1.82, 0.02]} color="#9aa0a6" />
        <Box pos={[-0.3, 1.35, -0.38]} size={[0.03, 0.55, 0.04]} color="#3a3a3e" />
      </group>

      {/* ---- Family Room (right-mid) ---- */}
      <TV x={6.4} z={-1.0} rot={-Math.PI / 2} /> {/* TV on the east wall */}
      <Sofa x={3.5} z={-1.0} rot={Math.PI / 2} />
      <CoffeeTable x={4.9} z={-1.0} />

      {/* ---- Bedrooms ---- */}
      {/* Master (left-mid): bed against the west wall */}
      <Bed x={-5.4} z={-1.0} rot={Math.PI / 2} />
      <Wardrobe x={-2.9} z={-1.9} rot={0} />
      {/* Bedroom 2 (right-rear): bed against the rear wall */}
      <Bed x={4.5} z={-4.5} rot={0} />
      <Wardrobe x={6.1} z={-2.9} rot={0} />
      {/* Bedroom 3 (right-front): bed against the north wall */}
      <Bed x={4.5} z={1.6} rot={0} />
      <Wardrobe x={6.1} z={3.6} rot={0} />

      {/* ---- Bathroom (rear-left, west) ---- */}
      {/* toilet */}
      <Box pos={[-6.2, 0.25, -3.0]} size={[0.4, 0.5, 0.55]} color="#f4f4f2" />
      <Box pos={[-6.2, 0.55, -3.25]} size={[0.4, 0.3, 0.12]} color="#f4f4f2" />
      {/* vanity */}
      <Box pos={[-6.3, 0.42, -4.6]} size={[0.9, 0.14, 0.45]} color="#e9e6df" />
      <Box pos={[-6.3, 0.2, -4.6]} size={[0.8, 0.4, 0.4]} color="#cfc8bc" />
      {/* shower tray + glass */}
      <Box pos={[-5.0, 0.03, -3.0]} size={[0.9, 0.06, 0.8]} color="#c7d0d2" />
      <mesh position={[-4.6, 1.0, -3.0]}>
        <boxGeometry args={[0.03, 2.0, 0.8]} />
        <meshStandardMaterial color="#a7c4cc" transparent opacity={0.35} />
      </mesh>

      {/* ---- Laundry (rear-left, east of bathroom) ---- */}
      <Box pos={[-3.9, 0.46, -4.7]} size={[0.62, 0.9, 0.62]} color="#eceae4" />
      <Box pos={[-3.9, 0.5, -4.38]} size={[0.4, 0.4, 0.02]} color="#33343a" />
      <Box pos={[-2.9, 0.46, -4.7]} size={[0.62, 0.9, 0.62]} color="#e4e2dc" />
      <Box pos={[-2.9, 0.5, -4.38]} size={[0.4, 0.4, 0.02]} color="#33343a" />

      {/* ---- Front porch seating ---- */}
      <LoungeChair x={-1.4} z={5.6} rot={0} />
      <LoungeChair x={1.4} z={5.6} rot={0} />
      <Box pos={[0, 0.25, 5.7]} size={[0.7, 0.15, 0.5]} color="#7a614a" /> {/* side table */}

      {/* ---- Side porch bench (east) ---- */}
      <Box pos={[7.55, 0.45, -1.0]} size={[0.5, 0.1, 1.6]} color="#8a6f52" />
      <Cyl pos={[7.55, 0.22, -1.6]} args={[0.05, 0.05, 0.45, 8]} color="#6f5b45" />
      <Cyl pos={[7.55, 0.22, -0.4]} args={[0.05, 0.05, 0.45, 8]} color="#6f5b45" />
    </group>
  );
}
