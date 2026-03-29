import { GraphQLJSON } from "graphql-scalars";
import { mutationResolvers } from "./mutations";
import { queryResolvers } from "./queries/index";

export const resolvers = {
  JSON: GraphQLJSON,
  Query: queryResolvers,
  Mutation: mutationResolvers,
};
