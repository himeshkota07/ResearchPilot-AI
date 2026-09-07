import Card from "../common/Card";

export default function StatsCard({
  icon,
  title,
  value,
}) {
  return (
    <Card>
      <div style={{ fontSize: 30 }}>{icon}</div>

      <h3>{title}</h3>

      <h1>{value}</h1>
    </Card>
  );
}