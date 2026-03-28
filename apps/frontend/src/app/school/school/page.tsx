import { redirect } from "next/navigation";

/** Цэснээс хасагдсан; хуучин холбоосыг самбар руу чиглүүлнэ. */
export default function AdminSchoolPage() {
  redirect("/school");
}
