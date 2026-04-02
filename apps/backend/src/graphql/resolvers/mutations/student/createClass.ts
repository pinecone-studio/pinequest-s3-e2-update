import { classTable } from "../../../../db/schema";
import { GraphQLUserContext } from "../../../context";

type CreateClassInput = {
  schoolId: string;
  grade: number;
  section: string;
  sectionTeacherId: string;
};

export const createClass = async (
  parent: unknown,
  args: { input: CreateClassInput },
  ctx: GraphQLUserContext,
) => {
  try {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    await ctx.db.insert(classTable).values({
      id: id,
      schoolId: args.input.schoolId,
      grade: args.input.grade,
      section: args.input.section,
      sectionTeacherId: args.input.sectionTeacherId,
      createdAt: now,
      updatedAt: now,
    });
    return {
      id,
      schoolId: args.input.schoolId,
      grade: args.input.grade,
      section: args.input.section,
      sectionTeacherId: args.input.sectionTeacherId,
      createdAt: now,
      updatedAt: now,
    };
  } catch (err) {
    console.error("Failed to create class:", err);
    throw new Error(`Failed to create class: ${err}`);
  }
};
