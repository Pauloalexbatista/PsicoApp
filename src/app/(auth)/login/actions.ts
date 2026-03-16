"use server";

import { prisma } from "@/lib/prisma";
import { login } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function authenticate(prevState: string | undefined, formData: FormData) {
  let redirectUrl: string | null = null;

  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return "Por favor, preencha todos os campos.";
    }

    // Check if it's the admin (psychologist)
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (user && await bcrypt.compare(password, user.passwordHash)) {
      await login({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });
      redirectUrl = "/admin/dashboard";
    }

    // Check if it's a patient
    if (!redirectUrl) {
      const patient = await prisma.patient.findUnique({
        where: { username: email },
      });

      if (patient && await bcrypt.compare(password, patient.passwordHash)) {
        await login({
          id: patient.id,
          email: patient.username,
          name: patient.name,
          role: "PATIENT",
        });
        redirectUrl = "/";
      }
    }

    if (!redirectUrl) {
      return "Credenciais inválidas.";
    }
  } catch (error: unknown) {
    console.error("LOGIN ERROR:", error);
    return "Ocorreu um erro ao entrar.";
  }

  if (redirectUrl) {
    redirect(redirectUrl);
  }
}
