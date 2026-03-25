export type UserRole = "school_admin" | "teacher";

export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  /** Багшийн мэргэжил, заадаг хичээл (жишээ: Математик, Нийгэм) */
  specialty?: string;
  /** Утас (Clerk unsafeMetadata.phone) */
  phone?: string;
  /** Нас (Clerk unsafeMetadata.age) */
  age?: number;
  /** Байгууллагын хаяг — нэг мөр (аймаг, хот, сум нэгтгэсэн) */
  organizationAddress?: string;
  /** Аймаг (unsafeMetadata.organizationAimag) */
  organizationAimag?: string;
  /** Хот (unsafeMetadata.organizationHot) */
  organizationHot?: string;
  /** Сум (unsafeMetadata.organizationSum) */
  organizationSum?: string;
  /** Дэлгэрэнгүй хаяг (гудамж, байр, тоот) */
  organizationAddressDetail?: string;
  /** Байгууллагын бүртгэлийн дугаар (unsafeMetadata.organizationRegister) */
  organizationRegister?: string;
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

