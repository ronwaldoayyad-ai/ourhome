function Toggle({ label, checked, onChange, disabled }) {
  return (
    <label className={`toggle ${disabled ? 'disabled' : ''}`}>
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} disabled={disabled} />
      <span className="switch" />
    </label>
  );
}

export default function ControlPanel({ state, set }) {
  const walk = state.mode === 'walk';
  return (
    <div className="panel">
      <div className="panel-title">Explore the Bungalow</div>

      <div className="mode-row">
        <button
          className={!walk ? 'seg active' : 'seg'}
          onClick={() => set({ mode: 'orbit' })}
        >
          🖱️ Orbit
        </button>
        <button
          className={walk ? 'seg active' : 'seg'}
          onClick={() => set({ mode: 'walk', showRoof: false })}
        >
          🚶 Walk inside
        </button>
      </div>

      <Toggle label="Roof" checked={state.showRoof} onChange={(v) => set({ showRoof: v })} disabled={walk} />
      <Toggle label="Exterior walls" checked={state.showWalls} onChange={(v) => set({ showWalls: v })} />
      <Toggle label="Furniture" checked={state.showFurniture} onChange={(v) => set({ showFurniture: v })} />
      <Toggle label="Night lighting" checked={state.night} onChange={(v) => set({ night: v })} />
      <Toggle label="Realistic mode" checked={state.realistic} onChange={(v) => set({ realistic: v })} />

      <div className="zoom-row">
        <span>Zoom</span>
        <div className="zoom-btns">
          <button aria-label="Zoom out" onClick={() => set({ fov: Math.min(72, state.fov + 6) })}>−</button>
          <button aria-label="Zoom in" onClick={() => set({ fov: Math.max(26, state.fov - 6) })}>+</button>
        </div>
      </div>

      {!walk && (
        <button className="reset" onClick={() => set({ focus: { id: 'overview' }, fov: 50 })}>
          ⟳ Reset view
        </button>
      )}

      <p className="hint">
        {walk
          ? 'Drag to look around · W A S D / arrows to walk'
          : 'Drag to orbit · scroll to zoom · click a room label to focus'}
      </p>
    </div>
  );
}
