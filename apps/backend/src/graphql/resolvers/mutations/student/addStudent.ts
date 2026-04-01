import { studentTable } from "../../../../db/schema";
import { GraphQLUserContext } from "../../../context";

type AddStudentInput = {
  email: string | null;
  classId: string;
  firstName: string;
  lastName: string;
};

function generateSixDigitStudentCode(): string {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  const n = (buf[0] % 900_000) + 100_000;
  return String(n);
}

function isStudentCodeUniqueViolation(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const message =
    "message" in err && typeof (err as any).message === "string"
      ? ((err as any).message as string)
      : "";

  return (
    message.includes("UNIQUE constraint failed") &&
    message.includes("student.studentCode")
  );
}

export const addStudent = async (
  parent: unknown,
  args: { input: AddStudentInput },
  ctx: GraphQLUserContext,
) => {
  try {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    for (let attempt = 0; attempt < 20; attempt++) {
      const studentCode = generateSixDigitStudentCode();
      try {
        await ctx.db.insert(studentTable).values({
          id: id,
          email: args.input.email,
          classId: args.input.classId,
          firstName: args.input.firstName,
          lastName: args.input.lastName,
          studentCode,
          studentStatus: "active",
          createdAt: now,
          updatedAt: now,
        });
        return {
          id,
          email: args.input.email,
          classId: args.input.classId,
          firstName: args.input.firstName,
          lastName: args.input.lastName,
          studentStatus: "active",
          studentCode,
          studentExamResultIds: [],
          createdAt: now,
          updatedAt: now,
        };
      } catch (err) {
        if (isStudentCodeUniqueViolation(err)) continue;
        throw err;
      }
    }
    throw new Error("Failed to generate a unique student code. Please retry.");
  } catch (error) {
    console.error("Failed to add student:", error);
    throw new Error(`Failed to add student: ${error}`);
  }
};
