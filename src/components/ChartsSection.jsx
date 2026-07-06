import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const MOTHER = "#c34670";
const FATHER = "#2e6e8e";

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="surface rounded-lg px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 font-semibold text-ink">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: <span className="font-mono">{p.value.toFixed(3)}</span>
        </p>
      ))}
    </div>
  );
}

export default function ChartsSection({ result }) {
  const barData = result.factors.map((f) => ({
    name: f.label.length > 14 ? `${f.label.slice(0, 13)}…` : f.label,
    Mother: f.mother,
    Father: f.father,
  }));

  const pieData = [
    { name: "Mother", value: result.motherTotal, color: MOTHER },
    { name: "Father", value: result.fatherTotal, color: FATHER },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
      <div className="surface animate-rise rounded-2xl p-5 lg:col-span-3">
        <h3 className="font-display mb-4 text-base font-semibold text-ink">Mother vs Father, per factor</h3>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={barData} margin={{ top: 5, right: 10, left: -18, bottom: 45 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "var(--ink-soft)" }}
              angle={-35}
              textAnchor="end"
              interval={0}
            />
            <YAxis tick={{ fontSize: 11, fill: "var(--ink-soft)" }} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--line)", opacity: 0.3 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Mother" fill={MOTHER} radius={[4, 4, 0, 0]} />
            <Bar dataKey="Father" fill={FATHER} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="surface animate-rise rounded-2xl p-5 lg:col-span-2">
        <h3 className="font-display mb-4 text-base font-semibold text-ink">Share of grand total</h3>
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={2}
              stroke="var(--bg-elevated)"
            >
              {pieData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
