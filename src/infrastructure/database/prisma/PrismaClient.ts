import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

export function getPrismaClient(): PrismaClient {
  if (!prisma) {
    const isDev = process.env.NODE_ENV === "development";
    prisma = new PrismaClient({
      log: isDev ? ["query", "error", "warn"] : ["error"],
    });
  }
  return prisma;
}

export async function connectDatabase(): Promise<void> {
  try {
    await getPrismaClient().$connect();
    console.log("✅ Connected to MongoDB successfully");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

export async function disconnectDatabase(): Promise<void> {
  await getPrismaClient().$disconnect();
  console.log("Disconnected from MongoDB");
}
