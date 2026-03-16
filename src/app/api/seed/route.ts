import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const secret = url.searchParams.get('secret');

  if (secret !== 'superadmin123') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const adminPasswordHash = await bcrypt.hash("admin123", 10);
    const tomasPasswordHash = await bcrypt.hash("tomas123", 10);

    // 1. Criar Psicóloga Admin
    const adminUser = await prisma.user.upsert({
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

    // 2. Criar Módulo TDAH
    const tdahModule = await prisma.module.upsert({
      where: { name: "TDAH" },
      update: {},
      create: {
        name: "TDAH",
        description: "Módulo de Intervenção para Défice de Atenção e Hiperatividade",
      },
    });

    // 3. Criar Paciente Tomás ligado à Psicóloga
    const patientTomas = await prisma.patient.upsert({
      where: { username: "tomas" },
      update: {
         passwordHash: tomasPasswordHash,
      },
      create: {
        username: "tomas",
        name: "Tomás",
        passwordHash: tomasPasswordHash,
        psychologistId: adminUser.id,
      },
    });

    // 4. Ligar Paciente ao Módulo TDAH
    await prisma.patientModule.upsert({
      where: {
        patientId_moduleId: {
           patientId: patientTomas.id,
           moduleId: tdahModule.id
        }
      },
      update: {},
      create: {
        patientId: patientTomas.id,
        moduleId: tdahModule.id,
        isActive: true
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Base de Dados semeada com sucesso no Servidor!",
      credentials: {
         admin: "admin@psicoapp.pt / admin123",
         patient: "tomas / tomas123"
      }
    });
  } catch (error: any) {
    console.error("Erro no Seeding Server-Side:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
