"use client";

import { useRouter } from "next/navigation";
import { ChevronRight, Users } from "lucide-react";
import { useQuery } from "@apollo/client/react";
import {
  GET_CLASS_BY_TEACHER_AND_SCHOOL_ID,
  GET_STUDENT_BY_CLASS_ID,
} from "@/graphql/typeDefs/queries";
import {
  HARDCODED_SCHOOL_ID,
  HARDCODED_TEACHER_ID,
} from "@/app/teacher/_lib/hardcoded-teacher-api";

type ClassResponse = {
  getClassByTeacherAndSchoolId: ClassType[];
};

type ClassType = {
  id: string;
  sectionTeacherId: string;
  schoolId: string;
  grade: number;
  section: string;
};

type StudentResponse = {
  getStudentByClassId: { id: string }[];
};

function DashboardClassCard({
  item,
  onOpen,
}: {
  item: ClassType;
  onOpen: () => void;
}) {
  const { data: studentData } = useQuery<StudentResponse>(
    GET_STUDENT_BY_CLASS_ID,
    { variables: { classId: item.id } },
  );
  const count = studentData?.getStudentByClassId?.length ?? 0;

  return (
    <li>
      <article
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={(e) => {
          if (e.key !== "Enter" && e.key !== " ") return;
          e.preventDefault();
          onOpen();
        }}
        className="group flex min-h-[5.5rem] cursor-pointer items-center gap-4 rounded-2xl border border-white p-5 text-left shadow-sm transition hover:border-[#7DC8FF] hover:bg-[#EDF6FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7DC8FF] focus-visible:ring-offset-2"
      >
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-[#1f2a44] transition group-hover:bg-[#EDF6FF] group-hover:text-[#1f2a44]">
          <Users className="h-7 w-7" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-5 font-extrabold leading-snug text-[#1f2a44]">
            {item.grade}
            {item.section}
          </p>
          <p className="mt-1 text-4 leading-normal text-[#64748b]">
            <span className="font-medium text-[#4a5875]">{count} сурагч</span>
          </p>
        </div>
        <ChevronRight
          className="h-6 w-6 shrink-0 text-[#b8c4d6] transition group-hover:translate-x-0.5 group-hover:text-[#1f2a44]"
          aria-hidden
        />
      </article>
    </li>
  );
}

export default function TeacherDashboard() {
  const router = useRouter();

  const { data, loading } = useQuery<ClassResponse>(
    GET_CLASS_BY_TEACHER_AND_SCHOOL_ID,
    {
      variables: {
        input: {
          teacherId: HARDCODED_TEACHER_ID,
          schoolId: HARDCODED_SCHOOL_ID,
        },
      },
    },
  );

  const classes = data?.getClassByTeacherAndSchoolId ?? [];

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8">
      <section>
        <article className="rounded-2xl p-6 shadow-[0_2px_12px_rgba(31,42,68,0.06)] sm:p-8">
          <header className="mb-6 border-b border-[#eef2f6] pb-6">
            <h2 className="text-[22px] font-extrabold tracking-tight text-[#1f2a44]">
              Миний ангиуд
            </h2>
            <p className="mt-2 max-w-2xl text-4 leading-relaxed text-[#4a5875]">
              Анги дээр дарж сурагчид, шалгалтын статистик руу орно.
            </p>
            <p className="mt-3 inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-3 font-semibold text-[#1f2a44]">
              <span className="text-[#22c55e]">●</span>
              Нийт{" "}
              <span className="font-extrabold text-[#1f2a44]">
                {loading ? "…" : classes.length}
              </span>{" "}
              анги
            </p>
          </header>

          {loading ? (
            <div className="rounded-2xl border border-dashed border-white px-6 py-14 text-center">
              <p className="text-4 font-semibold text-[#475569]">
                Ачааллаж байна…
              </p>
            </div>
          ) : !classes || classes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white px-6 py-14 text-center">
              <p className="text-4 font-semibold text-[#475569]">
                Одоогоор танд харагдах анги алга.
              </p>
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              {classes.map((item: ClassType) => (
                <DashboardClassCard
                  key={item.id}
                  item={item}
                  onOpen={() =>
                    router.push(`/teacher/class/${encodeURIComponent(item.id)}`)
                  }
                />
              ))}
            </ul>
          )}
        </article>
      </section>
    </main>
  );
}
