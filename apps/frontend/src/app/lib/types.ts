export type UserRole = "school_admin" | "teacher";

export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  /** Багшийн мэргэжил, заадаг хичээл (жишээ: Математик, Нийгэм) */
  specialty?: string;
};

export type School = {
  id: string;
  name: string;
  address: string;
  phone: string;
};

export type SchoolClass = {
  id: string;
  name: string;
  teacherIds: string[];
  studentIds: string[];
};

export type Student = {
  id: string;
  studentNumber: string;
  firstName: string;
  lastName: string;
  classId: string;
};

export type SessionPayload = {
  userId: string;
};
