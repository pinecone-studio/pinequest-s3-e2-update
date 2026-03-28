/** @format */

import type { Student } from "./types";

/** Нэг асуулт дээрх сурагчийн хариулт, оноо */
export type PastExamQuestionAttempt = {
	order: number;
	question: string;
	studentAnswer: string;
	pointsEarned: number;
	pointsMax: number;
};

/** Нэг сурагчийн нэг шалгалтын оноо болон асуулт бүрийн дэлгэрэнгүй */
export type PastExamStudentScore = {
	studentId: string;
	studentNumber: string;
	firstName: string;
	lastName: string;
	score: number;
	passed: boolean;
	attempts: PastExamQuestionAttempt[];
};

/** Ангийн түвшинд: хамгийн олон сурагч алдсан асуулт + загварын зөв хариулт */
export type PastExamMostFailedQuestion = {
	order: number;
	question: string;
	correctAnswer: string;
	failCount: number;
	totalStudents: number;
};

/** Асуулт бүрийн ангийн нэгтгэл (тайлангийн хувьд) */
export type PastExamQuestionAggregate = {
	order: number;
	question: string;
	correctAnswer: string;
	pointsMax: number;
	/** Бүрэн оноо авсан сурагчийн тоо */
	fullCreditCount: number;
	/** Хэсэгчилсэн оноо (0 болон дээд онооны хооронд) */
	partialCreditCount: number;
	/** Тэг оноо */
	zeroCount: number;
	/** Бүрэн оноо аваагүй (эргэлзээтэй эсвэл буруу) */
	failedCount: number;
	totalStudents: number;
};

/** Жишээ өмнөх шалгалтын мөр — анги бүрийн сурагчдаар тооцоолсон дүн */
export type PastExamRow = {
	id: string;
	/** EXAM_BLUEPRINTS түлхүүр (жишээ нь pe-1) — тайлан гаргахад */
	blueprintId: string;
	subject: string;
	examTitle: string;
	date: string;
	maxScore: number;
	passed: number;
	total: number;
	studentScores: PastExamStudentScore[];
	/** Сурагчдын хамгийн ихээр алдсан нэг асуулт (бүх сурагч бүрэн оноо авсан бол null) */
	mostFailedQuestion: PastExamMostFailedQuestion | null;
};

type QuestionBlueprint = {
	prompt: string;
	maxPoints: number;
	/** Загварын зөв хариулт (багш сурагчд харуулахад) */
	correctAnswer: string;
	/** Жишээ хариултууд — сурагч тус бүр ID-гаасаа хамааран сонгогдоно */
	sampleAnswers: string[];
};

const PASS_FRACTION = 0.5;

function scoreHash(studentId: string, examSeed: string): number {
	let h = 2166136261;
	const s = `${examSeed}\0${studentId}`;
	for (let i = 0; i < s.length; i++) {
		h ^= s.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}

function mixHash(base: number, salt: number): number {
	return Math.imul(base ^ salt, 2246822519) >>> 0;
}

function buildAttemptsForStudent(
	blueprints: QuestionBlueprint[],
	studentId: string,
	examSeed: string,
): PastExamQuestionAttempt[] {
	return blueprints.map((b, i) => {
		const h = mixHash(scoreHash(studentId, examSeed), i * 7919 + 13);
		const quality = (h % 10_000) / 10_000;
		let earned = Math.round(quality * b.maxPoints);
		if ((h >> 3) % 5 === 0) earned = b.maxPoints;
		else if ((h >> 5) % 4 === 0) earned = Math.max(0, earned - 1);
		earned = Math.min(b.maxPoints, Math.max(0, earned));
		const ans = b.sampleAnswers[h % b.sampleAnswers.length];
		return {
			order: i + 1,
			question: b.prompt,
			studentAnswer: ans,
			pointsEarned: earned,
			pointsMax: b.maxPoints,
		};
	});
}

function computeMostFailedQuestion(
	blueprints: QuestionBlueprint[],
	studentScores: PastExamStudentScore[],
): PastExamMostFailedQuestion | null {
	const totalStudents = studentScores.length;
	if (totalStudents === 0) return null;

	let best: PastExamMostFailedQuestion | null = null;

	for (let i = 0; i < blueprints.length; i++) {
		const order = i + 1;
		let failCount = 0;
		for (const s of studentScores) {
			const a = s.attempts.find((x) => x.order === order);
			if (a && a.pointsEarned < a.pointsMax) failCount++;
		}
		const candidate: PastExamMostFailedQuestion = {
			order,
			question: blueprints[i].prompt,
			correctAnswer: blueprints[i].correctAnswer,
			failCount,
			totalStudents,
		};
		if (!best || failCount > best.failCount) best = candidate;
	}

	if (!best || best.failCount === 0) return null;
	return best;
}

/** Асуулт бүрийн ангийн статистик */
export function getPastExamQuestionAggregates(
	row: PastExamRow,
): PastExamQuestionAggregate[] {
	const blueprints = EXAM_BLUEPRINTS[row.blueprintId];
	if (!blueprints) return [];

	const totalStudents = row.studentScores.length;
	return blueprints.map((b, i) => {
		const order = i + 1;
		let fullCreditCount = 0;
		let partialCreditCount = 0;
		let zeroCount = 0;
		let failedCount = 0;

		for (const s of row.studentScores) {
			const a = s.attempts.find((x) => x.order === order);
			if (!a) continue;
			if (a.pointsEarned >= a.pointsMax) fullCreditCount++;
			else {
				failedCount++;
				if (a.pointsEarned <= 0) zeroCount++;
				else partialCreditCount++;
			}
		}

		return {
			order,
			question: b.prompt,
			correctAnswer: b.correctAnswer,
			pointsMax: b.maxPoints,
			fullCreditCount,
			partialCreditCount,
			zeroCount,
			failedCount,
			totalStudents,
		};
	});
}

function escapeHtmlCell(s: string): string {
	return s
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

/**
 * Excel-д нээх HTML хүснэгт — шалгалтын бүрэн ангийн статистик.
 */
export function buildPastExamFullStatisticsExportHtml(
	className: string,
	row: PastExamRow,
): string {
	const aggregates = getPastExamQuestionAggregates(row);
	const sortedByFail = [...aggregates].sort(
		(a, b) => b.failedCount - a.failedCount || b.order - a.order,
	);
	const total = row.total;
	const passed = row.passed;
	const failedStudents = total - passed;
	const passPct = total > 0 ? Math.round((passed / total) * 100) : 0;

	const most = row.mostFailedQuestion;

	const summaryRows = `
      <tr><th colspan="2">Шалгалтын бүрэн статистик — ${escapeHtmlCell(className)}</th></tr>
      <tr><td>Огноо</td><td>${escapeHtmlCell(row.date)}</td></tr>
      <tr><td>Хичээл</td><td>${escapeHtmlCell(row.subject)}</td></tr>
      <tr><td>Шалгалт</td><td>${escapeHtmlCell(row.examTitle)}</td></tr>
      <tr><td>Нийт сурагч</td><td>${total}</td></tr>
      <tr><td>Тэнцсэн</td><td>${passed} (${passPct}%)</td></tr>
      <tr><td>Тэнцээгүй</td><td>${failedStudents}</td></tr>
      <tr><td>Дээд оноо (шалгалт)</td><td>${row.maxScore}</td></tr>
      ${
				most
					? `<tr><td>Хамгийн олон алдсан асуулт</td><td>№${most.order} — ${most.failCount}/${most.totalStudents} сурагч</td></tr>`
					: ""
			}`;

	const questionHeader = `
    <table border="1" style="margin-top:16px">
      <tr><th colspan="8">Асуулт бүрийн статистик</th></tr>
      <tr>
        <th>№</th>
        <th>Асуулт</th>
        <th>Дээд оноо</th>
        <th>Бүрэн оноо</th>
        <th>Хэсэгчилсэн</th>
        <th>Тэг оноо</th>
        <th>Бүрэн биш (нийт)</th>
        <th>Зөв хариулт (загвар)</th>
      </tr>`;

	const questionBody = sortedByFail
		.map(
			(q) =>
				`<tr>
        <td>${q.order}</td>
        <td>${escapeHtmlCell(q.question)}</td>
        <td>${q.pointsMax}</td>
        <td>${q.fullCreditCount}</td>
        <td>${q.partialCreditCount}</td>
        <td>${q.zeroCount}</td>
        <td>${q.failedCount}</td>
        <td>${escapeHtmlCell(q.correctAnswer)}</td>
      </tr>`,
		)
		.join("");

	const studentRows = sortPastExamStudentsForExport(row.studentScores)
		.map(
			(s, idx) =>
				`<tr><td>${idx + 1}</td><td>${escapeHtmlCell(`${s.lastName} ${s.firstName}`)}</td><td>${escapeHtmlCell(s.studentNumber)}</td><td>${s.score} / ${row.maxScore}</td><td>${s.passed ? "Тийм" : "Үгүй"}</td></tr>`,
		)
		.join("");

	const studentTable = `
    <table border="1" style="margin-top:16px">
      <tr><th colspan="5">Сурагч бүрийн оноо</th></tr>
      <tr><th>№</th><th>Овог нэр</th><th>Код</th><th>Оноо</th><th>Тэнцсэн</th></tr>
      ${studentRows}
    </table>`;

	return `
    <table border="1">${summaryRows}
    </table>
    ${questionHeader}
      ${questionBody}
    </table>
    ${studentTable}`;
}

function sortPastExamStudentsForExport(
	scores: PastExamStudentScore[],
): PastExamStudentScore[] {
	return [...scores].sort(
		(a, b) =>
			a.lastName.localeCompare(b.lastName, "mn", { sensitivity: "base" }) ||
			a.firstName.localeCompare(b.firstName, "mn", { sensitivity: "base" }),
	);
}

function buildStudentScores(
	roster: Student[],
	examSeed: string,
	blueprints: QuestionBlueprint[],
	maxScore: number,
): PastExamStudentScore[] {
	const passLine = Math.max(1, Math.ceil(maxScore * PASS_FRACTION));
	return roster.map((st) => {
		const attempts = buildAttemptsForStudent(blueprints, st.id, examSeed);
		const score = attempts.reduce((s, a) => s + a.pointsEarned, 0);
		return {
			studentId: st.id,
			studentNumber: st.studentNumber,
			firstName: st.firstName,
			lastName: st.lastName,
			score,
			passed: score >= passLine,
			attempts,
		};
	});
}

const EXAM_BLUEPRINTS: Record<string, QuestionBlueprint[]> = {
	"pe-1": [
		{
			prompt:
				"Монгол Улсын одоогийн Үндсэн хууль анх хэзээ, ямар албан ёсны нэртэйгээр батлагдсан бэ? Богино тайлбарласан хариулт бичнэ үү.",
			maxPoints: 5,
			correctAnswer:
				"1992 оны 1 сарын 13-нд Монгол Улсын Үндсэн хууль нэртэйгээр батлагдсан.",
			sampleAnswers: [
				"1992 оны 1 сарын 13-нд Монгол Улсын Үндсэн хууль нэртэйгээр батлагдсан.",
				"1992 онд Улсын Их Хурлын чуулганаар батлагдсан одоогийн Үндсэн хууль.",
				"Монгол Улсын Үндсэн хууль 1992 онд шинэчлэгдэн батлагдсан гэж бичсэн.",
			],
		},
		{
			prompt:
				"Иргэний үндсэн эрх, чөлөөтэй байх эрхээс доорхоос аль нь илүү тодорхой нийцэх вэ? Сонголтоо нэг өгүүлбэрээр тайлбарлана уу: санал өгөх эрх, хөдөлмөрлөх эрх, боловсол авах эрх.",
			maxPoints: 5,
			correctAnswer:
				"Санал өгөх эрх нь ардчилсан оронд иргэний үндсэн оролцоог илэрхийлнэ.",
			sampleAnswers: [
				"Санал өгөх эрх нь ардчилсан оронд иргэний үндсэн оролцоог илэрхийлнэ.",
				"Хөдөлмөрлөх эрх нь амьжиргаагаа бүрдүүлэх үндсэн нөхцөл.",
				"Боловсол авах эрх нь хувь хүний хөгжлийн суурь гэж үзэв.",
			],
		},
		{
			prompt:
				"Улсын Их Хурал ямар төрлийн төрөлхийн бүрэн эрхтэй байдаг вэ? Зургаас доогуур үгээр товч хариул.",
			maxPoints: 5,
			correctAnswer:
				"Хууль тогтоох, засаг захиргааны дээд хяналтын бүрэн эрхтэй.",
			sampleAnswers: [
				"Хууль тогтоох, засаг захиргааны дээд хяналтын бүрэн эрхтэй.",
				"Засгийн газраас гадуур хууль батлах дээд байгууллага.",
				"Улсын хэмжээний хууль гаргах эрх нь УИХ-д төвлөрнө.",
			],
		},
		{
			prompt:
				"Үндсэн хуулийг нэмэлт, өөрчлөлт оруулахад ямар байгууллага ямар олонх шаарддаг вэ? (Нэг жишээ хангалттай.)",
			maxPoints: 5,
			correctAnswer:
				"Улсын Их Хурал Улсын Их Хурлын гишүүдийн олонхын 2/3-ын саналаар нэмэлт, өөрчлөлт оруулдаг.",
			sampleAnswers: [
				"УИХ-ын гишүүдийн олонх санал нийлснээр нэмэлт оруулж болно гэж тэмдэглэв.",
				"Улсын Их Хурал 2/3-ын олонхоор баталдаг гэж ойлгосон.",
				"Засаг захиргааны дээд түвшинд санал хурааж баталдаг.",
			],
		},
	],
	"pe-2": [
		{
			prompt:
				"Улирлын дүн гэж юу вэ? Нийгмийн ухааны хичээлд хэрхэн хэрэглэгддэгийг тайлбарлана уу.",
			maxPoints: 6,
			correctAnswer:
				"Тодорхой хугацааны дүн шинжилгээг нэгтгэсэн үнэлгээ; хичээлд улирлын эцсийн үнэлгээг тодорхойлоход ашиглана.",
			sampleAnswers: [
				"Тодорхой хугацааны дүн шинжилгээг нэгтгэсэн үнэлгээ.",
				"Улирлын эцсийн шалгалт болон даалгавруудын нийлбэр дүн.",
				"Суралцах үйл явцын үнэлгээг хураангуйлсан үзүүлэлт.",
			],
		},
		{
			prompt:
				'"Иргэнийн нийгэм" ойлголтыг өөрийн үгээр тодорхойлоод, нэг жишээ нэмнэ үү.',
			maxPoints: 7,
			correctAnswer:
				"Хууль ёс, соёлын дүрэм журамд тулгуурласан хамтын амьдрал — жишээ нь сонгууль.",
			sampleAnswers: [
				"Хууль ёс, соёлын дүрэм журамд тулгуурласан хамтын амьдрал — жишээ нь сонгууль.",
				"Олон хүний харилцааг зохицуулсан зохион байгуулалт.",
				"Төр, иргэн хоёрын хоорондын эрх зүйн харилцаа бүхий орчин.",
			],
		},
		{
			prompt:
				"Ардчиллын гурван гол суурь зарчмыг жагсааж, нэгийг нь тайлбарлана уу.",
			maxPoints: 7,
			correctAnswer:
				"Тэгш эрх, олонхын засаглал, хуулийн дээдсэн — олонх нь шийдвэр гаргана.",
			sampleAnswers: [
				"Тэгш эрх, олонхын засаглал, хуулийн дээдсэн — олонх нь шийдвэр гаргана.",
				"Эрх чөлөө, сонгууль, хяналт — сонгуулиар удирдлага солигдоно.",
				"Ил тод байдал, иргэний оролцоо, хариуцлага.",
			],
		},
	],
	"pe-3": [
		{
			prompt:
				"Чингис хаан эх нутагтаа ямар нэгдлийг эрт нэгтгэж эхэлсэн бэ? Он цагтай нь бич.",
			maxPoints: 5,
			correctAnswer: "1206 онд Их Монгол Улсыг зарлан нэгтгэж эхэлсэн.",
			sampleAnswers: [
				"1206 онд Их Монгол Улсыг зарлан нэгтгэж эхэлсэн.",
				"13-р зуун эхээр төвлөрсөн төрийг бүрэлдүүлсэн.",
				"Монголын нутаг даяар аймгуудын эвсэл эхэлсэн.",
			],
		},
		{
			prompt: "Их Юань гүрэн үүссэн гол шалтгаануудыг хоёрыг нэрлэнэ үү.",
			maxPoints: 5,
			correctAnswer:
				"Өргөжин дэлгэрсэн цэргийн аян, Хубилай хааны зүүн зүгт төвлөрсөн төр.",
			sampleAnswers: [
				"Өргөжин дэлгэрсэн цэргийн аян, Хубилай хааны зүүн зүгт төвлөрсөн төр.",
				"Өмнөдийн Сүн улсыг эзэлж, орон нутгийшүүлсэн захиргаа.",
				"Торгоны замын худалдаа, төвийн засаглал бэхжсэн.",
			],
		},
		{
			prompt:
				'Өвөг Монголын түүхэн дээрх "Засаг захиргааны нэгж"-ийн жишээ нэгийг тайлбартай бич.',
			maxPoints: 5,
			correctAnswer:
				"Аймгууд нутгийн нэгж болж, түшмэдээр захируулагддаг байв.",
			sampleAnswers: [
				"Аймгууд нутгийн нэгж болж, түшмэдээр захируулагддаг байв.",
				"Түмэн — цэргийн болон засаг захиргааны томлол.",
				"Хаад ноёдын дагуу муж, вангуудын захиргаа.",
			],
		},
	],
	"pe-4": [
		{
			prompt: "Квадрат тэгшитгэл x² − 5x + 6 = 0-ийн үндэсүүдийг ол.",
			maxPoints: 25,
			correctAnswer: "x = 2 болон x = 3 (эсвэл x₁ = 2, x₂ = 3).",
			sampleAnswers: [
				"x = 2 болон x = 3",
				"(x−2)(x−3)=0 тул x=2,3",
				"2, 3 гэсэн хоёр үндэстэй",
			],
		},
		{
			prompt: "f(x) = 2x + 1 функцийн f(4) болон f⁻¹(x) ол.",
			maxPoints: 25,
			correctAnswer: "f(4) = 9; f⁻¹(x) = (x − 1) / 2.",
			sampleAnswers: [
				"f(4)=9, f⁻¹(x)=(x−1)/2",
				"f(4) = 2·4+1 = 9; урвуу функц нь (x-1)/2",
				"f(4)=9; x=(y-1)/2",
			],
		},
		{
			prompt:
				"Геометрийн мөрөнгийн эхний гишүүн 3, ялгавар 2 бол 5 дахь гишүүнийг ол.",
			maxPoints: 25,
			correctAnswer: "a₅ = 3 · 2⁴ = 48.",
			sampleAnswers: [
				"a₅ = 3·2⁴ = 48 (ялгаварын тоо буруу ойлголттой хариулт)",
				"3,5,7,9,11 — тэгш өсөлттэй бол 11 (ашигласан томьёо буруу)",
				"48 гэж тооцоолов (жишээ хариулт)",
			],
		},
		{
			prompt: "Системийн тэгшитгэлийг шийд: { 2x + y = 7 ; x − y = 2 }.",
			maxPoints: 25,
			correctAnswer: "x = 3, y = 1.",
			sampleAnswers: [
				"x = 3, y = 1",
				"Нэмэхэд 3x=9, x=3, y=1",
				"x=3, y=1 гэж баталгаажуулсан",
			],
		},
	],
	"pe-5": [
		{
			prompt:
				"Choose the correct word: The committee ___ (is / are) meeting tomorrow.",
			maxPoints: 5,
			correctAnswer: "is (албан ёсны хэрэглээнд ихэвчлэн ганц тооны холбох үг).",
			sampleAnswers: [
				"is — collective noun often takes singular in formal usage",
				"is",
				"are (in British usage sometimes)",
			],
		},
		{
			prompt: 'Rewrite in passive voice: "They built the bridge in 2010."',
			maxPoints: 5,
			correctAnswer: "The bridge was built in 2010.",
			sampleAnswers: [
				"The bridge was built in 2010.",
				"In 2010 the bridge was built by them.",
				"The bridge had been built in 2010.",
			],
		},
		{
			prompt:
				'What is the difference between "affect" and "effect"? One example each.',
			maxPoints: 5,
			correctAnswer:
				"Affect – ихэвчлэн үйл үг (нөлөөлөх); effect – ихэвчлэн нэр үг (үр дүн).",
			sampleAnswers: [
				"Affect is usually a verb (influence); effect is often a noun (result).",
				"Effect = consequence; affect = to influence.",
				"Rain affected the game; the effect was a delay.",
			],
		},
		{
			prompt:
				'Read: "She hardly had any time." Does it mean she had almost no time or plenty of time? Explain.',
			maxPoints: 5,
			correctAnswer:
				"Almost no time — \"hardly\" нь хэмжээг үгүйсгэн илэрхийлнэ.",
			sampleAnswers: [
				'Almost no time — "hardly" negates the amount.',
				"Very little time.",
				"She was busy; hardly means scarcely.",
			],
		},
		{
			prompt:
				"Summarize in one sentence: Why is context important in vocabulary learning?",
			maxPoints: 5,
			correctAnswer:
				"Context shows how words are used and clarifies meaning.",
			sampleAnswers: [
				"Context shows how words are used and clarifies meaning.",
				"It disambiguates polysemous words.",
				"Words gain precise sense from surrounding text.",
			],
		},
	],
};

const BASE_EXAMS: Array<{
	id: string;
	subject: string;
	examTitle: string;
	date: string;
}> = [
	{
		id: "pe-1",
		subject: "Нийгмийн ухаан",
		examTitle: "Шалгалт #1 — Үндсэн хууль",
		date: "2026-03-20",
	},
	{
		id: "pe-2",
		subject: "Нийгмийн ухаан",
		examTitle: "Улирлын дүн — 2-р улирал",
		date: "2026-02-08",
	},
	{
		id: "pe-3",
		subject: "Түүх",
		examTitle: "Богино шалгалт",
		date: "2026-01-15",
	},
	{
		id: "pe-4",
		subject: "Математик",
		examTitle: "Алгебрын шалгалт",
		date: "2025-12-20",
	},
	{
		id: "pe-5",
		subject: "Англи хэл",
		examTitle: "Vocabulary & reading",
		date: "2025-11-28",
	},
];

function sumMaxPoints(blueprints: QuestionBlueprint[]): number {
	return blueprints.reduce((s, b) => s + b.maxPoints, 0);
}

export function getPastExamsForClass(
	classId: string,
	roster: Student[],
): PastExamRow[] {
	return BASE_EXAMS.map((e) => {
		const blueprints = EXAM_BLUEPRINTS[e.id];
		if (!blueprints) {
			throw new Error(`Missing blueprint for ${e.id}`);
		}
		const maxScore = sumMaxPoints(blueprints);
		const examSeed = `${e.id}-${classId}`;
		const studentScores = buildStudentScores(
			roster,
			examSeed,
			blueprints,
			maxScore,
		);
		const total = studentScores.length;
		const passed = studentScores.filter((s) => s.passed).length;

		const mostFailedQuestion = computeMostFailedQuestion(
			blueprints,
			studentScores,
		);

		return {
			id: `${e.id}-${classId}`,
			blueprintId: e.id,
			subject: e.subject,
			examTitle: e.examTitle,
			date: e.date,
			maxScore,
			passed,
			total,
			studentScores,
			mostFailedQuestion,
		};
	});
}
