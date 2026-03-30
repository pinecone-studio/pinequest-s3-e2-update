import Link from "next/link";
import { store } from "@/app/lib/store";

export default function SchoolStudentsPage() {
  const classes = store.listClasses();
  const classNameById = new Map(classes.map((c) => [c.id, c.name]));
  const students = classes
    .flatMap((c) => store.listStudentsInClass(c.id))
    .map((s) => ({
      ...s,
      className: classNameById.get(s.classId) ?? "-",
      fullName: `${s.lastName} ${s.firstName}`,
    }))
    .sort((a, b) => a.fullName.localeCompare(b.fullName, "mn"));

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-[#dbe5f0] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-3 font-bold text-[#0f172a]">Сурагчдын жагсаалт</h2>
            <p className="mt-1 text-2 text-zinc-600">Нийт сурагч: {students.length}</p>
          </div>
          <Link
            href="/school/classes"
            className="text-2 font-medium text-blue-700 hover:text-blue-800"
          >
            Ангиуд руу очих →
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-[#dbe5f0] bg-white p-5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-115 text-2">
            <thead>
              <tr className="border-b border-zinc-200 text-left text-zinc-500">
                <th className="py-2">№</th>
                <th className="py-2">Овог нэр</th>
                <th className="py-2">Регистр</th>
                <th className="py-2">Анги</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student.id} className="border-b border-zinc-100">
                  <td className="py-2 text-zinc-500">{index + 1}</td>
                  <td className="py-2 font-medium text-zinc-900">{student.fullName}</td>
                  <td className="py-2 text-zinc-600">{student.studentNumber}</td>
                  <td className="py-2 text-zinc-700">{student.className}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
