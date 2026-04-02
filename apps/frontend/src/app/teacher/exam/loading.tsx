/** @format */

import { TeacherExamSkeleton } from "./_components/teacher-exam-skeleton";

export default function TeacherExamLoading() {
  return (
    <div className="mx-auto max-w-[1200px] space-y-5 px-3 pb-8 pt-1 sm:space-y-6 sm:px-4 sm:pt-0 md:px-5">
      <TeacherExamSkeleton />
    </div>
  );
}
