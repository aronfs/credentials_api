import { createCipheriv, createDecipheriv, randomBytes } from "crypto";
import { EncryptionServicePort, EncryptedData } from "../../domain/ports/EncryptionServicePort";
import { env } from "../config/env";

export class AesGcmEncryptionService implements EncryptionServicePort {
  private readonly algorithm = "aes-256-gcm";
  private readonly key: Buffer;

  constructor() {
    this.key = Buffer.from(env.AES_SECRET_KEY.padEnd(32, "x").slice(0, 32));
  }

  encrypt(plainText: string): EncryptedData {
    const iv = randomBytes(16);
    const cipher = createCipheriv(this.algorithm, this.key, iv);

    let encrypted = cipher.update(plainText, "utf8", "hex");
    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag().toString("hex");

    return {
      encryptedData: encrypted,
      iv: iv.toString("hex"),
      authTag,
    };
  }

  decrypt(encryptedData: string, iv: string, authTag: string): string {
    const decipher = createDecipheriv(
      this.algorithm,
      this.key,
      Buffer.from(iv, "hex")
    );
    decipher.setAuthTag(Buffer.from(authTag, "hex"));

    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  }
}
