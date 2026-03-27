import { mutationResolvers } from "./mutations";
import { queryResolvers } from "./queries/index";

export const resolvers = {
  Query: queryResolvers,  
  Mutation: mutationResolvers,
};
