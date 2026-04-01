/** @format */

"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Pencil } from "lucide-react";
import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client/react";
import {
  GET_CLASS_BY_SCHOOL_ID,
  GET_SCHOOL_BY_CLERK_ID,
  GET_TEACHERS_BY_SCHOOL_ID,
} from "@/graphql/typeDefs/queries";
import { AddEmployeeDialog } from "./_components/add-employee-dialog";
import { TeachersPageSkeleton } from "./_components/teachers-page-skeleton";

type ClassRow = {
  id: string;
  grade: number;
  section: string;
};

type TeacherRow = {
  id: string;
  clerkId: string | null;
  email: string;
  myClassId: string | null;
  firstName: string;
  lastName: string;
  role: string;
};

type GetTeachersResponse = {
  getTeachersBySchoolId: TeacherRow[];
};

type GetClassesResponse = {
  getClassBySchoolId: ClassRow[] | null;
};

type GetSchoolResponse = {
  getSchoolByClerkId: { id: string; name: string };
};

function formatClassLabel(grade: number, section: string) {
  const s = section.trim();
  return `${grade}${s}`;
}

function readApolloErrorMessage(err: unknown): string | null {
  if (!err) return null;
  if (err instanceof Error) return err.message;
  if (typeof err === "object" && "message" in err) {
    const m = (err as { message?: unknown }).message;
    return typeof m === "string" ? m : null;
  }
  return null;
}

export default function AdminTeachersPage() {
  const { user, isLoaded: clerkLoaded } = useUser();
  const clerkId = user?.id ?? "";
  const [search, setSearch] = useState("");

  const {
    data: schoolData,
    loading: schoolLoading,
    error: schoolError,
  } = useQuery<GetSchoolResponse>(GET_SCHOOL_BY_CLERK_ID, {
    variables: { clerkId },
    skip: !clerkLoaded || !clerkId,
    fetchPolicy: "cache-and-network",
  });

  const schoolId = schoolData?.getSchoolByClerkId?.id ?? "";

  const { data: classesData } = useQuery<GetClassesResponse>(GET_CLASS_BY_SCHOOL_ID, {
    variables: { schoolId },
    skip: !schoolId,
    fetchPolicy: "cache-and-network",
  });

  const { data, loading: teachersLoading, error, refetch } = useQuery<GetTeachersResponse>(
    GET_TEACHERS_BY_SCHOOL_ID,
    {
      variables: { schoolId },
      skip: !schoolId,
      fetchPolicy: "cache-and-network",
    },
  );

  const classLabelById = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of classesData?.getClassBySchoolId ?? []) {
      map.set(c.id, formatClassLabel(c.grade, c.section));
    }
    return map;
  }, [classesData?.getClassBySchoolId]);

  const formatNameWithInitial = (lastName: string, firstName: string) => {
    const l = lastName.trim();
    const f = firstName.trim();
    if (!l && !f) return "-";
    if (!l) return f;
    if (!f) return l;
    const lastNameInitial = l.charAt(0).toUpperCase();
    return `${lastNameInitial}.${f}`;
  };

  const teachers = data?.getTeachersBySchoolId ?? [];
  const keyword = search.trim().toLowerCase();
  const filteredTeachers =
    keyword.length === 0
      ? teachers
      : teachers.filter((t) => {
          const position = (t.role?.trim() || "Багш").toLowerCase();
          const name = `${t.lastName} ${t.firstName}`.toLowerCase();
          return name.includes(keyword) || position.includes(keyword);
        });

  const schoolErrMsg =
    readApolloErrorMessage(schoolError) ??
    (schoolData && !schoolId ? "Сургуулийн мэдээлэл олдсонгүй." : null);

  const showInitialSkeleton =
    !clerkLoaded ||
    (!!clerkId && schoolLoading && !schoolData && !schoolError) ||
    (!!schoolId && teachersLoading && !data);

  if (showInitialSkeleton && !schoolErrMsg) {
    return <TeachersPageSkeleton />;
  }

  if (schoolErrMsg || !schoolId) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-zinc-900">Хүний нөөц</h2>
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {schoolErrMsg ||
            "Таны Clerk бүртэлтэй холбогдсон сургууль олдсонгүй. Эхлэн сургуулийн бүртгэл үүсгэн, эсвэл админтай холбогдоно уу."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-semibold text-zinc-900">Хүний нөөц</h2>
        {schoolData?.getSchoolByClerkId?.name ? (
          <p className="mt-1 text-sm text-zinc-600">{schoolData.getSchoolByClerkId.name}</p>
        ) : null}
      </div>

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Ажилтнуудыг ачааллахад алдаа гарлаа. Дахин оролдоно уу.
        </p>
      ) : null}

      <section className="rounded-xl border border-zinc-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-zinc-100 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
          <h3 className="text-sm font-semibold text-zinc-900">
            Бүх ажилтан ({filteredTeachers.length})
          </h3>
          <div className="w-full lg:max-w-md lg:flex-1">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Нэр, албан тушаалаар хайх..."
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <AddEmployeeDialog schoolId={schoolId} onTeacherAdded={() => void refetch()} />
        </div>
        <div className="hidden grid-cols-[84px_minmax(200px,1fr)_minmax(180px,1fr)_130px_100px_100px_100px] items-center gap-3 border-b border-zinc-100 bg-zinc-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500 lg:grid">
          <div>№</div>
          <div>Овог нэр</div>
          <div>И-мэйл</div>
          <div>Албан тушаал</div>
          <div className="text-center">Даасан анги</div>
          <div className="text-center">Clerk</div>
          <div className="text-right">Үйлдэл</div>
        </div>

        <ul className="divide-y divide-zinc-100">
          {filteredTeachers.length === 0 ? (
            <li className="px-6 py-12 text-center text-sm text-zinc-500">
              {teachers.length === 0
                ? "Одоогоор бүртгэлтэй ажилтан алга. «Ажилтан нэмэх» товчоор нэмнэ үү."
                : "Таны хайлтад тохирох ажилтан олдсонгүй."}
            </li>
          ) : (
            filteredTeachers.map((t, index) => {
              const position = t.role?.trim() || "Багш";
              const homeroom =
                t.myClassId && classLabelById.has(t.myClassId)
                  ? classLabelById.get(t.myClassId)!
                  : t.myClassId
                    ? t.myClassId
                    : "-";
              const linked = Boolean(t.clerkId?.trim());

              return (
                <li key={t.id} className="px-4 py-4 sm:px-6">
                  <div className="grid gap-3 lg:grid-cols-[84px_minmax(200px,1fr)_minmax(180px,1fr)_130px_100px_100px_100px] lg:items-center">
                    <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
                      <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-md border border-zinc-200 bg-zinc-50 px-2">
                        {index + 1}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-zinc-900">
                        {formatNameWithInitial(t.lastName, t.firstName)}
                      </p>
                    </div>

                    <div className="min-w-0 text-sm text-zinc-600">
                      <p className="truncate">{t.email}</p>
                    </div>

                    <div className="text-sm text-zinc-700">{position}</div>

                    <div className="text-center text-sm text-zinc-700">{homeroom}</div>

                    <div className="text-center text-xs text-zinc-600">
                      {linked ? (
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-emerald-800">
                          Холбогдсон
                        </span>
                      ) : (
                        <span className="rounded-full bg-zinc-100 px-2 py-0.5 font-medium text-zinc-700">
                          Уригдсан
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 lg:justify-end">
                      <Link
                        href={`/school/teachers/${t.id}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 text-zinc-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                        title="Засах"
                        aria-label={`${t.lastName} ${t.firstName} засах`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </section>
    </div>
  );
}
