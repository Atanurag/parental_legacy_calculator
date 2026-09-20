import { CalendarDays, Sparkles } from 'lucide-react';

export default function DobForm({ dob, setDob, onCalculate, loading }) {
  const toIso = (value) => {
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return '';
    const [day, month, year] = value.split('/');
    return `${year}-${month}-${day}`;
  };

  const fromIso = (value) => {
    if (!value) return '';
    const [year, month, day] = value.split('-');
    return `${day}/${month}/${year}`;
  };

  const maxDate = new Date().toISOString().split('T')[0];

  return (
    <div className="hero-form">
      <div className="hero-copy">
        <div className="eyebrow"><Sparkles size={14} /> DYNAMIC ANALYSIS</div>
        <h1>Discover your parental legacy.</h1>
        <p>Enter a date of birth to generate a transparent, deterministic life-factor profile with a complete Mother vs Father breakdown.</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onCalculate(); }} className="dob-form">
        <label htmlFor="dob-input">Date of Birth <span>Required</span></label>
        <div className="dob-input-stack">
          <div className="date-input">
            <CalendarDays size={18} aria-hidden="true" />
            <input
              id="dob-input"
              type="date"
              max={maxDate}
              value={toIso(dob)}
              onChange={(e) => setDob(fromIso(e.target.value))}
              aria-label="Date of birth"
            />
          </div>
          <button className="primary-btn generate-btn" disabled={loading}>
            {loading ? 'Calculating…' : 'Generate legacy'}
          </button>
        </div>
        <small>Selected: <b>{dob || '—'}</b> <span className="helper-dot">•</span> Odd day → Mother higher <span className="helper-dot">•</span> Even day → Father higher</small>
      </form>
    </div>
  );
}
