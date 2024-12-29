"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/prisma";
import {cache} from 'react'

export async function changeToAdmin(formData: FormData) {
  const user = await prisma.user.findUnique({
    where: { email: formData.get("email") as string },
  });
  if (!user) {
    return console.log("user not found");
  }
  if (user.role == "USER") {
    await prisma.user.update({
      where: { email: formData.get("email") as string },
      data: { role: "ADMIN" },
    });
  } else {
    await prisma.user.update({
      where: { email: formData.get("email") as string },
      data: { role: "USER" },
    });
  }
  revalidatePath("/admin");
}

export async function changeCompanyImage(formData : FormData) {
  const entries = formData.entries()
  for (const [key, value] of entries) {
    console.log(key)
  }
}

export const getProblemsByCompany = cache(async (name : string) => {
  const results = await prisma.problemCompany.findUnique({where : {name}, include : {problems : true}})
  return results
})
