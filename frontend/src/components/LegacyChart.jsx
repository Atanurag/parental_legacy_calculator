import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

function shortLabel(name) {
  const labels = {
    'Genetic Inheritance': ['Genetic', 'Inheritance'],
    'Constitutional Vitality': ['Constitutional', 'Vitality'],
    'Mental Patterns': ['Mental', 'Patterns'],
    'Intellectual Capacity': ['Intellectual', 'Capacity'],
    'Emotional Foundation': ['Emotional', 'Foundation'],
    'Spiritual Lineage': ['Spiritual', 'Lineage'],
    'Soul Connections': ['Soul', 'Connections'],
  };
  return labels[name] || [name];
}

function DesktopAxisTick({ x, y, payload }) {
  const lines = shortLabel(payload.value);
  return (
    <g transform={`translate(${x},${y + 14})`}>
      {lines.map((line, index) => (
        <text key={line} x={0} y={index * 14} textAnchor="middle" fill="currentColor" fontSize={10}>
          {line}
        </text>
      ))}
    </g>
  );
}

function MobileYAxisTick({ x, y, payload }) {
  const lines = shortLabel(payload.value);
  return (
    <g transform={`translate(${x - 8},${y})`}>
      <text x={0} y={-4} textAnchor="end" fill="currentColor" fontSize={10}>
        {lines[0]}
      </text>
      <text x={0} y={9} textAnchor="end" fill="currentColor" fontSize={10}>
        {lines[1] || ''}
      </text>
    </g>
  );
}

export default function LegacyChart({ factors }) {
  const [mobile, setMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 760);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 760px)');
    const onChange = () => setMobile(media.matches);
    onChange();
    media.addEventListener?.('change', onChange);
    return () => media.removeEventListener?.('change', onChange);
  }, []);

  const data = factors.map((factor) => ({
    name: factor.name,
    Mother: factor.mother,
    Father: factor.father,
  }));

  return (
    <div className={`chart-card ${mobile ? 'chart-card-mobile' : ''}`}>
      <div className="card-heading">
        <div>
          <h3>Parental influence by factor</h3>
          <p>Side-by-side comparison across all seven life factors.</p>
        </div>
      </div>
      <div className="chart-area">
        <ResponsiveContainer width="100%" height="100%">
          {mobile ? (
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 4, right: 12, left: 78, bottom: 10 }}
              barGap={5}
            >
              <CartesianGrid horizontal={false} strokeDasharray="3 3" opacity={0.15} />
              <XAxis type="number" domain={[0, 12]} tick={{ fontSize: 10 }} tickLine={false} axisLine={{ opacity: 0.35 }} />
              <YAxis
                type="category"
                dataKey="name"
                interval={0}
                width={76}
                tickLine={false}
                axisLine={false}
                tick={<MobileYAxisTick />}
              />
              <Tooltip formatter={(value) => Number(value).toFixed(3)} />
              <Legend verticalAlign="top" height={34} />
              <Bar dataKey="Father" radius={[0, 5, 5, 0]} fill="#5f91d9" />
              <Bar dataKey="Mother" radius={[0, 5, 5, 0]} fill="#d85b9d" />
            </BarChart>
          ) : (
            <BarChart data={data} margin={{ top: 8, right: 12, left: -20, bottom: 42 }} barGap={5}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.15} />
              <XAxis
                dataKey="name"
                interval={0}
                height={72}
                tickLine={false}
                axisLine={{ opacity: 0.35 }}
                tick={<DesktopAxisTick />}
              />
              <YAxis domain={[0, 12]} tick={{ fontSize: 10 }} />
              <Tooltip formatter={(value) => Number(value).toFixed(3)} />
              <Legend verticalAlign="top" height={32} />
              <Bar dataKey="Mother" radius={[5, 5, 0, 0]} fill="#d85b9d" />
              <Bar dataKey="Father" radius={[5, 5, 0, 0]} fill="#5f91d9" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
