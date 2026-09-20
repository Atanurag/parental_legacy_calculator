import { ArrowUpRight, HeartPulse, ShieldCheck, Sparkles } from 'lucide-react';

const icons = { mother: HeartPulse, father: ShieldCheck, dominant: Sparkles };

export default function StatCard({ type, label, value, caption }) {
  const Icon = icons[type] || ArrowUpRight;
  return (
    <div className={`stat-card ${type}`}>
      <div className="stat-top"><span>{label}</span><span className="stat-icon"><Icon size={17} /></span></div>
      <strong>{value}</strong>
      <small>{caption}</small>
    </div>
  );
}
