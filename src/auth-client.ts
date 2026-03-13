'use server'
import { auth } from "@/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/** Only allow same-origin relative paths to prevent open-redirect attacks. */
function sanitizeCallbackUrl(url?: string | null): string {
  if (url && url.startsWith("/") && !url.startsWith("//")) return url;
  return "/";
}

export const signIn = async (provider: string, callbackUrl?: string) => {
  const {url} = await auth.api.signInSocial({
    body: {
      provider,
      callbackURL: sanitizeCallbackUrl(callbackUrl),
    },
  });
  redirect(url as string)
};

export const signOut = async () => {
  await auth.api.signOut({
    headers: await headers(),
  });
};
export const getSession = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  return session
};
