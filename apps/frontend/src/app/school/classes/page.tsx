/** @format */

import { Suspense } from "react";
import { ClassesPageClient } from "./_components/classes-page-client";
import { ClassesPageSkeleton } from "./_components/classes-page-skeleton";

export default function AdminClassesPage() {
  return (
    <Suspense fallback={<ClassesPageSkeleton />}>
      <ClassesPageClient />
    </Suspense>
  );
}
