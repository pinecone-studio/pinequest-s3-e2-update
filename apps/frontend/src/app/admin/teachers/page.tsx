/** @format */

import Link from "next/link";
import {
	createTeacher,
	removeTeacher,
	updateTeacher,
} from "@/app/admin/action";
import { store } from "@/app/lib/store";

const inputClass =
	"mt-1 w-full min-w-0 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm";

const labelClass = "block min-w-0 text-xs font-medium text-zinc-600";

export default function AdminTeachersPage() {
	const teachers = store.listTeachers();

	return (
		<div className="space-y-10">
			<div>
				<h2 className="text-2xl font-semibold text-zinc-900">Багш нар</h2>
				<p className="mt-1 text-sm text-zinc-600">
					Багш нэмэх, засах, хасах. Мэргэжил, заадаг хичээлийг (жишээ нь:
					Нийгэм, Математик) заавал биш ч жагсаалтад харагдана. Хасагдсан багш
					бүх ангийн хуваарилалтас автоматаар авна.
				</p>
			</div>

			<section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
				<h3 className="text-sm font-semibold text-zinc-900">Багш нэмэх</h3>
				<form
					action={createTeacher}
					className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:items-end"
				>
					<label className={labelClass}>
						Нэр
						<input
							name="name"
							required
							placeholder="Бүтэн нэр"
							className={inputClass}
						/>
					</label>
					<label className={labelClass}>
						Цахим шуудан (сонголттой)
						<input
							name="email"
							type="email"
							placeholder="ner@sur.mn"
							className={inputClass}
						/>
					</label>
					<label className={`${labelClass} sm:col-span-2 xl:col-span-1`}>
						Мэргэжил / хичээл
						<input
							name="specialty"
							placeholder="жишээ: Нийгэм, Математик"
							className={inputClass}
						/>
					</label>
					<div className="flex items-end xl:col-span-1">
						<button
							type="submit"
							className="w-full rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 sm:w-auto"
						>
							Нэмэх
						</button>
					</div>
				</form>
			</section>

			<section className="rounded-xl border border-zinc-200 bg-white shadow-sm">
				<div className="border-b border-zinc-100 px-6 py-4">
					<h3 className="text-sm font-semibold text-zinc-900">
						Бүх багш ({teachers.length})
					</h3>
				</div>
				<ul className="divide-y divide-zinc-100">
					{teachers.map((t) => (
						<li key={t.id} className="px-6 py-6">
							<div className="mb-5 border-b border-zinc-100 pb-4">
								<Link
									href={`/admin/teachers/${t.id}`}
									className="inline-flex flex-wrap items-center gap-x-2 text-sm font-medium text-teal-600 hover:text-teal-700"
								>
									<span>Орох ангиуд харах</span>
									<span aria-hidden>→</span>
									<span className="font-normal text-zinc-500">
										({store.getClassesForTeacher(t.id).length} анги)
									</span>
								</Link>
							</div>

							<div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
								<form
									action={updateTeacher}
									className="min-w-0 flex-1 space-y-4"
								>
									<input type="hidden" name="id" value={t.id} />
									<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
										<label className={labelClass}>
											Нэр
											<input
												name="name"
												defaultValue={t.name}
												className={inputClass}
											/>
										</label>
										<label className={labelClass}>
											Цахим шуудан
											<input
												name="email"
												type="email"
												defaultValue={t.email}
												className={inputClass}
											/>
										</label>
										<label
											className={`${labelClass} md:col-span-2 lg:col-span-1`}
										>
											Мэргэжил / хичээл
											<input
												name="specialty"
												defaultValue={t.specialty ?? ""}
												placeholder="Нийгэм, Математик…"
												className={inputClass}
											/>
										</label>
									</div>
									<div className="flex flex-wrap items-center gap-4 border-t border-zinc-100 pt-4">
										<button
											type="submit"
											className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
										>
											Өөрчлөлт хадгалах
										</button>
									</div>
								</form>

								<form
									action={removeTeacher}
									className="shrink-0 border-t border-zinc-100 pt-4 lg:border-t-0 lg:border-l lg:pl-6 lg:pt-0"
								>
									<input type="hidden" name="id" value={t.id} />
									<button
										type="submit"
										className="w-full rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 lg:w-auto"
									>
										Хасах
									</button>
								</form>
							</div>
						</li>
					))}
				</ul>
			</section>
		</div>
	);
}
