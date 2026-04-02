/** @format */

"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@apollo/client/react";
import { ChevronRight, Users } from "lucide-react";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
	GET_CLASS_BY_SCHOOL_ID,
	GET_SCHOOL_BY_CLERK_ID,
	GET_STUDENT_BY_CLASS_ID,
	GET_TEACHERS_BY_SCHOOL_ID,
} from "@/graphql/typeDefs/queries";
import { AddClassDialog } from "./add-class-dialog";
import { ClassesPageSkeleton } from "./classes-page-skeleton";

type ClassRow = {
	id: string;
	schoolId: string;
	grade: number;
	section: string;
	sectionTeacherId: string;
	createdAt: string;
	updatedAt: string;
};

type TeacherRow = {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
};

type GetSchoolResponse = {
	getSchoolByClerkId: { id: string; name: string } | null;
};

type GetClassesResponse = {
	getClassBySchoolId: ClassRow[] | null;
};

type GetTeachersResponse = {
	getTeachersBySchoolId: TeacherRow[];
};

type StudentsByClassResponse = {
	getStudentByClassId: unknown[];
};

function formatClassDisplayName(grade: number, section: string) {
	return `${grade}${section.trim().toUpperCase()}`;
}

function homeroomLabel(
	sectionTeacherId: string,
	teacherById: Map<string, TeacherRow>,
): string {
	const t = teacherById.get(sectionTeacherId);
	if (!t) return "Багш оноогоогүй";
	const l = t.lastName.trim();
	const f = t.firstName.trim();
	if (!l && !f) return "Багш оноогоогүй";
	if (!l) return f;
	if (!f) return l;
	return `${l.charAt(0).toUpperCase()}.${f}`;
}

function ClassGroupCard({
	classRow,
	homeroom,
}: {
	classRow: ClassRow;
	homeroom: string;
}) {
	const { data } = useQuery<StudentsByClassResponse>(GET_STUDENT_BY_CLASS_ID, {
		variables: { classId: classRow.id },
		fetchPolicy: "cache-and-network",
	});
	const studentCount = data?.getStudentByClassId?.length ?? 0;
	const name = formatClassDisplayName(classRow.grade, classRow.section);

	return (
		<Link
			href={`/school/classes/${classRow.id}`}
			className="group rounded-xl border border-[#d7e2f0] bg-white p-3 shadow-sm transition hover:border-blue-200 hover:bg-blue-50/30"
		>
			<div className="flex items-center justify-between gap-2">
				<p className="text-lg font-bold text-[#22304d]">{name}</p>
				<span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[#e2e8f0] bg-white transition group-hover:border-[#cfd8e3] group-hover:bg-[#f8fafc]">
					<ChevronRight className="h-4 w-4 text-[#a8b3c5] transition group-hover:text-[#6f809a]" />
				</span>
			</div>
			<p className="mt-1 text-sm text-[#4d5d7a]">{studentCount} сурагч</p>
			<p className="mt-1 text-sm text-zinc-600">Анги даасан: {homeroom}</p>
		</Link>
	);
}

export function ClassesPageClient() {
	const searchParams = useSearchParams();
	const { user, isLoaded: clerkLoaded } = useUser();
	const clerkId = user?.id ?? "";

	const rawGrade = searchParams.get("grade");
	const parsedGrade = rawGrade ? Number(rawGrade) : Number.NaN;
	const selectedGrade =
		Number.isNaN(parsedGrade) || parsedGrade < 6 || parsedGrade > 12
			? 10
			: parsedGrade;

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

	const { data: classesData, loading: classesLoading } = useQuery<GetClassesResponse>(
		GET_CLASS_BY_SCHOOL_ID,
		{
			variables: { schoolId },
			skip: !schoolId,
			fetchPolicy: "cache-and-network",
		},
	);

	const { data: teachersData, loading: teachersLoading } = useQuery<GetTeachersResponse>(
		GET_TEACHERS_BY_SCHOOL_ID,
		{
			variables: { schoolId },
			skip: !schoolId,
			fetchPolicy: "cache-and-network",
		},
	);

	const allClasses = classesData?.getClassBySchoolId ?? [];

	const teacherById = useMemo(() => {
		const map = new Map<string, TeacherRow>();
		for (const t of teachersData?.getTeachersBySchoolId ?? []) {
			map.set(t.id, t);
		}
		return map;
	}, [teachersData?.getTeachersBySchoolId]);

	const grades = [6, 7, 8, 9, 10, 11, 12];
	const countByGrade = useMemo(() => {
		const m = new Map<number, number>();
		for (const g of grades) m.set(g, 0);
		for (const c of allClasses) {
			const n = m.get(c.grade) ?? 0;
			m.set(c.grade, n + 1);
		}
		return m;
	}, [allClasses]);

	const grouped = grades.map((grade) => ({
		grade,
		count: countByGrade.get(grade) ?? 0,
	}));

	const selectedClasses = useMemo(
		() => allClasses.filter((c) => c.grade === selectedGrade),
		[allClasses, selectedGrade],
	);

	const pageLoading =
		!clerkLoaded ||
		(schoolLoading && !schoolData) ||
		(!!schoolId && classesLoading && !classesData) ||
		(!!schoolId && teachersLoading && !teachersData);

	const schoolErrMsg =
		schoolError?.message ??
		(schoolData && !schoolId ? "Сургуулийн мэдээлэл олдсонгүй." : null);

	if (pageLoading) {
		return <ClassesPageSkeleton />;
	}

	if (schoolErrMsg || !schoolId) {
		return (
			<div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
				{schoolErrMsg ?? "Сургуулиа ачаалж чадсангүй. Дахин оролдоно уу."}
			</div>
		);
	}

	return (
		<div className="space-y-10">
			<div className="flex items-start justify-between gap-3">
				<div>
					<h2 className="text-2xl font-semibold text-zinc-900">Ангиуд</h2>
				</div>
				<AddClassDialog schoolId={schoolId} />
			</div>

			<section>
				<div className="grid gap-2 py-4 sm:grid-cols-2 lg:grid-cols-7">
					{grouped.map((g) => (
						<Link
							key={g.grade}
							href={`/school/classes?grade=${g.grade}`}
							className={`rounded-lg border px-3 py-2 transition ${
								selectedGrade === g.grade
									? "border-blue-200 bg-blue-50"
									: "border-zinc-200 bg-white hover:border-blue-200 hover:bg-blue-50"
							}`}
						>
							<div className="flex items-center justify-between gap-2">
								<div className="flex items-center gap-2">
									<Users className="h-3.5 w-3.5 text-[#4f9dff]" />
									<p className="text-[15px] font-semibold text-zinc-900">
										{g.grade}-р анги
									</p>
								</div>
								<span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-[#e2e8f0] bg-white">
									<ChevronRight className="h-3.5 w-3.5 text-[#a8b3c5]" />
								</span>
							</div>
							<p className="mt-0.5 text-sm text-zinc-500">
								{g.count} бүлэг
							</p>
						</Link>
					))}
				</div>
			</section>

			<section className="space-y-4">
				<div className="flex items-center">
					<h3 className="text-lg font-semibold text-zinc-900">
						{selectedGrade}-р ангийн бүлгүүд
					</h3>
				</div>

				{selectedClasses.length === 0 ? (
					<div className="rounded-xl border border-dashed border-zinc-300 bg-white px-6 py-8 text-center text-zinc-500">
						Энэ ангид ({selectedGrade}) D1-д бүртгэгдсэн бүлэг алга байна.
					</div>
				) : (
					<div className="grid gap-3 lg:grid-cols-6">
						{selectedClasses.map((c) => (
							<ClassGroupCard
								key={c.id}
								classRow={c}
								homeroom={homeroomLabel(c.sectionTeacherId, teacherById)}
							/>
						))}
					</div>
				)}
			</section>
		</div>
	);
}
