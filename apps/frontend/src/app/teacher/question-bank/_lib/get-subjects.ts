import { gql } from "@apollo/client";

export const GET_ALL_SUBJECTS_QUERY = gql`
  query GetAllSubjects {
    getAllSubjects {
      id
      name
    }
  }
`;

export type GetAllSubjectsResponse = {
  getAllSubjects: {
    id: string;
    name: string;
  }[];
};
