import type { ExamTemplate, Question } from "./types";

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function makeChoice(text: string) {
  return { id: uid("c"), text };
}

function makeMCQuestion(params: {
  text: string;
  choices: string[];
  correctChoiceText: string;
  score: number;
  preserveOrder?: boolean;
  sectionTitle?: string;
  groupTitle?: string;
  sectionId?: string;
  groupId?: string;
}): Question {
  const section = params.sectionId || params.sectionTitle ? { id: params.sectionId ?? uid("s"), title: params.sectionTitle ?? "Хэсэг" } : undefined;
  const group = params.groupId || params.groupTitle ? { id: params.groupId ?? uid("g"), title: params.groupTitle ?? "Бүлэг" } : undefined;

  const choices = params.choices.map(makeChoice);
  const correctChoiceId = choices.find((c) => c.text === params.correctChoiceText)?.id;

  return {
    id: uid("q"),
    text: params.text,
    type: "multiple_choice",
    choices,
    correctChoiceId,
    score: params.score,
    preserveOrder: params.preserveOrder,
    section,
    group,
  };
}

function makeTFQuestion(params: {
  text: string;
  correct: boolean;
  score: number;
}): Question {
  const choices = [makeChoice("Үнэн"), makeChoice("Худал")];
  const correctChoiceId = params.correct ? choices[0].id : choices[1].id;
  return {
    id: uid("q"),
    text: params.text,
    type: "true_false",
    choices,
    correctChoiceId,
    score: params.score,
  };
}

function makeOpenQuestion(params: { text: string; type: "short_answer" | "essay"; score: number; preserveOrder?: boolean; sectionTitle?: string; groupTitle?: string }): Question {
  const section = params.sectionTitle ? { id: uid("s"), title: params.sectionTitle } : undefined;
  const group = params.groupTitle ? { id: uid("g"), title: params.groupTitle } : undefined;
  return {
    id: uid("q"),
    text: params.text,
    type: params.type,
    choices: [],
    correctChoiceId: undefined,
    score: params.score,
    preserveOrder: params.preserveOrder,
    section,
    group,
  };
}

export function mockParsedQuestions(params: { subject: string; gradeLevel: string }): { questions: Question[]; parseIssues: ExamTemplate["parseIssues"] } {
  const { subject, gradeLevel } = params;
  const section1 = { id: uid("s"), title: `${gradeLevel} · ${subject} (A хэсэг)` };
  const group1 = { id: uid("g"), title: "Тодорхойлолт ба ойлголт (2 асуулт)" };
  const group2 = { id: uid("g"), title: "Жишээ ба хэрэглээ (2 асуулт)" };

  const q1 = makeMCQuestion({
    sectionId: section1.id,
    sectionTitle: section1.title,
    groupId: group1.id,
    groupTitle: group1.title,
    text: `${subject}: Дараах өгүүлбэрийн зөв тодорхойлолтыг сонгоно уу.`,
    choices: ["Тодорхойлолт A", "Тодорхойлолт B", "Тодорхойлолт C", "Тодорхойлолт D"],
    correctChoiceText: "Тодорхойлолт A",
    score: 1,
  });

  const q2 = makeMCQuestion({
    sectionId: section1.id,
    sectionTitle: section1.title,
    groupId: group1.id,
    groupTitle: group1.title,
    text: `Суралцагчийн алдааг олж засах хамгийн зөв алхмыг сонгоно уу.`,
    choices: ["1) Тайлбар унших", "2) Дадлага хийх", "3) Жишээ харьцуулах", "4) Сонголтгүй орхих"],
    correctChoiceText: "3) Жишээ харьцуулах",
    score: 1,
  });

  const q3 = makeTFQuestion({
    text: `${subject}: Үнэн/худал асуулт — “${gradeLevel}-д хамаарах суурь ойлголтуудыг нэгтгэх хэрэгтэй” гэдэг нь зөв.`,
    correct: true,
    score: 1,
  });

  const q4 = makeOpenQuestion({
    type: "short_answer",
    text: `${subject}: Нэг өгүүлбэрээр гол санааг бичнэ үү.`,
    score: 2,
    preserveOrder: true,
    sectionTitle: section1.title,
    groupTitle: group2.title,
  });

  const q5 = makeMCQuestion({
    sectionId: section1.id,
    sectionTitle: section1.title,
    groupId: group2.id,
    groupTitle: group2.title,
    text: `${subject}: Дараах жишээнээс хамгийн зөвийг сонгоно уу.`,
    choices: ["Жишээ 1", "Жишээ 2", "Жишээ 3", "Жишээ 4"],
    correctChoiceText: "Жишээ 2",
    score: 1,
  });

  const q6 = makeOpenQuestion({
    type: "essay",
    text: `${subject}: Өөрийн тайлбараар дэлгэрүүлж бичнэ үү (ойролцоогоор 6–8 өгүүлбэр).`,
    score: 3,
  });

  const parseIssues: ExamTemplate["parseIssues"] = [
    { id: uid("i"), label: "Нэг асуулт preserveOrder тэмдэглэгдсэн (хөдөлгөхгүй).", severity: "warning", questionId: q4.id },
    { id: uid("i"), label: "PDF parsing: зарим үгсийн зай/зогсолт алдаатай байж магадгүй. Текстийг шалгана уу.", severity: "warning" },
  ];

  return { questions: [q1, q2, q3, q4, q5, q6], parseIssues };
}

