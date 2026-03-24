import Header from "../components/header";
import StatsScreen from "../components/stats-screen";

export default function TeacherStatisticPage() {
  return (
    <div className="min-h-screen bg-[#edf2f8] text-[#1f2a44]">
      <Header activeView="stats" />
      <StatsScreen />
    </div>
  );
}
