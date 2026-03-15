"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function submitCheckin(formData: FormData) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "PATIENT") {
      return { success: false, error: "Acesso Negado: Apenas pacientes podem submeter check-ins." };
    }

    const focus = parseInt(formData.get("focus") as string) || 5;
    const rawSleep = formData.get("sleep") as string;
    const sleepMap: { [key: string]: number } = { "😫": 1, "😕": 2, "😐": 3, "🙂": 4, "🤩": 5 };
    const sleep = sleepMap[rawSleep] || 3;

    const patientId = session.user.id;

    // Retrieve active module (Assume TDAH for now or get first active)
    const activeModule = await prisma.patientModule.findFirst({
        where: { patientId, isActive: true },
        include: { module: true }
    });

    if (!activeModule) {
        return { success: false, error: "Nenhum módulo ativo." };
    }
    
    const dbDataPayload = JSON.stringify({ focus_level: focus, sleep_quality: sleep });
    const reward = 10;

    // Registar Sessão
    await prisma.activitySession.create({
      data: {
        type: "PILAR_D",
        status: "COMPLETED",
        data: dbDataPayload,
        dopasEarned: reward,
        patientId: patientId,
        moduleId: activeModule.moduleId,
      },
    });

    // Validar recompensa na conta mestre do paciente
    await prisma.patient.update({
      where: { id: patientId },
      data: {
        dopas: { increment: reward },
        xp: { increment: reward * 2 },
      },
    });

    revalidatePath("/");
    revalidatePath("/tdah/pilar-d");
    return { success: true, reward };
    
  } catch (error) {
    console.error("Erro no Pilar D:", error);
    return { success: false, error: "Erro interno ao processar registo diário." };
  }
}

export async function completeDailyCheckin(patientId: string, moduleId: string, dataStr: string) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "PATIENT") {
      throw new Error("Acesso Negado");
    }

    // See if they already did one today to prevent duplicate reward
    const todayStr = new Date().toISOString().split('T')[0];
    const existing = await prisma.activitySession.findFirst({
       where: {
         patientId,
         moduleId,
         type: "PILAR_D_HUMOR_SONO",
         createdAt: {
           gte: new Date(todayStr + "T00:00:00.000Z"),
           lt: new Date(todayStr + "T23:59:59.999Z")
         }
       }
    });

    if (existing) {
       // Just update the data
       await prisma.activitySession.update({
         where: { id: existing.id },
         data: { data: dataStr }
       });
       return { success: true, updated: true };
    }

    // Register a new session
    const reward = 5; // 5 Dopas for filling the daily check-in
    
    await prisma.activitySession.create({
      data: {
        type: "PILAR_D_HUMOR_SONO",
        status: "COMPLETED",
        data: dataStr,
        dopasEarned: reward,
        patientId,
        moduleId,
      },
    });

    await prisma.patient.update({
      where: { id: patientId },
      data: {
        dopas: { increment: reward },
        xp: { increment: reward * 2 },
      },
    });

    revalidatePath("/");
    revalidatePath("/tdah/pilar-d");
    return { success: true, reward };
    
  } catch (error) {
    console.error("Erro no Check-in Diário:", error);
    throw error;
  }
}

export async function completeDiarioCheckin(patientId: string, moduleId: string, textEntry: string) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "PATIENT") {
      throw new Error("Acesso Negado");
    }

    const reward = 10; // Extra Dopas for writing in the journal

    await prisma.activitySession.create({
      data: {
        type: "PILAR_D_DIARIO",
        status: "COMPLETED",
        data: JSON.stringify({ entry: textEntry }),
        dopasEarned: reward,
        patientId,
        moduleId,
      },
    });

    await prisma.patient.update({
      where: { id: patientId },
      data: {
        dopas: { increment: reward },
        xp: { increment: reward * 2 },
      },
    });

    revalidatePath("/");
    revalidatePath("/tdah/pilar-d/diario");
    return { success: true, reward };

  } catch (error) {
    console.error("Erro no Diário de Ganhos:", error);
    throw error;
  }
}

export async function completeAdolescenceTest(patientId: string, moduleId: string, answersJson: string) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "PATIENT") {
      throw new Error("Acesso Negado");
    }

    const reward = 50; // Big test, big reward!

    await prisma.activitySession.create({
      data: {
        type: "PILAR_D_QUESTIONARY_ADOLESCENTE",
        status: "COMPLETED",
        data: answersJson,
        dopasEarned: reward,
        patientId,
        moduleId,
      },
    });

    await prisma.patient.update({
      where: { id: patientId },
      data: {
        dopas: { increment: reward },
        xp: { increment: reward * 3 }, // Nice XP boost
      },
    });

    revalidatePath("/");
    revalidatePath("/tdah/pilar-d");
    return { success: true, reward };

  } catch (error) {
    console.error("Erro no Questionario:", error);
    throw error;
  }
}


