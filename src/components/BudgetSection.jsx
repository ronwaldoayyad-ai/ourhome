import { BUDGET, BUDGET_TOTAL, peso } from '../data';

const COLORS = [
  '#4a6fa5', '#5b8c5a', '#c98b4a', '#a05b8c', '#4a9c9c',
  '#c9584a', '#8c7a4a', '#6a5b9c', '#4a8ca0', '#9c6a4a',
  '#5a9c6a', '#7a7a7a',
];

export default function BudgetSection() {
  const sum = BUDGET.reduce((a, b) => a + b.amount, 0);
  const withinBudget = sum <= BUDGET_TOTAL;

  return (
    <section className="section budget" id="budget">
      <h2>Budget Breakdown</h2>
      <p className="lead">
        Concept cost estimate against a maximum budget of <strong>{peso(BUDGET_TOTAL)}</strong>.
        These are illustrative Philippine construction figures for planning — not a certified
        contractor’s bill of quantities.
      </p>

      {/* stacked budget bar */}
      <div className="budget-bar">
        {BUDGET.map((b, i) => (
          <div
            key={b.item}
            className="budget-seg"
            style={{ width: `${(b.amount / sum) * 100}%`, background: COLORS[i % COLORS.length] }}
            title={`${b.item}: ${peso(b.amount)}`}
          />
        ))}
      </div>

      <div className="budget-grid">
        {BUDGET.map((b, i) => (
          <div className="budget-item" key={b.item}>
            <span className="swatch" style={{ background: COLORS[i % COLORS.length] }} />
            <span className="bi-name">{b.item}</span>
            <span className="bi-amt">{peso(b.amount)}</span>
          </div>
        ))}
      </div>

      <div className={`budget-total ${withinBudget ? 'ok' : 'over'}`}>
        <span>Total estimated cost</span>
        <span>{peso(sum)}</span>
      </div>
      <div className="budget-status">
        {withinBudget
          ? `✓ Within your ${peso(BUDGET_TOTAL)} budget (₱${(BUDGET_TOTAL - sum).toLocaleString('en-PH')} headroom)`
          : `⚠ Over budget by ${peso(sum - BUDGET_TOTAL)}`}
      </div>
    </section>
  );
}
