// ---------------------------------------------------------------------------
// Design data for the modern bungalow. Units are METERS on the X (width) / Z
// (depth) plane, Y is up. Layout follows a 3x3 room grid:
//
//            LEFT              CENTER            RIGHT
//   REAR   Bath + Laundry     Kitchen           Bedroom 2
//   MID    Master Bedroom     Dining            Family Room
//   FRONT  Carport (open)     Living            Bedroom 3
//
// Enclosed house footprint: X:[-6.75, 6.75] (13.5 m) by Z:[-5.5, 4.5] (10 m).
// Outdoor: back porch + rear yards (rear), side porch (east), front entry
// porch + garden (front). -Z is the rear, +Z is the front.
// ---------------------------------------------------------------------------

export const WALL_H = 3.9; // interior wall height (m) — high modern ceiling

// Grid lines shared with House.jsx geometry (meters).
export const GRID = {
  xW: -6.75, // west outer wall
  x1: -2.25, // left | center divider
  x2: 2.25, // center | right divider
  xE: 6.75, // east outer wall
  zR: -5.5, // rear outer wall
  z1: -2.5, // rear | mid divider
  z2: 0.5, // mid | front divider
  zF: 4.5, // front outer wall
};

// Each room: center [x, z] and size [width, depth] in meters, plus a camera
// framing used when the room is clicked, and info shown in the hotspot card.
// zone: 'interior' (walled room) | 'lanai' (covered/open outdoor).
// hotspot:false hides the clickable 3D label (still shown in the 2D plan).
export const ROOMS = [
  // ---- Rear row ----
  {
    id: 'bathroom',
    name: 'Bathroom',
    zone: 'interior',
    color: '#9fc7c2',
    center: [-5.6, -4.0],
    size: [2.3, 3.0],
    area: 7,
    desc: 'Full bathroom in the rear-left corner — toilet, vanity, and a walk-in shower, sharing the rear-left wing with the laundry.',
  },
  {
    id: 'laundry',
    name: 'Laundry',
    zone: 'interior',
    color: '#c2cbd6',
    center: [-3.35, -4.0],
    size: [2.2, 3.0],
    area: 7,
    desc: 'Laundry room with washer and dryer beside the bathroom, opening toward the kitchen and the back porch.',
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    zone: 'interior',
    color: '#d9b382',
    center: [0, -4.0],
    size: [4.5, 3.0],
    area: 14,
    desc: 'Central kitchen at the rear of the home with an L-shaped counter, opening onto the dining room and out to the covered back porch.',
  },
  {
    id: 'bed2',
    name: 'Bedroom 2',
    zone: 'interior',
    color: '#c9c1a2',
    center: [4.5, -4.0],
    size: [4.5, 3.0],
    area: 14,
    desc: 'Rear-right bedroom with a window to the back yard — a comfortable double, ideal as a guest or children’s room.',
  },
  // ---- Middle row ----
  {
    id: 'master',
    name: 'Master Bedroom',
    zone: 'interior',
    color: '#c9a2b8',
    center: [-4.5, -1.0],
    size: [4.5, 3.0],
    area: 14,
    desc: 'The master bedroom on the west side, sized for a queen bed with room for a wardrobe, and steps from the bathroom next door.',
  },
  {
    id: 'dining',
    name: 'Dining Room',
    zone: 'interior',
    color: '#b7c9a2',
    center: [0, -1.0],
    size: [4.5, 3.0],
    area: 14,
    desc: 'Dining room at the heart of the plan — open to the kitchen behind it and the living room in front, the social core of the house.',
  },
  {
    id: 'family',
    name: 'Family Room',
    zone: 'interior',
    color: '#c9a27e',
    center: [4.5, -1.0],
    size: [4.5, 3.0],
    area: 14,
    desc: 'A second, more casual living space on the east side, opening through a glass door onto the side porch.',
  },
  // ---- Front row ----
  {
    id: 'living',
    name: 'Living Room',
    zone: 'interior',
    color: '#cbb089',
    center: [0, 2.5],
    size: [4.5, 4.0],
    area: 18,
    desc: 'The formal living room at the front and center, opening through the main entrance and the covered porch — full-height front glazing.',
  },
  {
    id: 'bed3',
    name: 'Bedroom 3',
    zone: 'interior',
    color: '#a2c9a6',
    center: [4.5, 2.5],
    size: [4.5, 4.0],
    area: 18,
    desc: 'Front-right bedroom overlooking the garden — the largest of the three, easily a master suite or a home office.',
  },
  // ---- Outdoor / covered ----
  {
    id: 'carport',
    name: 'Carport',
    zone: 'lanai',
    color: '#b7c4d0',
    center: [-4.5, 2.5],
    size: [4.5, 4.0],
    area: 18,
    desc: 'Covered carport on the front-left with a driveway apron — parking for one vehicle, sheltered by the extended roofline.',
  },
  {
    id: 'frontporch',
    name: 'Porch',
    zone: 'lanai',
    color: '#d8b98a',
    center: [0, 5.9],
    size: [4.5, 2.8],
    area: 13,
    desc: 'Covered front entry porch spanning the living room, with railings and steps down to the front path.',
  },
  {
    id: 'garden',
    name: 'Garden',
    zone: 'lanai',
    color: '#8bbf6e',
    center: [4.5, 5.7],
    size: [4.5, 2.4],
    area: 11,
    desc: 'Landscaped front garden off Bedroom 3 — planting beds and a lawn edge that soften the front elevation.',
  },
  {
    id: 'sideporch',
    name: 'Side Porch',
    zone: 'lanai',
    color: '#d8b98a',
    center: [7.55, -1.0],
    size: [1.6, 3.0],
    area: 5,
    hotspot: false,
    desc: 'A narrow covered side porch off the family room on the east elevation.',
  },
  {
    id: 'backporch',
    name: 'Back Porch',
    zone: 'lanai',
    color: '#d8b98a',
    center: [0, -6.35],
    size: [3.0, 1.7],
    area: 5,
    hotspot: false,
    desc: 'Covered back porch off the kitchen, opening to the rear yard.',
  },
  {
    id: 'yardL',
    name: 'Yard',
    zone: 'lanai',
    color: '#9ec3d6',
    center: [-4.5, -6.4],
    size: [4.5, 1.8],
    area: 8,
    hotspot: false,
    desc: 'Rear-left yard.',
  },
  {
    id: 'yardR',
    name: 'Yard',
    zone: 'lanai',
    color: '#9ec3d6',
    center: [4.5, -6.4],
    size: [4.5, 1.8],
    area: 8,
    hotspot: false,
    desc: 'Rear-right yard.',
  },
];

// ---------------------------------------------------------------------------
// Budget breakdown — illustrative Philippine construction estimates for the
// concept. NOT a certified bill of quantities. Sums to exactly ₱2,000,000.
// ---------------------------------------------------------------------------
export const BUDGET_TOTAL = 2_000_000;

export const BUDGET = [
  { item: 'Site preparation & earthworks', amount: 90_000 },
  { item: 'Foundation & concrete slab', amount: 230_000 },
  { item: 'Structural framing & CHB walls', amount: 340_000 },
  { item: 'Roofing, trusses & waterproofing', amount: 250_000 },
  { item: 'Doors & windows', amount: 150_000 },
  { item: 'Electrical rough-in & fixtures', amount: 130_000 },
  { item: 'Plumbing & bathroom fixtures', amount: 120_000 },
  { item: 'Flooring & wall tiles', amount: 170_000 },
  { item: 'Painting & interior finishes', amount: 140_000 },
  { item: 'Kitchen cabinetry', amount: 100_000 },
  { item: 'Carport, porches & landscaping', amount: 130_000 },
  { item: 'Contingency (7.5%)', amount: 150_000 },
];

export const SPECS = [
  { label: 'Bedrooms', value: '3' },
  { label: 'Bathroom', value: '1 + laundry' },
  { label: 'Living spaces', value: 'Living + family' },
  { label: 'Parking', value: 'Carport + driveway' },
  { label: 'Storeys', value: '1 (bungalow)' },
  { label: 'Floor area', value: '~120 m²' },
  { label: 'Outdoor', value: 'Porches + garden' },
  { label: 'Style', value: 'Modern flat-roof' },
];

export const peso = (n) =>
  '₱' + n.toLocaleString('en-PH', { maximumFractionDigits: 0 });
