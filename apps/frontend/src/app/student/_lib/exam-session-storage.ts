/** sessionStorage — `AppApolloProvider`ийн x-exam-token энд уншина. */
export const STUDENT_EXAM_TOKEN_STORAGE_KEY = "pinequest.studentExamToken";

/** Токены аль шалгалтад хамаарч байгаа — буруу шалгалт руу шилжихэд үлдэгдэл цэвэрлэхэд. */
export const STUDENT_EXAM_TOKEN_EXAM_META_KEY = "pinequest.studentExamTokenExamId";

/** `studentExamAuth`-ийн дараа хяналтын scope (ангийн ID) сэргээхэд. */
export const STUDENT_EXAM_CLASS_ID_STORAGE_KEY = "pinequest.studentExamClassId";

export function readStudentExamToken(examId: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    const meta = sessionStorage.getItem(STUDENT_EXAM_TOKEN_EXAM_META_KEY);
    if (meta !== examId) return null;
    return sessionStorage.getItem(STUDENT_EXAM_TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function readStudentExamClassId(examId: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    const meta = sessionStorage.getItem(STUDENT_EXAM_TOKEN_EXAM_META_KEY);
    if (meta !== examId) return null;
    return sessionStorage.getItem(STUDENT_EXAM_CLASS_ID_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function writeStudentExamToken(
  examId: string,
  token: string,
  classId?: string | null,
): void {
  sessionStorage.setItem(STUDENT_EXAM_TOKEN_EXAM_META_KEY, examId);
  sessionStorage.setItem(STUDENT_EXAM_TOKEN_STORAGE_KEY, token);
  if (classId) {
    sessionStorage.setItem(STUDENT_EXAM_CLASS_ID_STORAGE_KEY, classId);
  } else {
    sessionStorage.removeItem(STUDENT_EXAM_CLASS_ID_STORAGE_KEY);
  }
}

/** Одоогийн маршрутад тохирохгүй хуучин токеныг арилгана. */
export function discardStudentExamTokenIfNotForExam(examId: string): void {
  try {
    const meta = sessionStorage.getItem(STUDENT_EXAM_TOKEN_EXAM_META_KEY);
    if (meta != null && meta !== examId) {
      sessionStorage.removeItem(STUDENT_EXAM_TOKEN_STORAGE_KEY);
      sessionStorage.removeItem(STUDENT_EXAM_TOKEN_EXAM_META_KEY);
      sessionStorage.removeItem(STUDENT_EXAM_CLASS_ID_STORAGE_KEY);
    }
  } catch {
    /* ignore */
  }
}
