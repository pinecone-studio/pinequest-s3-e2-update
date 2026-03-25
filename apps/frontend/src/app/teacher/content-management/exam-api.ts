import type { Exam, Question, QuestionType } from "./types";
import { graphqlRequest } from "./graphql-client";

export type ApiSubject = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

const SUBJECTS_QUERY = /* GraphQL */ `
  query Subjects {
    subjects {
      id
      name
      createdAt
      updatedAt
    }
  }
`;

const CREATE_SUBJECT_MUTATION = /* GraphQL */ `
  mutation CreateSubject($name: String!) {
    createSubject(name: $name) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;

const EXAMS_QUERY = /* GraphQL */ `
  query Exams {
    exams {
      id
      subjectId
      gradeId
      teacherId
      tests
      openExercises
      date
      duration
      location
      notes
      createdAt
      updatedAt
    }
  }
`;

const EXAM_BY_ID_QUERY = /* GraphQL */ `
  query ExamById($id: String!) {
    exam(id: $id) {
      id
      subjectId
      gradeId
      teacherId
      tests
      openExercises
      date
      duration
      location
      notes
      createdAt
      updatedAt
    }
  }
`;

const CREATE_EXAM_MUTATION = /* GraphQL */ `
  mutation CreateExam(
    $subjectId: String!
    $duration: String!
    $location: String!
    $notes: String!
    $tests: [ExamClosedQuestionInput!]!
    $openExercises: [ExamOpenQuestionInput!]!
    $gradeId: String
    $teacherId: String
    $date: String
  ) {
    createExam(
      subjectId: $subjectId
      duration: $duration
      location: $location
      notes: $notes
      tests: $tests
      openExercises: $openExercises
      gradeId: $gradeId
      teacherId: $teacherId
      date: $date
    ) {
      id
      subjectId
      tests
      openExercises
      duration
      location
      notes
      createdAt
      updatedAt
    }
  }
`;

type QuestionOrderStep = { k: "t"; i: number } | { k: "o"; i: number };

type NotesMeta = {
  v: 1;
  title: string;
  subject: string;
  grade: string;
  questionOrder: QuestionOrderStep[];
};

type GqlExamRow = {
  id: string;
  subjectId: string;
  gradeId: string | null;
  teacherId: string | null;
  tests: string;
  openExercises: string;
  date: string | null;
  duration: string;
  location: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

type StoredClosed = {
  id: string;
  prompt: string;
  choices: { id: string; text: string }[];
  correctChoiceId: string;
};

type StoredOpen = {
  id: string;
  prompt: string;
};

function parseNotesMeta(raw: string): Omit<NotesMeta, "questionOrder"> & {
  questionOrder: QuestionOrderStep[] | null;
} {
  try {
    const j = JSON.parse(raw) as Partial<NotesMeta>;
    if (j && typeof j === "object" && typeof j.title === "string") {
      return {
        v: 1,
        title: j.title,
        subject: typeof j.subject === "string" ? j.subject : "—",
        grade: typeof j.grade === "string" ? j.grade : "—",
        questionOrder: Array.isArray(j.questionOrder) ? j.questionOrder : null,
      };
    }
  } catch {
    /* fallback */
  }
  return {
    v: 1,
    title: "Шалгалт",
    subject: "—",
    grade: "—",
    questionOrder: null,
  };
}

function parseDuration(s: string): number {
  const m = String(s).match(/\d+/);
  if (m) return Number.parseInt(m[0], 10);
  return 40;
}

function closedToQuestion(q: StoredClosed): Question {
  const correctText =
    q.choices.find((c) => c.id === q.correctChoiceId)?.text ?? "";
  return {
    id: q.id,
    text: q.prompt,
    type: "multiple_choice",
    options: q.choices.map((c) => c.text),
    correctAnswer: correctText,
    score: 1,
  };
}

function openToQuestion(q: StoredOpen, type: QuestionType): Question {
  return {
    id: q.id,
    text: q.prompt,
    type,
    options: [],
    correctAnswer: "",
    score: 1,
  };
}

export function mapGqlExamToUi(row: GqlExamRow): Exam {
  const meta = parseNotesMeta(row.notes);
  let tests: StoredClosed[] = [];
  let open: StoredOpen[] = [];
  try {
    tests = JSON.parse(row.tests) as StoredClosed[];
  } catch {
    tests = [];
  }
  try {
    open = JSON.parse(row.openExercises) as StoredOpen[];
  } catch {
    open = [];
  }

  const questions: Question[] = [];
  if (meta.questionOrder?.length) {
    for (const step of meta.questionOrder) {
      if (step.k === "t") {
        const q = tests[step.i];
        if (q) questions.push(closedToQuestion(q));
      } else {
        const q = open[step.i];
        if (q) questions.push(openToQuestion(q, "short_answer"));
      }
    }
  } else {
    for (const q of tests) questions.push(closedToQuestion(q));
    for (const q of open) questions.push(openToQuestion(q, "short_answer"));
  }

  return {
    id: row.id,
    title: meta.title,
    subject: meta.subject,
    grade: meta.grade,
    duration: parseDuration(row.duration),
    questions,
    createdAt: row.createdAt.slice(0, 10),
    status: "saved",
  };
}

export async function fetchExamsFromApi(): Promise<
  { ok: true; exams: Exam[] } | { ok: false; error: string }
> {
  const res = await graphqlRequest<{ exams: GqlExamRow[] }>(EXAMS_QUERY);
  if (!res.ok) return res;
  return {
    ok: true,
    exams: res.data.exams.map(mapGqlExamToUi),
  };
}

export async function fetchExamByIdFromApi(
  id: string,
): Promise<{ ok: true; exam: Exam } | { ok: false; error: string }> {
  const res = await graphqlRequest<{ exam: GqlExamRow | null }>(EXAM_BY_ID_QUERY, {
    id,
  });
  if (!res.ok) return res;
  if (!res.data.exam) {
    return { ok: false, error: "Шалгалт олдсонгүй." };
  }
  return { ok: true, exam: mapGqlExamToUi(res.data.exam) };
}

export async function fetchSubjectsFromApi(): Promise<
  { ok: true; subjects: ApiSubject[] } | { ok: false; error: string }
> {
  const res = await graphqlRequest<{ subjects: ApiSubject[] }>(SUBJECTS_QUERY);
  if (!res.ok) return res;
  return { ok: true, subjects: res.data.subjects };
}

export async function createSubjectOnApi(
  name: string,
): Promise<{ ok: true; subject: ApiSubject } | { ok: false; error: string }> {
  const trimmed = name.trim();
  if (!trimmed) {
    return { ok: false, error: "Сэдвийн нэр оруулна уу." };
  }
  const res = await graphqlRequest<{ createSubject: ApiSubject }>(CREATE_SUBJECT_MUTATION, {
    name: trimmed,
  });
  if (!res.ok) return res;
  return { ok: true, subject: res.data.createSubject };
}

/** Хуучин .env fallback — form-оос subjectId ирээгүй үед л хэрэглэнэ */
export function getExamSubjectIdFromEnv(): string | null {
  const id = process.env.NEXT_PUBLIC_EXAM_SUBJECT_ID?.trim();
  return id || null;
}

export async function createExamOnApi(payload: {
  title: string;
  subject: string;
  subjectId: string;
  grade: string;
  duration: number;
  questions: Question[];
}): Promise<{ ok: true; exam: Exam } | { ok: false; error: string }> {
  const subjectId =
    payload.subjectId.trim() || getExamSubjectIdFromEnv() || "";
  if (!subjectId) {
    return {
      ok: false,
      error:
        "Сэдэв сонгоно уу (эсвэл .env дээр NEXT_PUBLIC_EXAM_SUBJECT_ID тохируулна уу).",
    };
  }

  const tests: { prompt: string; choices: { text: string }[]; correctChoiceIndex: number }[] =
    [];
  const openExercises: { prompt: string }[] = [];
  const questionOrder: QuestionOrderStep[] = [];

  for (const q of payload.questions) {
    if (q.type === "multiple_choice") {
      const trimmed = q.options.map((o) => o.trim()).filter((o) => o.length > 0);
      if (trimmed.length === 0) continue;
      let correctIdx = trimmed.findIndex(
        (o) => o === q.correctAnswer.trim(),
      );
      if (correctIdx < 0) correctIdx = 0;
      questionOrder.push({ k: "t", i: tests.length });
      tests.push({
        prompt: q.text,
        choices: trimmed.map((text) => ({ text })),
        correctChoiceIndex: correctIdx,
      });
    } else {
      questionOrder.push({ k: "o", i: openExercises.length });
      openExercises.push({ prompt: q.text });
    }
  }

  if (tests.length === 0 && openExercises.length === 0) {
    return { ok: false, error: "Илгээх асуулт олдсонгүй." };
  }

  const notesMeta: NotesMeta = {
    v: 1,
    title: payload.title,
    subject: payload.subject,
    grade: payload.grade,
    questionOrder,
  };

  const variables = {
    subjectId,
    duration: String(payload.duration),
    location: "—",
    notes: JSON.stringify(notesMeta),
    tests,
    openExercises,
    gradeId: null,
    teacherId: null,
    date: null,
  };

  const res = await graphqlRequest<{ createExam: GqlExamRow }>(
    CREATE_EXAM_MUTATION,
    variables,
  );

  if (!res.ok) return res;
  return { ok: true, exam: mapGqlExamToUi(res.data.createExam) };
}
