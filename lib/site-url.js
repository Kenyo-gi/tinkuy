import { headers } from "next/headers";

export async function getSiteUrl() {
  const headersList = await headers();
  const host = headersList.get("host");
  const proto = headersList.get("x-forwarded-proto") || "http";

  if (host) {
    return `${proto}://${host}`;
  }

  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}
