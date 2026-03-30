import { gql } from "@apollo/client";

export const GET_ALL_SUBJECTS = gql`
  query GetAllSubject {
    getAllSubject {
      id
      name
    }
  }
`;
