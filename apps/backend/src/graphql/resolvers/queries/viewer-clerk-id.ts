import type { GraphQLUserContext } from "../../context";

export function viewerClerkId(
  _parent: unknown,
  _args: unknown,
  ctx: GraphQLUserContext,
): string | null {
  return ctx.clerkUserId;
}
