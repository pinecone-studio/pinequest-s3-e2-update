import type { GraphQLSchema } from "graphql";
import { createYoga } from "graphql-yoga";
import { Hono } from "hono";
import { getDb } from "./db/drizzle";
import { schema } from "./graphql/schema";
import type { Env } from "./types";

const yoga = createYoga({
  schema: schema as GraphQLSchema,
  graphqlEndpoint: "/graphql",
  graphiql: true,
  context: ({ env }: { env: Env }) => ({
    db: getDb(env),
  }),
});

const app = new Hono<{ Bindings: Env }>();

app.get("/", (c) =>
  c.json({
    ok: true,
    graphql: "/graphql",
    graphiql: "GET /graphql (GraphiQL when enabled)",
  }),
);

app.all("/graphql", (c) =>
  yoga.fetch(c.req.raw, {
    env: c.env,
  }),
);

export default app;
