import { gql } from "@apollo/client";

export const CREATE_TEST_MUTATION = gql`
  mutation CreateTest($input: CreateTestInput!) {
    createTest(input: $input) {
      id
    }
  }
`;
