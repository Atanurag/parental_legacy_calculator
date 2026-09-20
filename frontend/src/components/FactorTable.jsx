import { CheckCircle2 } from 'lucide-react';

export default function FactorTable({ factors }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr><th>#</th><th>Life factor</th><th>Mother</th><th>Father</th><th>Total</th><th>Range</th></tr>
        </thead>
        <tbody>
          {factors.map((factor, index) => (
            <tr key={factor.key}>
              <td className="muted">{index + 1}</td>
              <td className="factor-name">{factor.name}</td>
              <td className="mother-value">{factor.mother.toFixed(3)}</td>
              <td className="father-value">{factor.father.toFixed(3)}</td>
              <td><b>{factor.total.toFixed(3)}</b></td>
              <td className="range"><CheckCircle2 size={14} /> {factor.min.toFixed(3)} – {factor.max.toFixed(3)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
