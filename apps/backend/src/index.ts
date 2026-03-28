import type { GraphQLSchema } from "graphql";
import { createYoga } from "graphql-yoga";
import { Hono } from "hono";
import { getDb } from "./db/drizzle";
import { schema } from "./graphql";
import type { Env } from "./types";

/** Apollo Sandbox, GraphiQL, local Next/Wrangler — browser-аас cross-origin POST зөвшөөрөх */
const corsOrigins = [
  "https://studio.apollographql.com",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:8787",
  "http://127.0.0.1:8787",
] as const;

const yoga = createYoga({
  schema: schema as GraphQLSchema,
  graphqlEndpoint: "/graphql",
  graphiql: true,
  cors: {
    origin: [...corsOrigins],
    credentials: true,
    allowedHeaders: [
      "content-type",
      "apollo-require-preflight",
      "authorization",
      "x-apollo-operation-name",
    ],
  },
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
