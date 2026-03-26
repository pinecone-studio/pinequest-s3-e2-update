import type { ExamData, OptionId } from "./types";

type QuestionSeed = {
  text: string;
  options: [string, string, string, string];
  correctAnswer: OptionId;
};

const seeds: QuestionSeed[] = [
  { text: "3x + 7 = 22. X-ийн утга аль нь вэ?", options: ["x = 3", "x = 5", "x = 7", "x = 9"], correctAnswer: "B" },
  { text: "0.25-тэй тэнцүү бутархай аль нь вэ?", options: ["1/2", "1/4", "1/5", "2/5"], correctAnswer: "B" },
  { text: "2⁵-ийн утга хэд вэ?", options: ["16", "24", "32", "64"], correctAnswer: "C" },
  { text: "Тойргийн талбайг олох томьёо аль нь вэ?", options: ["2πr", "πd", "πr²", "2πr²"], correctAnswer: "C" },
  { text: "√144 хэдтэй тэнцүү вэ?", options: ["10", "12", "14", "16"], correctAnswer: "B" },
  { text: "7(2x - 1) = 35 үед x-ийн утгыг ол.", options: ["x = 3", "x = 4", "x = 5", "x = 2"], correctAnswer: "A" },
  { text: "15%-ийг аравтын бутархайгаар илэрхийл.", options: ["0.15", "0.015", "1.5", "15.0"], correctAnswer: "A" },
  { text: "(-3) × (-6) = ?", options: ["-18", "3", "-3", "18"], correctAnswer: "D" },
  { text: "x/4 = 3 бол x хэд вэ?", options: ["7", "10", "12", "16"], correctAnswer: "C" },
  { text: "5x - 9 = 21. x-ийн утга аль нь вэ?", options: ["4", "5", "6", "7"], correctAnswer: "C" },
  { text: "72-г 8-д хуваавал хэд гарах вэ?", options: ["8", "9", "10", "11"], correctAnswer: "B" },
  { text: "π-ийг ойролцоогоор хэд гэж авдаг вэ?", options: ["2.14", "2.71", "3.14", "4.13"], correctAnswer: "C" },
  { text: "2/3 + 1/3 нийлбэр хэд вэ?", options: ["1", "2", "1/3", "5/6"], correctAnswer: "A" },
  { text: "90°-ын өнцгийг юу гэж нэрлэдэг вэ?", options: ["Мохоо өнцөг", "Тэгш өнцөг", "Хурц өнцөг", "Шулуун өнцөг"], correctAnswer: "B" },
  { text: "8² хэдтэй тэнцүү вэ?", options: ["32", "48", "56", "64"], correctAnswer: "D" },
  { text: "12 ба 18-ын ХИЕХ аль нь вэ?", options: ["6", "9", "12", "18"], correctAnswer: "A" },
  { text: "3/5-ийг хувиар илэрхийл.", options: ["30%", "50%", "60%", "75%"], correctAnswer: "C" },
  { text: "2x + 5 = 19 бол x хэд вэ?", options: ["5", "7", "9", "12"], correctAnswer: "B" },
  { text: "Тэгш өнцөгтийн талбайг олох томьёо аль нь вэ?", options: ["2(a + b)", "ab/2", "a² + b²", "a × b"], correctAnswer: "D" },
  { text: "0-ээс хамгийн ойр тоо аль нь вэ?", options: ["0.1", "1", "2", "5"], correctAnswer: "A" },
];

export const examData: ExamData = {
  title: "Математик — 8-р анги",
  schoolYear: "2025-2026 оны хичээлийн жил",
  term: "II улирал",
  durationMinutes: 38,
  questions: seeds.map((seed, index) => ({
    id: index + 1,
    questionNumber: index + 1,
    text: seed.text,
    type: "multiple_choice",
    correctAnswer: seed.correctAnswer,
    options: [
      { id: "A", text: seed.options[0] },
      { id: "B", text: seed.options[1] },
      { id: "C", text: seed.options[2] },
      { id: "D", text: seed.options[3] },
    ],
  })),
};
