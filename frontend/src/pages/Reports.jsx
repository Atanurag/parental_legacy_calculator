import { Download, FileSpreadsheet } from 'lucide-react';
import { exportCSV, exportPDF } from '../lib/export';

export default function Reports({ result, history }) {
  return (
    <div className="page">
      <div className="page-title">
        <div>
          <span className="eyebrow">REPORT CENTER</span>
          <h2>Exports & reports</h2>
          <p>
            Download a polished PDF or spreadsheet-friendly CSV from any saved
            result.
          </p>
        </div>
      </div>

      {result ? (
        <div className="report-card">
          <div>
            <b>Current report · {result.dob}</b>
            <span>
              {result.dominantParent} dominant ·{' '}
              {result.grandTotal.toFixed(3)} total
            </span>
          </div>

          <div className="report-actions">
            <button
              className="primary-btn"
              onClick={() => exportPDF(result)}
            >
              <Download size={16} />
              PDF
            </button>

            <button
              className="outline-btn"
              onClick={() => exportCSV(result)}
            >
              <FileSpreadsheet size={16} />
              CSV
            </button>
          </div>
        </div>
      ) : (
        <div className="empty-dashboard">
          <div className="empty-icon">
            <FileSpreadsheet />
          </div>

          <h2>No report selected</h2>
          <p>Generate or open a saved calculation first.</p>
        </div>
      )}

      <div className="panel report-history">
        <div className="card-heading">
          <div>
            <h3>Report-ready history</h3>
            <p>{history.length} saved calculations available.</p>
          </div>
        </div>

        {history.slice(0, 8).map((item) => (
          <div className="report-row" key={item.id}>
            <span>{item.dob}</span>
            <span>{item.dominantParent}</span>

            <button
              className="link-btn"
              onClick={() => exportCSV(item)}
            >
              Export CSV
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
