'use server'
import { auth } from "@/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
export const signIn = async (provider: string) => {
  const {url} = await auth.api.signInSocial({
    body: {
      provider,
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
