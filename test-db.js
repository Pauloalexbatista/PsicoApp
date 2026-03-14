/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });

async function testConnection() {
  try {
    console.log("Connecting to database...");
    await prisma.$connect();
    console.log("Connection successful. Searching for admin...");

    const user = await prisma.user.findUnique({
      where: { email: "admin@psicoapp.pt" }
    });

    console.log("Admin find result:", user ? "Found" : "Not Found");

    if (user) {
      console.log("Testing password hash comparison...");
      const isValid = await bcrypt.compare("admin123", user.passwordHash);
      console.log("Password Valid:", isValid);
    }
  } catch (e) {
    console.error("Database Test Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
