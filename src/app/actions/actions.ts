"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/prisma";
import fs from 'fs'

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
