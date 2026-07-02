import { HashServicePort } from "../../domain/ports/HashServicePort";

export class BunHashService implements HashServicePort {
  async hash(plainText: string): Promise<string> {
    return await Bun.password.hash(plainText, {
      algorithm: "bcrypt",
      cost: 10,
    });
  }

  async compare(plainText: string, hash: string): Promise<boolean> {
    return await Bun.password.verify(plainText, hash);
  }
}
