import { gql } from "@apollo/client";

export const GET_ALL_SUBJECTS_QUERY = gql`
  query GetAllSubject {
    getAllSubject {
      id
      name
    }
  }
`;

export type GetAllSubjectsResponse = {
  getAllSubject: {
    id: string;
    name: string;
  }[];
};
