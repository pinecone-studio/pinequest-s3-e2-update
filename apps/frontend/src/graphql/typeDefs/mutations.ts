import { gql } from "@apollo/client";

export const CREATE_TESTS = gql`
  mutation CreateTests($input: CreateTestsInput!) {
    createTests(input: $input) {
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
      favourite
      notes
      teacherId
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_OPEN_EXERCIES = gql`
  mutation CreateOpenExercies($input: CreateOpenExerciesArgs!) {
    createOpenExercies(input: $input) {
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
      favourite
      notes
      teacherId
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_TESTS = gql`
  mutation UpdateTests($input: UpdateTestsInput!) {
    updateTests(input: $input) {
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
      favourite
      notes
      teacherId
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_OPEN_EXERCIES = gql`
  mutation UpdateOpenExercies($input: UpdateOpenExerciesArgs!) {
    updateOpenExercies(input: $input) {
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
      favourite
      notes
      teacherId
      createdAt
      updatedAt
    }
  }
`;
export const STUDENT_EXAM_AUTH = gql`
  mutation StudentExamAuth($input: StudentExamAuthInput!) {
    studentExamAuth(input: $input) {
      token
      student {
        id
        firstName
        lastName
        classId
        studentCode
      }
    }
  }
`;

export const SUBMIT_STUDENT_EXAM = gql`
  mutation SubmitStudentExam($input: SubmitStudentExamInput!) {
    submitStudentExam(input: $input) {
      id
      examId
      studentId
      status
      testScore
      openExerciseScore
      totalScore
      actualScore
      answersJson
      createdAt
      updatedAt
    }
  }
`;

export const ADD_EXAM_ALLOWED_CLASSES = gql`
  mutation AddExamAllowedClasses($examId: String!, $classIds: [String!]!) {
    addExamAllowedClasses(examId: $examId, classIds: $classIds)
  }
`;

export const START_EXAM_MONITORING_FOR_CLASS = gql`
  mutation StartExamMonitoringForClass($examId: String!, $classId: String!) {
    startExamMonitoringForClass(examId: $examId, classId: $classId) {
      ok
      startedAt
    }
  }
`;

export const CREATE_EXAM = gql`
  mutation CreateExam($input: CreateExamArgs!) {
    createExam(input: $input) {
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

export const ADD_STUDENT = gql`
  mutation AddStudent($input: AddStudentInput!) {
    addStudent(input: $input) {
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

export const ADD_TEACHER = gql`
  mutation AddTeacher($input: AddTeacherInput!) {
    addTeacher(input: $input) {
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

export const LINK_TEACHER_CLERK = gql`
  mutation LinkTeacherClerk {
    linkTeacherClerk {
      id
      clerkId
      email
      firstName
      lastName
      schoolId
      role
    }
  }
`;

export const CREATE_CLASS = gql`
  mutation CreateClass($input: CreateClassInput!) {
    createClass(input: $input) {
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

export const SYNC_CLASS_TEACHER_ASSIGNMENTS = gql`
  mutation SyncClassTeacherAssignments($input: SyncClassTeachersInput!) {
    syncClassTeacherAssignments(input: $input)
  }
`;

export const DELETE_CLASS_MUTATION = gql`
  mutation DeleteSchoolClass($id: String!) {
    deleteClass(id: $id)
  }
`;

export const UPDATE_CLASS_MUTATION = gql`
  mutation UpdateSchoolClass($input: UpdateClassInput!) {
    updateClass(input: $input) {
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

export const UPDATE_STUDENT_MUTATION = gql`
  mutation UpdateStudentSchool($input: UpdateStudentInput!) {
    updateStudent(input: $input) {
      id
      classId
      firstName
      lastName
      studentCode
    }
  }
`;

export const DELETE_STUDENT_MUTATION = gql`
  mutation DeleteStudentSchool($id: String!) {
    deleteStudent(id: $id)
  }
`;
