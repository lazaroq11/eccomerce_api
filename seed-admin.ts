import { PrismaClient, Role } from '../../../generated/prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@loja.com';
  const name = 'Admin';
  const passwordPlain = 'admin'; // senha do admin
  const hashedPassword = await bcrypt.hash(passwordPlain, 10);

  // Verifica se o admin já existe
  const existingAdmin = await prisma.user.findUnique({ where: { email } });

  if (existingAdmin) {
    console.log('Admin já existe');
    return;
  }

  // Cria o admin
  const admin = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  console.log('Admin criado:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
