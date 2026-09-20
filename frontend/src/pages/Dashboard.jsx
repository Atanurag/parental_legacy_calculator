import { CheckCircle2, RefreshCw, ShieldCheck } from 'lucide-react';
import StatCard from '../components/StatCard';
import FactorTable from '../components/FactorTable';
import LegacyChart from '../components/LegacyChart';
import Donut from '../components/Donut';
import DobForm from '../components/DobForm';

export default function Dashboard({
  dob,
  setDob,
  onCalculate,
  loading,
  result,
  summary,
  defaultDob,
  onRecalculate,
}) {
  return (
    <div className="page">
      <DobForm
        dob={dob}
        setDob={setDob}
        onCalculate={onCalculate}
        loading={loading}
      />

      {result ? (
        <>
          <div className="dashboard-toolbar">
            <div className="dashboard-heading">
              <h2>Parental legacy breakdown</h2>
              <p>
                Interactive factor-level analysis for DOB {result.dob}.
              </p>
            </div>

            <button
              className="outline-btn"
              onClick={onRecalculate}
              disabled={loading}
            >
              <RefreshCw size={16} />
              <span>Recalculate</span>
            </button>
          </div>

          <DashboardResult result={result} summary={summary} />
        </>
      ) : (
        <EmptyWelcome
          defaultDob={defaultDob}
          onGenerate={onCalculate}
        />
      )}
    </div>
  );
}

function DashboardResult({ result, summary }) {
  return (
    <>
      <section className="stats-grid">
        <StatCard
          type="mother"
          label="Mother's influence"
          value={result.motherTotal.toFixed(3)}
          caption="Total across 7 factors"
        />

        <StatCard
          type="father"
          label="Father's influence"
          value={result.fatherTotal.toFixed(3)}
          caption="Total across 7 factors"
        />

        <StatCard
          type="dominant"
          label="Dominant parent"
          value={result.dominantParent}
          caption={`${result.isOddDay ? 'Odd' : 'Even'} date rule · ${summary}`}
        />
      </section>

      <section className="content-grid">
        <div className="panel table-panel">
          <div className="card-heading">
            <div>
              <h3>Detailed factor breakdown</h3>
              <p>
                Every value remains inside the supplied minimum/maximum range.
              </p>
            </div>

            <div className="valid-badge">
              <CheckCircle2 size={15} />
              100.000 reconciled
            </div>
          </div>

          <FactorTable factors={result.factors} />
        </div>

        <div className="panel influence-panel">
          <div className="card-heading">
            <div>
              <h3>Legacy balance</h3>
              <p>Combined parental contribution.</p>
            </div>
          </div>

          <div className="balance">
            <Donut
              mother={result.motherTotal}
              father={result.fatherTotal}
            />

            <div className="legend">
              <div>
                <span className="dot mother-dot" />
                Mother
                <b>{result.motherTotal.toFixed(3)}</b>
              </div>

              <div>
                <span className="dot father-dot" />
                Father
                <b>{result.fatherTotal.toFixed(3)}</b>
              </div>
            </div>
          </div>

          <div className="rule-card">
            <ShieldCheck size={18} />

            <div>
              <b>Validation passed</b>
              <span>
                Mother + Father = {result.grandTotal.toFixed(3)}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="content-grid chart-grid">
        <LegacyChart factors={result.factors} />
        <Methodology result={result} />
      </section>
    </>
  );
}

function Methodology({ result }) {
  return (
    <div className="panel methodology">
      <div className="card-heading">
        <div>
          <h3>How this result is generated</h3>
          <p>Simple rules, no hidden database.</p>
        </div>
      </div>

      <div className="method-step">
        <span>01</span>
        <div>
          <b>Date validation</b>
          <p>
            DD/MM/YYYY is checked for a real calendar date and future dates are
            rejected.
          </p>
        </div>
      </div>

      <div className="method-step">
        <span>02</span>
        <div>
          <b>Parent rule</b>
          <p>
            {result.algorithm.parentRule}. The date also seeds the deterministic
            values.
          </p>
        </div>
      </div>

      <div className="method-step">
        <span>03</span>
        <div>
          <b>Range + reconciliation</b>
          <p>
            Each parent factor stays within the provided range, then totals
            reconcile to exactly 100.000.
          </p>
        </div>
      </div>
    </div>
  );
}

function EmptyWelcome({ defaultDob, onGenerate }) {
  return (
    <div className="empty-dashboard">
      <div className="empty-icon">
        <ShieldCheck size={28} />
      </div>

      <h2>Ready to calculate</h2>

      <p>
        Enter a date of birth above and generate your first parental legacy
        profile.
      </p>

      <button className="primary-btn" onClick={onGenerate}>
        Use {defaultDob}
      </button>
    </div>
  );
}
