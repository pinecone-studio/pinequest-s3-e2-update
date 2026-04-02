import { examAllowedClassTable, examTable } from "../../../../db/schema";
import { GraphQLUserContext } from "../../../context";
type CreateExamArgs = {
  grade: number;
  subjectId: string;
  topic: string;
  title: string;
  date: string;
  location: string;
  duration: string;
  variation: string;
  testIds: string[];
  openExerciseIds: string[];
  notes: string;
  score: number;
  usageCount: number;
  isActive: number;
  needpermission: number;
  teacherId: string;
  schoolId: string;
};
export const createExam = async (
  _parent: unknown,
  args: { input: CreateExamArgs },
  ctx: GraphQLUserContext,
) => {
  try {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    await ctx.db.insert(examTable).values({
      id: id,
      grade: args.input.grade,
      subjectId: args.input.subjectId,
      topic: args.input.topic,
      title: args.input.title,
      date: args.input.date,
      location: args.input.location,
      duration: args.input.duration,
      variation: args.input.variation,
      testIds: JSON.stringify(args.input.testIds),
      openExerciseIds: JSON.stringify(args.input.openExerciseIds),
      notes: args.input.notes,
      score: args.input.score,
      usageCount: args.input.usageCount,
      isActive: args.input.isActive,
      needpermission: args.input.needpermission,
      teacherId: args.input.teacherId,
      schoolId: args.input.schoolId,
      createdAt: now,
      updatedAt: now,
    });

    const classIds = [
      ...new Set(
        (args.input.allowedClassIds ?? [])
          .map((c) => c.trim())
          .filter((c) => c.length > 0),
      ),
    ];
    for (const classId of classIds) {
      await ctx.db
        .insert(examAllowedClassTable)
        .values({ examId: id, classId, createdAt: now })
        .onConflictDoNothing();
    }

    return {
      id: id,
      grade: args.input.grade,
      subjectId: args.input.subjectId,
      topic: args.input.topic,
      title: args.input.title,
      date: args.input.date,
      location: args.input.location,
      duration: args.input.duration,
      variation: args.input.variation,
      testIds: args.input.testIds,
      openExerciseIds: args.input.openExerciseIds,
      notes: args.input.notes,
      score: args.input.score,
      usageCount: args.input.usageCount,
      isActive: args.input.isActive,
      needpermission: args.input.needpermission,
      teacherId: args.input.teacherId,
      schoolId: args.input.schoolId,
      createdAt: now,
      updatedAt: now,
    };
  } catch (err) {
    console.error("Failed to create exam:", err);
    throw new Error(`Failed to create exam: ${err}`);
  }
};
