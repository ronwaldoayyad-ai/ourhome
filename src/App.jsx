import { useState, useCallback } from 'react';
import Scene from './components/Scene';
import ControlPanel from './components/ControlPanel';
import FloorPlan from './components/FloorPlan';
import BudgetSection from './components/BudgetSection';
import { SPECS } from './data';
import './App.css';

export default function App() {
  const [state, setState] = useState({
    mode: 'orbit',
    showRoof: true,
    showWalls: true,
    showFurniture: true,
    night: false,
    realistic: true,
    fov: 50,
    focus: null,
  });

  const set = useCallback((patch) => setState((s) => ({ ...s, ...patch })), []);

  const onSelectRoom = useCallback((room) => {
    // focusing a room auto-lifts the roof so you can see inside
    setState((s) => ({ ...s, focus: room, showRoof: false }));
  }, []);

  const closeCard = () => set({ focus: null });
  const activeRoom = state.focus && state.focus.id !== 'overview' ? state.focus : null;

  return (
    <div className="app">
      {/* ---------------- 3D hero ---------------- */}
      <div className="hero">
        <Scene
          mode={state.mode}
          showRoof={state.showRoof}
          showWalls={state.showWalls}
          showFurniture={state.showFurniture}
          night={state.night}
          realistic={state.realistic}
          fov={state.fov}
          focus={state.focus}
          onSelectRoom={onSelectRoom}
        />

        <header className="brand">
          <h1>Casa Verde</h1>
          <p>Modern 3-Bedroom Bungalow · Interactive 3D Concept</p>
        </header>

        <ControlPanel state={state} set={set} />

        {activeRoom && (
          <div className="room-card">
            <button className="close" onClick={closeCard}>×</button>
            <div className="rc-swatch" style={{ background: activeRoom.color }} />
            <h3>{activeRoom.name}</h3>
            <div className="rc-area">{activeRoom.area} m²</div>
            <p>{activeRoom.desc}</p>
          </div>
        )}

        <div className="scroll-cue">▾ scroll for specs &amp; budget</div>
      </div>

      {/* ---------------- Content ---------------- */}
      <main>
        <section className="section overview">
          <h2>The Design</h2>
          <p className="lead">
            <strong>Casa Verde</strong> is a single-storey modern bungalow raised on an elevated
            foundation, organised on a clean three-by-three room grid. The kitchen, dining, and
            living rooms run straight up the center as one social spine; three bedrooms occupy the
            east side and the far corners, with the master and a bath-and-laundry wing on the west.
            A covered carport tucks into the front-left, and the home opens out through a front
            entry porch, a side porch off the family room, a back porch behind the kitchen, and a
            landscaped garden by the front bedroom.
          </p>
          <div className="specs">
            {SPECS.map((s) => (
              <div className="spec" key={s.label}>
                <div className="spec-val">{s.value}</div>
                <div className="spec-lbl">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="section plan">
          <h2>Floor Plan</h2>
          <p className="lead">Top-down schematic — the same layout you’re exploring in 3D above.</p>
          <FloorPlan />
        </section>

        <BudgetSection />

        <footer className="foot">
          Concept design · figures are planning estimates, not a formal quote · built as an
          interactive study.
        </footer>
      </main>
    </div>
  );
}
