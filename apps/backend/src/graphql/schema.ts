import { createSchema } from "graphql-yoga";
import type { GraphQLResolveInfo } from "graphql";
import { schoolTable } from "../db/schema";
import type { Db } from "../db/drizzle";

export type GraphQLUserContext = {
  db: Db;
};

export const schema = createSchema({
  typeDefs:  `
    type School {
      id: Int!
      name: String!
      address: String!
      city: String!
      state: String!
      zip: String!
    }

    type Query {
      hello: String!
      schools: [School!]!
    }
  `,
  resolvers: {
    Query: {
      hello: () => "world",
      schools: async (
        _parent: unknown,
        _args: Record<string, never>,
        ctx: GraphQLUserContext,
        _info: GraphQLResolveInfo,
      ) => {
        return ctx.db.select().from(schoolTable);
      },
    },
  },
});
