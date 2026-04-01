import { eq } from "drizzle-orm";
import { openExerciesTable } from "../../../../db/schema";
import { GraphQLUserContext } from "../../../context";

export const getOpenExerciesById = async (
  _parent: unknown,
  args: { openExerciesId: string },
  ctx: GraphQLUserContext,
) => {
  if (!args.openExerciesId) throw new Error("Open exercies id is requiered.");

  try {
    return await ctx.db
      .select()
      .from(openExerciesTable)
      .where(eq(openExerciesTable.id, args.openExerciesId));
  } catch (err) {
    console.error("Failed to get open exercies by id. Error:", err);
    throw new Error("Failed to get open exercies.");
  }
};
