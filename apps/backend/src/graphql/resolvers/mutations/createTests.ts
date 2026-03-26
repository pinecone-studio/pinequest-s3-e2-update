import { GraphQLResolveInfo } from "graphql";
import { GraphQLUserContext } from "../../context";
import { testTable } from "../../../db/schema";


export default async function createTests(
  _parent: unknown,
  args: {
    gradeId: string;
    subjectId: string;
    topic: string;
    title: string;
    question: string;
    answers: string;
    rightAnswer: string;
    notes: string;
    questionNote: string;
    difficulty: string;
    score: number;
    isActive: number;
    createdAt: string;
    updatedAt: string;
  },
  ctx: GraphQLUserContext,
  _info: GraphQLResolveInfo   
) { 
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  await ctx.db.insert(testTable).values({
    id,
    gradeId: args.gradeId,
    subjectId: args.subjectId,
    topic: args.topic,
    title: args.title,
    question: args.question,
    answers: JSON.stringify(args.answers),
    rightAnswer: args.rightAnswer,
    notes: args.notes,
    questionNote: args.questionNote,
    difficulty: args.difficulty ?? "easy",
    score: args.score ?? 10,
    isActive: args.isActive ?? 1,    
    createdAt: now,
    updatedAt: now,
  });
  return { id, gradeId: args.gradeId, subjectId: args.subjectId, topic: args.topic, title: args.title, question: args.question, answers: args.answers, rightAnswer: args.rightAnswer, notes: args.notes, questionNote: args.questionNote, difficulty: args.difficulty ?? "easy", score: args.score ?? 10, isActive: args.isActive ?? true, createdAt: now, updatedAt: now };
}   