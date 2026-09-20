import { CalendarClock, Eye, Trash2 } from 'lucide-react';

export default function HistoryPanel({ history, onView, onDelete }) {
  return (
    <div className="panel">
      <div className="card-heading"><div><h3>Saved calculations</h3><p>Your latest results stored by the backend.</p></div></div>
      {history.length === 0 ? <div className="empty"><CalendarClock size={26} /><b>No saved results yet</b><span>Generate a calculation and it will appear here.</span></div> : (
        <div className="history-list">
          {history.map((item) => (
            <div className="history-item" key={item.id}>
              <div><b>{item.dob}</b><span>{item.dominantParent} dominant · {item.grandTotal.toFixed(3)} total</span></div>
              <div className="history-actions"><button onClick={() => onView(item)} title="View"><Eye size={16} /></button><button onClick={() => onDelete(item.id)} title="Delete"><Trash2 size={16} /></button></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
