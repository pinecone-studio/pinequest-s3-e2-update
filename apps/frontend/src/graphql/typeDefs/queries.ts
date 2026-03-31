import { gql } from "@apollo/client";

export const GET_ALL_SUBJECTS = gql`
  query GetAllSubject {
    getAllSubject {
      id
      name
    }
  }
`;
export const GET_CLASS_BY_TEACHER_AND_SCHOOL_ID = gql`
  query GetClassByTeacherAndSchoolId($input: ClassByTeacherAndSchoolIdInput!) {
    getClassByTeacherAndSchoolId(input: $input) {
      sectionTeacherId
      schoolId
      id
      grade
      section
      createdAt
      updatedAt
    }
  }
`;

export const GET_STUDENT_BY_CLASS_ID = gql`
  query GetStudentByClassId($classId: String!) {
    getStudentByClassId(classId: $classId) {
      id
      email
      classId
      firstName
      lastName
      studentCode
      studentExamResultIds
      createdAt
      updatedAt
    }
  }
`;

export const GET_TESTS_BY_SUBJECT_AND_GRADE = gql`
  query GetTestsBySybjectAndGrade($input: TestInput) {
    getTestsBySybjectAndGrade(input: $input) {
      id
      grade
      subjectId
      question
      answers
      rightAnswer
      imageUrl
      difficulty
      score
      usageCount
      notes
      teacherId
      createdAt
      updatedAt
    }
  }
`;
