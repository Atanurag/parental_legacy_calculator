import HistoryPanel from '../components/HistoryPanel';

export default function History({ history, onView, onDelete }) {
  return (
    <div className="page">
      <div className="page-title">
        <div>
          <span className="eyebrow">STORAGE</span>
          <h2>Saved results</h2>
          <p>Manage calculations persisted in <code>db.json</code>.</p>
        </div>
      </div>

      <HistoryPanel
        history={history}
        onView={onView}
        onDelete={onDelete}
      />
    </div>
  );
}
