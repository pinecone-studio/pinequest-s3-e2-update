import { clerkClient, currentUser } from "@clerk/nextjs/server";
import type { User, UserRole } from "./types";

function appUserFromClerkRecord(
  clerkUser: {
    id: string;
    emailAddresses: readonly { emailAddress: string }[];
    firstName: string | null;
    lastName: string | null;
    username: string | null;
    unsafeMetadata: Record<string, unknown> | null | undefined;
    publicMetadata: Record<string, unknown> | null | undefined;
  },
  role: UserRole,
): User {
  const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";
  const first = clerkUser.firstName ?? "";
  const last = clerkUser.lastName ?? "";
  const name =
    [first, last].filter(Boolean).join(" ") ||
    clerkUser.username ||
    email ||
    "Хэрэглэгч";
  const meta = {
    ...(clerkUser.unsafeMetadata ?? {}),
    ...(clerkUser.publicMetadata ?? {}),
  };
  const str = (key: string) => {
    const v = meta[key];
    return typeof v === "string" && v.trim() ? v.trim() : undefined;
  };
  const ageRaw = meta.age;
  const age =
    typeof ageRaw === "number" && Number.isFinite(ageRaw)
      ? Math.round(ageRaw)
      : typeof ageRaw === "string" && /^\d+$/.test(ageRaw)
        ? Math.round(Number.parseInt(ageRaw, 10))
        : undefined;

  return {
    id: clerkUser.id,
    email,
    name,
    role,
    specialty: str("specialty"),
    phone: str("phone"),
    age,
    organizationAddress: str("organizationAddress"),
    organizationAimag: str("organizationAimag"),
    organizationHot: str("organizationHot"),
    organizationSum: str("organizationSum"),
    organizationAddressDetail: str("organizationAddressDetail"),
    organizationRegister: str("organizationRegister"),
  };
}

export async function getAppUserFromClerk(role: UserRole): Promise<User | null> {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;
  return appUserFromClerkRecord(
    {
      id: clerkUser.id,
      emailAddresses: clerkUser.emailAddresses,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      username: clerkUser.username,
      unsafeMetadata: clerkUser.unsafeMetadata as Record<string, unknown>,
      publicMetadata: clerkUser.publicMetadata as Record<string, unknown>,
    },
    role,
  );
}

/**
 * `currentUser()` зарим эхний request дээр хоосон буцааж болно; auth().userId байхад backend-аас татна.
 */
export async function getAppUserFromUserId(
  userId: string,
  role: UserRole,
): Promise<User | null> {
  try {
    const client = await clerkClient();
    const u = await client.users.getUser(userId);
    return appUserFromClerkRecord(
      {
        id: u.id,
        emailAddresses: u.emailAddresses,
        firstName: u.firstName,
        lastName: u.lastName,
        username: u.username,
        unsafeMetadata: u.unsafeMetadata as Record<string, unknown>,
        publicMetadata: u.publicMetadata as Record<string, unknown>,
      },
      role,
    );
  } catch {
    return null;
  }
}

/**
 * Clerk-ийн profile түр ачаалагдахгүй үед (session бэлэн, гэхдээ currentUser/backend хоосон)
 * /sign-in ⇄ /teacher гогцоонд оруулахгүйн тулд хамгийн багц User.
 */
export function fallbackAppUser(userId: string, role: UserRole): User {
  return {
    id: userId,
    email: "",
    name: "Хэрэглэгч",
    role,
  };
}
