import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET(request: Request) {
  // Simple protection to avoid random internet people reseeding (check for a secret password query param)
  const url = new URL(request.url);
  const secret = url.searchParams.get('secret');

  if (secret !== 'superadmin123') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const adminPasswordHash = await bcrypt.hash("admin123", 10);
    const tomasPasswordHash = await bcrypt.hash("tomas123", 10);

    // 1. Criar Psicóloga Admin
    await prisma.user.upsert({
      where: { email: "admin@psicoapp.pt" },
      update: {
         passwordHash: adminPasswordHash,
      },
      create: {
        email: "admin@psicoapp.pt",
        name: "Psicóloga Admin",
        passwordHash: adminPasswordHash,
        role: "ADMIN",
      },
    });

    // 2. Criar Módulo TDAH associado à BD
    await prisma.module.upsert({
      where: { name: "TDAH" },
      update: {},
      create: {
        name: "TDAH",
        description: "Módulo de Intervenção para Défice de Atenção e Hiperatividade",
      },
    });

    // 3. Criar Paciente Tomás
    await prisma.patient.upsert({
      where: { email: "tomas@example.com" },
      update: {
         passwordHash: tomasPasswordHash,
      },
      create: {
        email: "tomas@example.com",
        name: "Tomás",
        age: 12,
        passwordHash: tomasPasswordHash,
        modules: JSON.stringify(["TDAH"]),
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Base de Dados semeada com sucesso no Servidor!",
      credentials: {
         admin: "admin@psicoapp.pt / admin123",
         patient: "tomas@example.com / tomas123"
      }
    });
  } catch (error: any) {
    console.error("Erro no Seeding Server-Side:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
