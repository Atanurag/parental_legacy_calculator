import { BarChart3, Clock3, FileText, LayoutDashboard, Moon, Sun, UploadCloud } from 'lucide-react';

export default function Sidebar({ active, onChange, dark, setDark }) {
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'history', label: 'Saved Results', icon: Clock3 },
    { id: 'reports', label: 'Reports', icon: FileText }
  ];

  return (
    <aside className="sidebar">
      <div className="brand" onClick={() => onChange('dashboard')}>
        <div className="brand-mark"><BarChart3 size={18} /></div>
        <div><strong>LegacyLens</strong><span>LIFE & PARENTAL</span></div>
      </div>

      <div className="nav-section-label">WORKSPACE</div>
      <nav>
        {items.map(({ id, label, icon: Icon }) => (
          <button key={id} className={`nav-item ${active === id ? 'active' : ''}`} onClick={() => onChange(id)}>
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-spacer" />
      <button className="nav-item" onClick={() => setDark(!dark)}>
        {dark ? <Sun size={18} /> : <Moon size={18} />}
        <span>{dark ? 'Light mode' : 'Dark mode'}</span>
      </button>
      <div className="sidebar-note">
        <UploadCloud size={18} />
        <div><b>Local-first storage</b><span>Results are saved to your JSON-backed API.</span></div>
      </div>
    </aside>
  );
}
