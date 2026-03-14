/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const users = await prisma.user.findMany();
  console.log("Users in DB:", users);
  const patients = await prisma.patient.findMany();
  console.log("Patients in DB:", patients);
}

check()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
