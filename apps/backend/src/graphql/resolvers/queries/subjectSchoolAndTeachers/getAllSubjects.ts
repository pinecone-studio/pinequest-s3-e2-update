import { subjectTable } from "../../../../db/schema";
import { GraphQLUserContext } from "../../../context";

export const getAllSubject = async (
  _parent: unknown,
  args: unknown,
  ctx: GraphQLUserContext,
) => {
  try {
    const subjects = await ctx.db.select().from(subjectTable);
    console.log(subjects);
    return subjects;
  } catch (err) {
    console.error("Failed to get subjects. Error:", err);
    throw new Error("Failed to get subjects");
  }
};
