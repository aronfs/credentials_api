import { PrismaClient } from "@prisma/client";

const ADMIN_PERMISSIONS = [
  "users:create",
  "users:read",
  "users:update",
  "users:delete",
  "roles:create",
  "roles:read",
  "roles:update",
  "roles:delete",
  "credentials:create",
  "credentials:read",
  "credentials:update",
  "credentials:delete",
  "categories:create",
  "categories:read",
  "categories:update",
  "categories:delete",
  "security_logs:read",
];

const USER_PERMISSIONS = [
  "credentials:create",
  "credentials:read",
  "credentials:update",
  "credentials:delete",
  "categories:create",
  "categories:read",
  "categories:update",
  "categories:delete",
];

async function seedRoles(): Promise<void> {
  const prisma = new PrismaClient();

  try {
    const adminRole = await prisma.role.findUnique({ where: { name: "ADMIN" } });
    if (!adminRole) {
      await prisma.role.create({
        data: {
          name: "ADMIN",
          permissions: ADMIN_PERMISSIONS,
        },
      });
      console.log("✅ Rol ADMIN creado correctamente");
    } else {
      console.log("ℹ️ Rol ADMIN ya existe");
    }

    const userRole = await prisma.role.findUnique({ where: { name: "USER" } });
    if (!userRole) {
      await prisma.role.create({
        data: {
          name: "USER",
          permissions: USER_PERMISSIONS,
        },
      });
      console.log("✅ Rol USER creado correctamente");
    } else {
      console.log("ℹ️ Rol USER ya existe");
    }
  } catch (error) {
    console.error("❌ Error al crear roles:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedRoles();
