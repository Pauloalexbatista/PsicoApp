/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando Seed...");
  const passwordHash = await bcrypt.hash("admin123", 10);

  // Criar Psicólogo Admin
  await prisma.user.upsert({
    where: { email: "admin@psicoapp.pt" },
    update: {
       passwordHash: passwordHash
    },
    create: {
      email: "admin@psicoapp.pt",
      name: "Psicóloga Admin",
      passwordHash: passwordHash,
      role: "ADMIN",
    },
  });

  // Criar módulo TDAH
  await prisma.module.upsert({
    where: { name: "TDAH" },
    update: {},
    create: {
      name: "TDAH",
      description: "Módulo de Intervenção para Défice de Atenção e Hiperatividade",
    },
  });

  console.log("Seed concluído com sucesso!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Erro no Seed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
