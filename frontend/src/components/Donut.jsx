import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

export default function Donut({ mother, father }) {
  const data = [
    { name: 'Mother', value: mother },
    { name: 'Father', value: father },
  ];

  return (
    <div className="donut-wrap" aria-label="Parental contribution balance">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={48}
            outerRadius={67}
            paddingAngle={2}
            stroke="none"
          >
            <Cell fill="#d85b9d" />
            <Cell fill="#5f91d9" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="donut-center">
        <b>100</b>
        <span>TOTAL</span>
      </div>
    </div>
  );
}
