import { GraphQLResolveInfo } from "graphql";
import { GraphQLUserContext } from "../../../context";
import { testTable } from "../../../../db/schema/testTable";


type CreateTestsArgs = {
    grade: number
    subjectId: string
    question: string
    answers: string[]
    imageUrl: string
    rightAnswer: string
    difficulty: string
    score: number
    usageCount: number
    notes: string
}

export const createTests = async (
    _parent: unknown,
    args: {createTestArgs: CreateTestsArgs},
    ctx: GraphQLUserContext,
) => {
    const id = crypto.randomUUID()
    const now = new Date().toDateString()
    try {
        await ctx.db.insert(testTable).values({
            id: id,
            grade: args.createTestArgs.grade,
            subjectId: args.createTestArgs.subjectId,
            question: args.createTestArgs.question,
            answers: args.createTestArgs.answers,
            imageUrl: args.createTestArgs.imageUrl,
            rightAnswer: args.createTestArgs.rightAnswer,
            difficulty: args.createTestArgs.difficulty,
            score: args.createTestArgs.score,
            usageCount: args.createTestArgs.usageCount,
            notes: args.createTestArgs.notes,
            createdAt: now,
            updatedAt: now,
        })
        return {
            id: id,
            grade: args.createTestArgs.grade,
            subjectId: args.createTestArgs.subjectId,
            question: args.createTestArgs.question,
            answers: args.createTestArgs.answers,
            imageUrl: args.createTestArgs.imageUrl,
            rightAnswer: args.createTestArgs.rightAnswer,
            difficulty: args.createTestArgs.difficulty,
            score: args.createTestArgs.score,
            usageCount: args.createTestArgs.usageCount,
            notes: args.createTestArgs.notes,
            createdAt: now,
            updatedAt: now,
        }
    }
    catch(err) {
        console.error("Failed to create test:", err);
        throw new Error(`Failed to create test: ${err}`);
    }
}