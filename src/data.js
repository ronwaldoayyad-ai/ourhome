// ---------------------------------------------------------------------------
// Design data for the modern bungalow. Units are METERS on the X (width) / Z
// (depth) plane, Y is up. Footprint of the enclosed house is roughly
// X:[-6.5, 6.5] (13 m) by Z:[-5, 4] (9 m). The outdoor kitchen is a covered
// lanai extending off the rear-left of the house.
// ---------------------------------------------------------------------------

export const WALL_H = 3.9; // interior wall height (m) — high modern ceiling

// Each room: center [x, z] and size [width, depth] in meters, plus a camera
// framing used when the room is clicked, and info shown in the hotspot card.
export const ROOMS = [
  {
    id: 'living',
    name: 'Living Room',
    zone: 'interior',
    color: '#c9a27e',
    center: [2.75, 1.5],
    size: [7.5, 5],
    area: 37,
    desc: 'A wide, open great room spanning the whole front-right and center of the home — full floor-to-ceiling windows, flowing into the open dining space. Widened by removing the indoor bathroom and kitchen.',
  },
  {
    id: 'dining',
    name: 'Dining',
    zone: 'interior',
    color: '#b7c9a2',
    center: [-3.75, 2.5],
    size: [5.5, 3],
    area: 16.5,
    desc: 'Dining area at the front-left, integrated with the kitchen and extended forward — open to the living area, but walled off from the veranda.',
  },
  {
    id: 'master',
    name: 'Master Bedroom',
    zone: 'interior',
    color: '#c9a2b8',
    center: [-4.33, -3],
    size: [4.33, 4],
    area: 17,
    desc: 'The master bedroom — now roomier, sized for a queen bed with space for a wardrobe and a study nook.',
  },
  {
    id: 'bed2',
    name: 'Bedroom 2',
    zone: 'interior',
    color: '#c9c1a2',
    center: [0, -3],
    size: [4.33, 4],
    area: 17,
    desc: 'A comfortable, roomy second bedroom with a window to the rear garden.',
  },
  {
    id: 'bed3',
    name: 'Bedroom 3',
    zone: 'interior',
    color: '#a2c9a6',
    center: [4.33, -3],
    size: [4.33, 4],
    area: 17,
    desc: 'Third bedroom, ideal as a kids’ room or a home office — now with more space.',
  },
  {
    id: 'bathroom',
    name: 'Bathroom',
    zone: 'interior',
    color: '#9fc7c2',
    center: [-7.75, -3.3],
    size: [2.5, 3.4],
    area: 8,
    desc: 'Full bathroom in the rear-west wing (the former outdoor-kitchen spot) — toilet, vanity, and a walk-in shower. Reached from the master bedroom or the carport side.',
  },
  {
    id: 'laundry',
    name: 'Laundry',
    zone: 'interior',
    color: '#c2cbd6',
    center: [-10.25, -3.3],
    size: [2.5, 3.4],
    area: 8,
    desc: 'Laundry room with washer and dryer, sharing the rear-west wing with the bathroom.',
  },
  {
    id: 'veranda',
    name: 'Veranda',
    zone: 'lanai',
    color: '#d8b98a',
    center: [2.75, 5.3],
    size: [7.5, 2.6],
    area: 19,
    desc: 'Covered front veranda, now sized to align with the living room (right half of the front), with a railing and steps down to the raised yard.',
  },
  {
    id: 'outdoor',
    name: 'Kitchen',
    zone: 'interior',
    color: '#d9b382',
    center: [-3.75, 5.3],
    size: [5.5, 2.6],
    area: 14,
    desc: 'Kitchen integrated with the dining and extended to the front — built-in counter, grill, sink, and breakfast bar. Enclosed and walled off from the veranda next door.',
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
  { item: 'Indoor kitchen cabinetry', amount: 100_000 },
  { item: 'Outdoor kitchen (grill, counter, roof)', amount: 130_000 },
  { item: 'Contingency (7.5%)', amount: 150_000 },
];

export const SPECS = [
  { label: 'Bedrooms', value: '3' },
  { label: 'Bath + Laundry', value: 'West wing' },
  { label: 'Living area', value: '~37 m²' },
  { label: 'Parking', value: 'Carport + driveway' },
  { label: 'Storeys', value: '1 (bungalow)' },
  { label: 'Floor area', value: '~117 m²' },
  { label: 'Outdoor lanai', value: '~22 m²' },
  { label: 'Style', value: 'Modern flat-roof' },
];

export const peso = (n) =>
  '₱' + n.toLocaleString('en-PH', { maximumFractionDigits: 0 });
