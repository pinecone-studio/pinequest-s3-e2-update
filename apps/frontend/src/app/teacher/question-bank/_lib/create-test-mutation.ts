import { gql } from "@apollo/client";

export const CREATE_TEST_MUTATION = gql`
  mutation CreateTest($input: CreateTestInput!) {
    createTest(input: $input) {
      id
    }
  }
`;

export const UPDATE_TEST_MUTATION = gql`
  mutation UpdateTest($id: String!, $input: UpdateTestInput!) {
    updateTest(id: $id, input: $input) {
      id
    }
  }
`;

export const INCREMENT_TEST_USAGE_MUTATION = gql`
  mutation IncrementTestUsage($ids: [String!]!) {
    incrementTestUsage(ids: $ids)
  }
`;
