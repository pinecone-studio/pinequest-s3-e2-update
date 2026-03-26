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

/** Жишээ өмнөх шалгалтын мөр — анги бүрийн сурагчдаар тооцоолсон дүн */
export type PastExamRow = {
	id: string;
	subject: string;
	examTitle: string;
	date: string;
	avgScore: number;
	maxScore: number;
	passed: number;
	total: number;
	studentScores: PastExamStudentScore[];
};

type QuestionBlueprint = {
	prompt: string;
	maxPoints: number;
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
			sampleAnswers: [
				"1206 онд Их Монгол Улсыг зарлан нэгтгэж эхэлсэн.",
				"13-р зуун эхээр төвлөрсөн төрийг бүрэлдүүлсэн.",
				"Монголын нутаг даяар аймгуудын эвсэл эхэлсэн.",
			],
		},
		{
			prompt: "Их Юань гүрэн үүссэн гол шалтгаануудыг хоёрыг нэрлэнэ үү.",
			maxPoints: 5,
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
			sampleAnswers: [
				"x = 2 болон x = 3",
				"(x−2)(x−3)=0 тул x=2,3",
				"2, 3 гэсэн хоёр үндэстэй",
			],
		},
		{
			prompt: "f(x) = 2x + 1 функцийн f(4) болон f⁻¹(x) ол.",
			maxPoints: 25,
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
			sampleAnswers: [
				"a₅ = 3·2⁴ = 48 (ялгаварын тоо буруу ойлголттой хариулт)",
				"3,5,7,9,11 — тэгш өсөлттэй бол 11 (ашигласан томьёо буруу)",
				"48 гэж тооцоолов (жишээ хариулт)",
			],
		},
		{
			prompt: "Системийн тэгшитгэлийг шийд: { 2x + y = 7 ; x − y = 2 }.",
			maxPoints: 25,
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
			sampleAnswers: [
				"is — collective noun often takes singular in formal usage",
				"is",
				"are (in British usage sometimes)",
			],
		},
		{
			prompt: 'Rewrite in passive voice: "They built the bridge in 2010."',
			maxPoints: 5,
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
		const avgScore =
			total === 0
				? 0
				: Math.round(
						(studentScores.reduce((sum, s) => sum + s.score, 0) / total) * 10,
					) / 10;

		return {
			id: `${e.id}-${classId}`,
			subject: e.subject,
			examTitle: e.examTitle,
			date: e.date,
			avgScore,
			maxScore,
			passed,
			total,
			studentScores,
		};
	});
}
