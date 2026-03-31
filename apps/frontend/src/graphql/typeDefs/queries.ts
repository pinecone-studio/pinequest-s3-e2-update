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

export const GET_OPEN_EXERCIES_BY_SUBJECT_AND_GRADE = gql`
  query GetOpenExerciesBySubjectAndGrade($input: OpenExerciesInput) {
    getOpenExerciesBySubjectAndGrade(input: $input) {
      id
      subjectId
      grade
      topic
      title
      question
      answer
      imageUrl
      difficulty
      score
      notes
      teacherId
      createdAt
      updatedAt
    }
  }
`;
export const GET_EXAM_BY_SCHOOL_ID = gql`
  query GetExamBySchoolId($schoolId: String!) {
    getExamBySchoolId(schoolId: $schoolId) {
      id
      grade
      subjectId
      topic
      title
      date
      location
      duration
      variation
      testIds
      openExerciseIds
      notes
      score
      usageCount
      isActive
      needpermission
      schoolId
      teacherId
      createdAt
      updatedAt
    }
  }
`;
