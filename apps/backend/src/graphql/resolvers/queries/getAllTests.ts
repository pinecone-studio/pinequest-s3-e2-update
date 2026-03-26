import { desc, eq } from "drizzle-orm";
import type { GraphQLResolveInfo } from "graphql";
import { subjectTable, testTable } from "../../../db/schema";
import type { GraphQLUserContext } from "../../context";
import { mapTestRow } from "../test-utils";

export async function getAllTests(_: unknown, __: unknown, ctx: GraphQLUserContext, _info: GraphQLResolveInfo) {
  const rows = await ctx.db
    .select({
      id: testTable.id,
      grade: testTable.grade,
      subjectId: testTable.subjectId,
      topic: testTable.topic,
      title: testTable.title,
      questionType: testTable.questionType,
      question: testTable.question,
      subtopic: testTable.subtopic,
      rubric: testTable.rubric,
      formulaRaw: testTable.formulaRaw,
      imageUrl: testTable.imageUrl,
      fileUploadConfig: testTable.fileUploadConfig,
      answers: testTable.answers,
      rightAnswer: testTable.rightAnswer,
      notes: testTable.notes,
      questionNote: testTable.questionNote,
      difficulty: testTable.difficulty,
      score: testTable.score,
      usageCount: testTable.usageCount,
      isActive: testTable.isActive,
      createdAt: testTable.createdAt,
      updatedAt: testTable.updatedAt,
      subjectName: subjectTable.name,
    })
    .from(testTable)
    .leftJoin(subjectTable, eq(testTable.subjectId, subjectTable.id))
    .orderBy(desc(testTable.createdAt));

  return rows.map(mapTestRow);
}
