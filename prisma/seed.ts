import { PrismaClient } from "@prisma/client";
import { createCipheriv, randomBytes } from "crypto";

const prisma = new PrismaClient();

const ADMIN_PERMISSIONS = [
  "users:create", "users:read", "users:update", "users:delete",
  "roles:create", "roles:read", "roles:update", "roles:delete",
  "credentials:create", "credentials:read", "credentials:update", "credentials:delete",
  "categories:create", "categories:read", "categories:update", "categories:delete",
  "security_logs:read",
];

const USER_PERMISSIONS = [
  "credentials:create", "credentials:read", "credentials:update", "credentials:delete",
  "categories:create", "categories:read", "categories:update", "categories:delete",
];

function getEncryptionKey(): Buffer {
  const secret = process.env.AES_SECRET_KEY || "abcdefghijklmnopqrstuvwxyz012345";
  return Buffer.from(secret.padEnd(32, "x").slice(0, 32));
}

function encryptPassword(plainText: string): { encryptedPassword: string; passwordIv: string; passwordAuthTag: string } {
  const key = getEncryptionKey();
  const iv = randomBytes(16);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");
  return {
    encryptedPassword: encrypted,
    passwordIv: iv.toString("hex"),
    passwordAuthTag: authTag,
  };
}

function calculateStrength(password: string): number {
  let strength = 0;
  if (password.length >= 8) strength += 25;
  if (password.length >= 12) strength += 15;
  if (/[A-Z]/.test(password)) strength += 15;
  if (/[a-z]/.test(password)) strength += 15;
  if (/[0-9]/.test(password)) strength += 15;
  if (/[^A-Za-z0-9]/.test(password)) strength += 15;
  return Math.min(100, strength);
}

async function main(): Promise<void> {
  console.log("🌱 Iniciando seed con datos completos...");

  // ── Roles ──
  let adminRole = await prisma.role.findUnique({ where: { name: "ADMIN" } });
  if (!adminRole) {
    adminRole = await prisma.role.create({ data: { name: "ADMIN", permissions: ADMIN_PERMISSIONS } });
    console.log("✅ Rol ADMIN creado");
  } else {
    console.log("ℹ️ Rol ADMIN ya existe");
  }

  let userRole = await prisma.role.findUnique({ where: { name: "USER" } });
  if (!userRole) {
    userRole = await prisma.role.create({ data: { name: "USER", permissions: USER_PERMISSIONS } });
    console.log("✅ Rol USER creado");
  } else {
    console.log("ℹ️ Rol USER ya existe");
  }

  // ── Usuarios ──
  const adminEmail = "admin@archivero.com";
  let adminUser = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!adminUser) {
    const passwordHash = await Bun.password.hash("Admin123!", { algorithm: "bcrypt", cost: 10 });
    adminUser = await prisma.user.create({
      data: {
        name: "Administrador",
        email: adminEmail,
        passwordHash,
        roleId: adminRole.id,
        isActive: true,
      },
    });
    console.log(`✅ Admin creado: ${adminEmail} / Admin123!`);
  } else {
    console.log("ℹ️ Admin ya existe");
  }

  const userEmail = "user@archivero.com";
  let demoUser = await prisma.user.findUnique({ where: { email: userEmail } });
  if (!demoUser) {
    const passwordHash = await Bun.password.hash("User1234!", { algorithm: "bcrypt", cost: 10 });
    demoUser = await prisma.user.create({
      data: {
        name: "Usuario Demo",
        email: userEmail,
        passwordHash,
        roleId: userRole.id,
        isActive: true,
      },
    });
    console.log(`✅ Usuario demo creado: ${userEmail} / User1234!`);
  } else {
    console.log("ℹ️ Usuario demo ya existe");
  }

  // ── Categorías para ADMIN ──
  const adminCategoriesData = [
    { name: "Email", color: "#3B82F6", icon: "mail" },
    { name: "Social Media", color: "#8B5CF6", icon: "users" },
    { name: "Bancos", color: "#10B981", icon: "banknote" },
    { name: "Desarrollo", color: "#F59E0B", icon: "code" },
    { name: "Compras", color: "#EC4899", icon: "shopping-cart" },
  ];

  const adminCategories: Record<string, string> = {};
  for (const cat of adminCategoriesData) {
    const existing = await prisma.category.findFirst({
      where: { userId: adminUser.id, name: cat.name },
    });
    if (!existing) {
      const created = await prisma.category.create({
        data: { ...cat, userId: adminUser.id },
      });
      adminCategories[cat.name] = created.id;
      console.log(`  📁 Categoría admin: ${cat.name}`);
    } else {
      adminCategories[cat.name] = existing.id;
    }
  }

  // ── Categorías para USER ──
  const userCategoriesData = [
    { name: "Trabajo", color: "#6366F1", icon: "briefcase" },
    { name: "Personal", color: "#14B8A6", icon: "heart" },
  ];

  const userCategories: Record<string, string> = {};
  for (const cat of userCategoriesData) {
    const existing = await prisma.category.findFirst({
      where: { userId: demoUser.id, name: cat.name },
    });
    if (!existing) {
      const created = await prisma.category.create({
        data: { ...cat, userId: demoUser.id },
      });
      userCategories[cat.name] = created.id;
      console.log(`  📁 Categoría user: ${cat.name}`);
    } else {
      userCategories[cat.name] = existing.id;
    }
  }

  // ── Credenciales para ADMIN ──
  const adminCredentials = [
    { serviceName: "Gmail", loginEmail: "admin@archivero.com", username: null, password: "Gmail2024!", category: "Email", notes: "Correo principal", tags: ["personal", "importante"], isFavorite: true },
    { serviceName: "Outlook", loginEmail: "admin@outlook.com", username: null, password: "Outlook2024!", category: "Email", notes: "Correo secundario", tags: ["trabajo"], isFavorite: false },
    { serviceName: "Facebook", loginEmail: "admin@archivero.com", username: null, password: "Face1234!", category: "Social Media", notes: "Cuenta personal", tags: ["red-social"], isFavorite: false },
    { serviceName: "Twitter / X", loginEmail: null, username: "@admin_user", password: "X1234567!", category: "Social Media", notes: "Cuenta profesional", tags: ["red-social", "profesional"], isFavorite: true },
    { serviceName: "Instagram", loginEmail: null, username: "admin_ig_official", password: "Insta2024!", category: "Social Media", notes: "Cuenta personal", tags: ["red-social"], isFavorite: false },
    { serviceName: "LinkedIn", loginEmail: "admin@archivero.com", username: null, password: "Linked2024!", category: "Social Media", notes: "Perfil profesional", tags: ["profesional", "trabajo"], isFavorite: true },
    { serviceName: "Banco Santander", loginEmail: "admin@bancosantander.com", username: null, password: "Santander1!", category: "Bancos", notes: "Cuenta corriente", tags: ["financiero", "importante"], isFavorite: true },
    { serviceName: "PayPal", loginEmail: "admin@archivero.com", username: null, password: "PayPal2024!", category: "Bancos", notes: "Cuenta verificada", tags: ["financiero", "compras"], isFavorite: false },
    { serviceName: "GitHub", loginEmail: null, username: "admin-dev", password: "Ghub2024!", category: "Desarrollo", notes: "Cuenta personal con repos privados", tags: ["desarrollo", "programación"], isFavorite: true },
    { serviceName: "AWS Console", loginEmail: "admin@aws.com", username: null, password: "AwsAdmin1!", category: "Desarrollo", notes: "Cuenta root - usar con cuidado", tags: ["desarrollo", "cloud", "importante"], isFavorite: false },
    { serviceName: "DigitalOcean", loginEmail: "admin@digitalocean.com", username: null, password: "DoAdmin1!", category: "Desarrollo", notes: "Droplets y bases de datos", tags: ["desarrollo", "cloud"], isFavorite: false },
    { serviceName: "Amazon", loginEmail: "admin@amazon.com", username: null, password: "Amazon123!", category: "Compras", notes: "Cuenta Prime", tags: ["compras"], isFavorite: true },
    { serviceName: "Mercado Libre", loginEmail: "admin@mercadolibre.com", username: null, password: "Meli2024!", category: "Compras", notes: null, tags: ["compras"], isFavorite: false },
  ];

  for (const cred of adminCredentials) {
    const existing = await prisma.credential.findFirst({
      where: { userId: adminUser.id, serviceName: cred.serviceName },
    });
    if (!existing) {
      const encrypted = encryptPassword(cred.password);
      await prisma.credential.create({
        data: {
          userId: adminUser.id,
          serviceName: cred.serviceName,
          loginEmail: cred.loginEmail,
          username: cred.username,
          ...encrypted,
          categoryId: adminCategories[cred.category] ?? null,
          notes: cred.notes,
          tags: cred.tags,
          strength: calculateStrength(cred.password),
          isFavorite: cred.isFavorite,
        },
      });
      console.log(`  🔐 Credencial admin: ${cred.serviceName}`);
    }
  }

  // ── Credenciales para USER ──
  const userCredentials = [
    { serviceName: "Correo Corporativo", loginEmail: "user@empresa.com", username: null, password: "Corp1234!", category: "Trabajo", notes: "Correo oficial de la empresa", tags: ["trabajo", "importante"], isFavorite: true },
    { serviceName: "Jira", loginEmail: "user@empresa.com", username: null, password: "Jira2024!", category: "Trabajo", notes: "Gestión de proyectos", tags: ["trabajo", "desarrollo"], isFavorite: false },
    { serviceName: "Slack", loginEmail: "user@empresa.com", username: null, password: "Slack1234!", category: "Trabajo", notes: "Comunicación del equipo", tags: ["trabajo", "mensajería"], isFavorite: false },
    { serviceName: "Netflix", loginEmail: "user@netflix.com", username: null, password: "Netflix1!", category: "Personal", notes: "Plan familiar", tags: ["entretenimiento"], isFavorite: true },
    { serviceName: "Spotify", loginEmail: "user@spotify.com", username: null, password: "Spotify1!", category: "Personal", notes: "Premium", tags: ["entretenimiento", "música"], isFavorite: true },
    { serviceName: "Gmail Personal", loginEmail: "user@gmail.com", username: null, password: "Gmail1234!", category: "Personal", notes: "Correo personal", tags: ["personal"], isFavorite: false },
  ];

  for (const cred of userCredentials) {
    const existing = await prisma.credential.findFirst({
      where: { userId: demoUser.id, serviceName: cred.serviceName },
    });
    if (!existing) {
      const encrypted = encryptPassword(cred.password);
      await prisma.credential.create({
        data: {
          userId: demoUser.id,
          serviceName: cred.serviceName,
          loginEmail: cred.loginEmail,
          username: cred.username,
          ...encrypted,
          categoryId: userCategories[cred.category] ?? null,
          notes: cred.notes,
          tags: cred.tags,
          strength: calculateStrength(cred.password),
          isFavorite: cred.isFavorite,
        },
      });
      console.log(`  🔐 Credencial user: ${cred.serviceName}`);
    }
  }

  console.log("🎉 Seed completado exitosamente");
  console.log("\n📋 Resumen:");
  console.log(`  Roles: ADMIN, USER`);
  console.log(`  Usuarios: ${adminEmail}, ${userEmail}`);
  console.log(`  Categorías admin: ${Object.keys(adminCategories).length}`);
  console.log(`  Categorías user: ${Object.keys(userCategories).length}`);
  console.log(`  Credenciales admin: ${adminCredentials.length}`);
  console.log(`  Credenciales user: ${userCredentials.length}`);
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
