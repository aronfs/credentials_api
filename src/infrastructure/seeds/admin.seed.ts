import { PrismaClient } from "@prisma/client";

async function seedAdmin(): Promise<void> {
  const prisma = new PrismaClient();

  try {
    const adminRole = await prisma.role.findUnique({ where: { name: "ADMIN" } });
    if (!adminRole) {
      console.error("❌ El rol ADMIN no existe. Ejecuta primero el seed de roles.");
      return;
    }

    const adminEmail = "admin@archivero.com";
    const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (existingAdmin) {
      console.log("ℹ️ Usuario admin ya existe");
      return;
    }

    const passwordHash = await Bun.password.hash("Admin123!", {
      algorithm: "bcrypt",
      cost: 10,
    });

    await prisma.user.create({
      data: {
        name: "Administrador",
        email: adminEmail,
        passwordHash,
        roleId: adminRole.id,
        isActive: true,
      },
    });

    console.log("✅ Usuario admin creado correctamente");
    console.log(`   Email: ${adminEmail}`);
    console.log("   Password: Admin123!");
  } catch (error) {
    console.error("❌ Error al crear admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();
