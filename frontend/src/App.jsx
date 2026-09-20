import { useEffect, useMemo, useState } from 'react';
import { Info, Menu, X } from 'lucide-react';

import Sidebar from './components/Sidebar';
import { calculate, deleteHistoryItem, getHistory } from './lib/api';

import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Reports from './pages/Reports';

const defaultDob = '02/09/2026';

function todayString() {
  const now = new Date();

  return `${String(now.getDate()).padStart(2, '0')}/${String(
    now.getMonth() + 1
  ).padStart(2, '0')}/${now.getFullYear()}`;
}

export default function App() {
  const [active, setActive] = useState('dashboard');
  const [dob, setDob] = useState(defaultDob);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [dark, setDark] = useState(
    () => localStorage.getItem('legacy-theme') !== 'light'
  );

  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    localStorage.setItem('legacy-theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    getHistory()
      .then((data) => setHistory(data.results || []))
      .catch(() => {});
  }, []);

  const generate = async (save = true) => {
    setError('');
    setLoading(true);

    try {
      const data = await calculate(dob, save);

      setResult(data.result);

      if (save) {
        setHistory((prev) =>
          [
            data.result,
            ...prev.filter((item) => item.dob !== data.result.dob),
          ].slice(0, 100)
        );
      }

      setActive('dashboard');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const viewSaved = (item) => {
    setResult(item);
    setDob(item.dob);
    setActive('dashboard');
    setMobileOpen(false);
  };

  const removeSaved = async (id) => {
    try {
      await deleteHistoryItem(id);
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (e) {
      setError(e.message);
    }
  };

  const summary = useMemo(
    () =>
      result
        ? `${result.dominantParent} has ${Math.abs(
            result.motherTotal - result.fatherTotal
          ).toFixed(3)} more points of influence.`
        : '',
    [result]
  );

  const changePage = (id) => {
    setActive(id);
    setMobileOpen(false);
  };

  return (
    <div className="app-shell">
      <div
        className={`mobile-backdrop ${mobileOpen ? 'show' : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      <div className={`sidebar-holder ${mobileOpen ? 'open' : ''}`}>
        <Sidebar
          active={active}
          onChange={changePage}
          dark={dark}
          setDark={setDark}
        />
      </div>

      <main className="main-content">
        <header className="topbar">
          <button
            className="mobile-menu"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu />
          </button>

          <div>
            <span className="breadcrumb">Analytics /</span>{' '}
            <b>
              {active === 'history'
                ? 'History'
                : active === 'reports'
                ? 'Reports'
                : 'Dashboard'}
            </b>
          </div>

          <div className="top-actions">
            <span className="today">Today · {todayString()}</span>
          </div>
        </header>

        {error && (
          <div className="error-banner">
            <Info size={18} />

            <span>{error}</span>

            <button
              onClick={() => setError('')}
              aria-label="Dismiss error"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {active === 'dashboard' && (
          <Dashboard
            dob={dob}
            setDob={setDob}
            onCalculate={() => generate(true)}
            onRecalculate={() => generate(true)}
            loading={loading}
            result={result}
            summary={summary}
            defaultDob={defaultDob}
          />
        )}

        {active === 'history' && (
          <History
            history={history}
            onView={viewSaved}
            onDelete={removeSaved}
          />
        )}

        {active === 'reports' && (
          <Reports
            result={result}
            history={history}
          />
        )}
      </main>
    </div>
  );
}