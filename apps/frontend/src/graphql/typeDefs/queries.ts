import { gql } from "@apollo/client";

export const GET_ALL_SUBJECTS = gql`
  query GetAllSubject {
    getAllSubject {
      id
      name
    }
  }
`;

export const GET_VIEWER_TEACHER = gql`
  query ViewerTeacher {
    viewerTeacher {
      id
      clerkId
      email
      schoolId
      firstName
      lastName
      role
      myClassId
      classIds
    }
  }
`;

export const GET_STUDENT_EXAM_RESULTS_BY_CLASS_ID = gql`
  query GetStudentExamResultsByClassId($classId: String!) {
    getStudentExamResultsByClassId(classId: $classId) {
      id
      examId
      studentId
      teacherId
      status
      notes
      testScore
      openExerciseScore
      totalScore
      actualScore
      createdAt
      updatedAt
    }
  }
`;

export const GET_EXAMS_BY_IDS = gql`
  query GetExamsByIds($ids: [String!]!) {
    getExamsByIds(ids: $ids) {
      id
      grade
      subjectId
      topic
      title
      date
      score
      testIds
      openExerciseIds
      schoolId
      teacherId
      createdAt
      updatedAt
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

export const GET_EXAM_BY_ID = gql`
  query GetExamById($examId: String!) {
    getExamById(examId: $examId) {
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

export const GET_EXAM_QUESTION_ITEMS = gql`
  query GetExamQuestionItems(
    $testIds: [String!]!
    $openExerciseIds: [String!]!
  ) {
    getTestsByIds(ids: $testIds) {
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
    getOpenExerciesByIds(ids: $openExerciseIds) {
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

export const GET_TEST_BY_ID = gql`
  query GetTestById($testId: String!) {
    getTestById(testId: $testId) {
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

export const GET_OPEN_EXERCIES_BY_ID = gql`
  query GetOpenExerciesById($openExerciesId: String!) {
    getOpenExerciesById(openExerciesId: $openExerciesId) {
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

export const GET_SCHOOL_BY_CLERK_ID = gql`
  query GetSchoolByClerkId($clerkId: String!) {
    getSchoolByClerkId(clerkId: $clerkId) {
      id
      clerkId
      email
      name
      register
      provinceOrCity
      soumOrDistrict
      address
      createdAt
      updatedAt
    }
  }
`;

export const GET_CLASS_BY_SCHOOL_ID = gql`
  query GetClassBySchoolId($schoolId: String!) {
    getClassBySchoolId(schoolId: $schoolId) {
      id
      schoolId
      grade
      section
      sectionTeacherId
      createdAt
      updatedAt
    }
  }
`;

export const GET_TEACHERS_BY_SCHOOL_ID = gql`
  query GetTeachersBySchoolId($schoolId: String!) {
    getTeachersBySchoolId(schoolId: $schoolId) {
      id
      clerkId
      email
      myClassId
      classIds
      firstName
      lastName
      schoolId
      role
      createdAt
      updatedAt
    }
  }
`;
