"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function completeActivity(patientId: string, moduleId: string, type: string, dopas: number, data?: string) {
  const session = await getSession();
  if (!session || session.user.id !== patientId) {
    throw new Error("Unauthorized");
  }

  await prisma.$transaction([
    prisma.activitySession.create({
      data: {
        patientId,
        moduleId,
        type,
        status: "COMPLETED",
        dopasEarned: dopas,
        data: data || null,
      },
    }),
    prisma.patient.update({
      where: { id: patientId },
      data: {
        dopas: { increment: dopas },
        xp: { increment: dopas * 10 },
      },
    }),
  ]);

  revalidatePath("/");
}

import { logout } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function logoutAction() {
  await logout();
  redirect("/login");
}
