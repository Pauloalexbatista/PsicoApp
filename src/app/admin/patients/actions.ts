"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function createPatient(formData: FormData) {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!name || !username || !password) {
    return { error: "Todos os campos são obrigatórios." };
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    
    await prisma.patient.create({
      data: {
        name,
        username,
        passwordHash,
        psychologistId: session.user.id,
      },
    });

    revalidatePath("/admin/patients");
    return { success: true };
  } catch {
    return { error: "Erro ao criar paciente. O utilizador já pode existir." };
  }
}

export async function toggleModule(patientId: string, moduleId: string, isActive: boolean) {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.patientModule.upsert({
    where: {
      patientId_moduleId: {
        patientId,
        moduleId,
      },
    },
    update: { isActive },
    create: {
      patientId,
      moduleId,
      isActive,
    },
  });

  revalidatePath("/admin/patients");
}
