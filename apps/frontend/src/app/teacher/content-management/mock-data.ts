import type { Exam, TeacherClass } from "./types";

export const teacherClasses: TeacherClass[] = [
  { id: "c-6a", name: "6A", grade: "6-р анги", studentCount: 31 },
  { id: "c-7b", name: "7B", grade: "7-р анги", studentCount: 29 },
  { id: "c-8a", name: "8A", grade: "8-р анги", studentCount: 33 },
  { id: "c-9c", name: "9C", grade: "9-р анги", studentCount: 30 },
];

export const initialExams: Exam[] = [
  {
    id: "exam-101",
    title: "Математик — 8-р анги",
    subject: "Математик",
    grade: "8-р анги",
    duration: 40,
    createdAt: "2026-03-15",
    status: "saved",
    questions: [
      { id: "q-101-1", text: "3x + 7 = 22. x-ийн утга аль нь вэ?", type: "multiple_choice", options: ["x = 3", "x = 5", "x = 7", "x = 9"], correctAnswer: "x = 5", score: 1 },
      { id: "q-101-2", text: "2x - 4 = 10 тэгшитгэлийг бод.", type: "short_answer", options: [], correctAnswer: "7", score: 1 },
      { id: "q-101-3", text: "Арифметик дарааллын a₁=2, d=3 бол a₅ хэд вэ?", type: "multiple_choice", options: ["11", "12", "13", "14"], correctAnswer: "14", score: 1 },
      { id: "q-101-4", text: "Тэгш өнцөгт гурвалжны катетууд 6 ба 8 бол гипотенузыг ол.", type: "short_answer", options: [], correctAnswer: "10", score: 1 },
      { id: "q-101-5", text: "Функц y = 2x + 1 графикийн налалтыг сонго.", type: "multiple_choice", options: ["-2", "1", "2", "3"], correctAnswer: "2", score: 1 },
      { id: "q-101-6", text: "0.25-ийг бутархайгаар илэрхийл.", type: "short_answer", options: [], correctAnswer: "1/4", score: 1 },
      { id: "q-101-7", text: "π ≈ хэд вэ?", type: "multiple_choice", options: ["2.14", "3.14", "4.13", "3.41"], correctAnswer: "3.14", score: 1 },
      { id: "q-101-8", text: "(-3)²-ийн утгыг ол.", type: "multiple_choice", options: ["-9", "6", "9", "3"], correctAnswer: "9", score: 1 },
      { id: "q-101-9", text: "120-ийн 25%-ийг ол.", type: "short_answer", options: [], correctAnswer: "30", score: 1 },
      { id: "q-101-10", text: "9-р ангийн түвшинд шугаман тэгшитгэлийн хэрэглээг нэг жишээгээр тайлбарла.", type: "essay", options: [], correctAnswer: "", score: 2 },
      { id: "q-101-11", text: "x² - 9 = 0 тэгшитгэлийн шийдийг сонго.", type: "multiple_choice", options: ["x=3", "x=-3", "x=±3", "x=0"], correctAnswer: "x=±3", score: 1 },
      { id: "q-101-12", text: "7/8 + 1/8 хэд вэ?", type: "multiple_choice", options: ["1", "7", "8", "0"], correctAnswer: "1", score: 1 },
      { id: "q-101-13", text: "90°-ын комплементар өнцөг хэд вэ?", type: "multiple_choice", options: ["0°", "45°", "90°", "180°"], correctAnswer: "0°", score: 1 },
      { id: "q-101-14", text: "4a = 28 бол a хэд вэ?", type: "short_answer", options: [], correctAnswer: "7", score: 1 },
      { id: "q-101-15", text: "2, 4, 8, 16, ... дарааллын дараагийн гишүүн?", type: "multiple_choice", options: ["18", "20", "24", "32"], correctAnswer: "32", score: 1 },
      { id: "q-101-16", text: "Периметр нь 24, өргөн нь 5 бол уртыг ол.", type: "short_answer", options: [], correctAnswer: "7", score: 1 },
      { id: "q-101-17", text: "15 : 3 × 2 үйлдлийн зөв хариу?", type: "multiple_choice", options: ["10", "8", "6", "4"], correctAnswer: "10", score: 1 },
      { id: "q-101-18", text: "Координатын хавтгай дээр (2, -3) цэг аль квадрантад байх вэ?", type: "multiple_choice", options: ["I", "II", "III", "IV"], correctAnswer: "IV", score: 1 },
      { id: "q-101-19", text: "5x - 2 = 3x + 10 тэгшитгэлийг бод.", type: "short_answer", options: [], correctAnswer: "6", score: 1 },
      { id: "q-101-20", text: "Илэрхийлэл 3(a + 2) - 2a-г хялбарчил.", type: "short_answer", options: [], correctAnswer: "a + 6", score: 1 },
    ],
  },
  {
    id: "exam-102",
    title: "8-р анги Англи хэл - Grammar Quiz",
    subject: "Англи хэл",
    grade: "8-р анги",
    duration: 30,
    createdAt: "2026-03-18",
    status: "sent",
    questions: [
      {
        id: "q-102-1",
        text: "If I ___ time, I would help you.",
        type: "multiple_choice",
        options: ["have", "had", "has", "having"],
        correctAnswer: "had",
        score: 1,
      },
      {
        id: "q-102-2",
        text: "Present perfect tense-ийн жишээ 2 өгүүлбэр бич.",
        type: "short_answer",
        options: [],
        correctAnswer: "",
        score: 2,
      },
    ],
  },
];

export const subjects = ["Математик", "Физик", "Хими", "Англи хэл", "Монгол хэл", "Биологи"];

export const grades = ["6-р анги", "7-р анги", "8-р анги", "9-р анги", "10-р анги", "11-р анги", "12-р анги"];
