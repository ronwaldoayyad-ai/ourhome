// Low-poly stylized furniture grouped by room. Everything is built from simple
// boxes / cylinders so it stays light and reliable.

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

function KitchenSet({ x, z }) {
  return (
    <group position={[x, 0, z]}>
      {/* L-counter */}
      <Box pos={[0, 0.45, 1.1]} size={[3.2, 0.9, 0.6]} color="#d7d2c8" />
      <Box pos={[1.3, 0.45, 0]} size={[0.6, 0.9, 2.0]} color="#d7d2c8" />
      {/* counter tops */}
      <Box pos={[0, 0.92, 1.1]} size={[3.3, 0.06, 0.65]} color="#3b3f47" />
      <Box pos={[1.3, 0.92, 0]} size={[0.65, 0.06, 2.05]} color="#3b3f47" />
      {/* upper cabinets */}
      <Box pos={[0, 1.9, 1.35]} size={[3.0, 0.6, 0.35]} color="#c9c3b8" />
      {/* stove + sink hints */}
      <Box pos={[-0.8, 0.96, 1.1]} size={[0.6, 0.05, 0.5]} color="#222" />
      <Box pos={[0.7, 0.96, 1.1]} size={[0.5, 0.04, 0.4]} color="#8fa5ad" />
    </group>
  );
}

function Bathroom({ x, z }) {
  return (
    <group position={[x, 0, z]}>
      {/* toilet */}
      <Box pos={[-0.8, 0.2, -0.7]} size={[0.4, 0.4, 0.55]} color="#f4f4f2" />
      <Box pos={[-0.8, 0.55, -0.9]} size={[0.4, 0.3, 0.12]} color="#f4f4f2" />
      {/* vanity sink */}
      <Box pos={[0.7, 0.4, -0.7]} size={[0.7, 0.15, 0.45]} color="#e9e6df" />
      <Box pos={[0.7, 0.2, -0.7]} size={[0.55, 0.4, 0.4]} color="#cfc8bc" />
      {/* shower tray + glass */}
      <Box pos={[0.5, 0.03, 0.6]} size={[0.9, 0.06, 0.8]} color="#c7d0d2" />
      <mesh position={[0.05, 1.0, 0.6]}>
        <boxGeometry args={[0.03, 2.0, 0.8]} />
        <meshStandardMaterial color="#a7c4cc" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

function OutdoorKitchen({ x, z }) {
  return (
    <group position={[x, 0, z]}>
      {/* long masonry counter */}
      <Box pos={[0, 0.45, -1.3]} size={[4.2, 0.9, 0.7]} color="#b9a488" />
      <Box pos={[0, 0.92, -1.3]} size={[4.3, 0.06, 0.75]} color="#4a4038" />
      {/* built-in grill */}
      <Box pos={[-1.2, 0.96, -1.3]} size={[1.0, 0.12, 0.55]} color="#2b2b2b" />
      <Cyl pos={[-1.2, 1.2, -1.3]} args={[0.1, 0.1, 0.4, 10]} color="#3b3b3b" />
      {/* sink */}
      <Box pos={[1.0, 0.95, -1.3]} size={[0.6, 0.05, 0.45]} color="#8fa5ad" />
      {/* bar stools */}
      {[-1.4, -0.2, 1.0].map((sx) => (
        <group key={sx} position={[sx, 0, -0.4]}>
          <Cyl pos={[0, 0.55, 0]} args={[0.22, 0.22, 0.1, 12]} color="#8d6e57" />
          <Cyl pos={[0, 0.27, 0]} args={[0.05, 0.05, 0.55, 8]} color="#5a5148" />
        </group>
      ))}
    </group>
  );
}

export default function Furniture() {
  return (
    <group>
      {/* Living — modern wide great room (bathroom & kitchen removed) */}
      <Box pos={[2.75, 0.32, -0.82]} size={[2.8, 0.4, 0.4]} color="#3b3d42" /> {/* low media console */}
      {/* 65" wall-mounted TV on the Z=-1 wall */}
      <Box pos={[2.75, 1.5, -0.95]} size={[1.52, 0.9, 0.04]} color="#1b1c1f" /> {/* bezel */}
      <mesh position={[2.75, 1.5, -0.92]} castShadow>
        <boxGeometry args={[1.46, 0.83, 0.04]} />
        <meshStandardMaterial color="#0d0f13" metalness={0.3} roughness={0.3} emissive="#0b1a2c" emissiveIntensity={0.35} />
      </mesh>
      <Sofa x={2.75} z={1.5} rot={Math.PI} /> {/* faces the TV, back to the glazing */}
      <CoffeeTable x={2.75} z={0.4} />
      <Sofa x={5.5} z={0.4} rot={-Math.PI / 2} /> {/* second sofa forming an L */}
      {/* area rug */}
      <mesh position={[3.0, 0.025, 0.9]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3.6, 3.2]} />
        <meshStandardMaterial color="#c3bcae" roughness={1} />
      </mesh>
      {/* floor-to-ceiling curtains flanking the front glazing + valance */}
      {[0.2, 6.25].map((cx) => (
        <mesh key={cx} position={[cx, 1.95, 3.82]} castShadow>
          <boxGeometry args={[0.34, 3.5, 0.16]} />
          <meshStandardMaterial color="#d9d2c4" roughness={1} />
        </mesh>
      ))}
      <Box pos={[3.2, 3.6, 3.84]} size={[6.6, 0.34, 0.12]} color="#cfc8ba" /> {/* valance */}
      {/* potted plant in the corner */}
      <Cyl pos={[0.5, 0.35, 0.4]} args={[0.24, 0.17, 0.7, 12]} color="#6a6258" />
      <mesh position={[0.5, 0.95, 0.4]} castShadow>
        <sphereGeometry args={[0.42, 12, 12]} />
        <meshStandardMaterial color="#4f7a44" roughness={1} />
      </mesh>

      {/* Dining (front-left, open to living) */}
      <DiningSet x={-3.75} z={2.5} />
      {/* 2-door refrigerator against the west wall */}
      <group position={[-6.1, 0, 2.9]} rotation={[0, Math.PI / 2, 0]}>
        <Box pos={[0, 0.97, 0]} size={[0.9, 1.9, 0.72]} color="#d8dade" />
        <Box pos={[0, 0.97, 0.37]} size={[0.02, 1.82, 0.02]} color="#9aa0a6" /> {/* door split */}
        <Box pos={[-0.16, 1.35, 0.4]} size={[0.03, 0.55, 0.04]} color="#3a3a3e" /> {/* handle L */}
        <Box pos={[0.16, 1.35, 0.4]} size={[0.03, 0.55, 0.04]} color="#3a3a3e" /> {/* handle R */}
      </group>

      {/* Bedrooms — 3 evenly spaced, bed against the rear wall, wardrobe near the divider */}
      <Bed x={-4.33} z={-3.4} rot={0} />
      <Wardrobe x={-2.6} z={-1.7} rot={0} />

      <Bed x={0} z={-3.4} rot={0} />
      <Wardrobe x={1.7} z={-1.7} rot={0} />

      <Bed x={4.33} z={-3.4} rot={0} />
      <Wardrobe x={5.9} z={-1.7} rot={0} />

      {/* Veranda seating — lounge chairs on the veranda in front of the living room */}
      {[0.4, 1.8].map((vx) => (
        <group key={vx} position={[vx, 0, 5.4]}>
          <Box pos={[0, 0.25, 0]} size={[0.8, 0.4, 0.8]} color="#7d8a6a" />
          <Box pos={[0, 0.6, -0.32]} size={[0.8, 0.5, 0.16]} color="#8b9877" />
          <Box pos={[-0.48, 0.42, 0]} size={[0.12, 0.35, 0.8]} color="#6f7d5c" />
          <Box pos={[0.48, 0.42, 0]} size={[0.12, 0.35, 0.8]} color="#6f7d5c" />
        </group>
      ))}
      <Box pos={[1.1, 0.25, 6.0]} size={[0.7, 0.15, 0.5]} color="#7a614a" /> {/* side table */}

      {/* Bathroom + Laundry (rear-west; former outdoor-kitchen enclosure) */}
      {/* laundry (west half): washer + dryer against the rear wall */}
      <Box pos={[-10.7, 0.46, -4.6]} size={[0.62, 0.9, 0.62]} color="#eceae4" />
      <Box pos={[-10.7, 0.5, -4.28]} size={[0.4, 0.4, 0.02]} color="#33343a" />
      <Box pos={[-9.7, 0.46, -4.6]} size={[0.62, 0.9, 0.62]} color="#e4e2dc" />
      <Box pos={[-9.7, 0.5, -4.28]} size={[0.4, 0.4, 0.02]} color="#33343a" />
      {/* bathroom (east half): toilet, vanity, shower tray */}
      <Box pos={[-6.9, 0.25, -4.6]} size={[0.4, 0.5, 0.55]} color="#f4f4f2" />
      <Box pos={[-6.9, 0.55, -4.85]} size={[0.4, 0.3, 0.12]} color="#f4f4f2" />
      <Box pos={[-8.6, 0.42, -4.7]} size={[0.55, 0.14, 0.4]} color="#e9e6df" />
      <Box pos={[-7.4, 0.03, -2.0]} size={[0.9, 0.06, 0.7]} color="#c7d0d2" />

      {/* Outdoor kitchen — now front-left, in front of the dining */}
      <OutdoorKitchen x={-3.75} z={5.3} />
    </group>
  );
}
