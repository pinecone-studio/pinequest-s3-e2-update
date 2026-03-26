import { studentExamResultTable } from "../../../db/schema";
import { GraphQLUserContext } from "../../context";
import type { GraphQLResolveInfo } from "graphql";

export async function startExam(_: unknown, args: {examId: string, studentId: string} , ctx: GraphQLUserContext, _info: GraphQLResolveInfo) {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    await ctx.db.insert(studentExamResultTable).values({
        id,
        examId: args.examId,
        studentId: args.studentId,
        status: "pending",
        createdAt: now,
        updatedAt: now,
    });
    return {
        id,
        examId: args.examId,
        studentId: args.studentId,
        status: "pending",
        createdAt: now,
        updatedAt: now,
    };
}