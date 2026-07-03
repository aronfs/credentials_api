import { mkdir, writeFile, unlink, access } from "fs/promises";
import { join, resolve, normalize, relative } from "path";
import { existsSync } from "fs";
import { StorageProviderPort } from "../../../domain/ports/StorageProviderPort";
import { env } from "../../config/env";

export class LocalStorageProvider implements StorageProviderPort {
  private rootPath: string;

  constructor() {
    this.rootPath = resolve(env.IMAGE_STORAGE_PATH);
  }

  async saveFile(params: { buffer: Buffer; relativePath: string }): Promise<void> {
    const safePath = this.validatePath(params.relativePath);
    const absolutePath = join(this.rootPath, safePath);
    const dir = this.getDir(absolutePath);

    await mkdir(dir, { recursive: true });
    await writeFile(absolutePath, params.buffer);
  }

  async deleteFile(relativePath: string): Promise<void> {
    const safePath = this.validatePath(relativePath);
    const absolutePath = join(this.rootPath, safePath);

    try {
      await unlink(absolutePath);
    } catch {
      // Idempotent - don't throw if file doesn't exist
    }
  }

  async exists(relativePath: string): Promise<boolean> {
    const safePath = this.validatePath(relativePath);
    const absolutePath = join(this.rootPath, safePath);
    try {
      await access(absolutePath);
      return true;
    } catch {
      return false;
    }
  }

  getAbsolutePath(relativePath: string): string {
    const safePath = this.validatePath(relativePath);
    return join(this.rootPath, safePath);
  }

  private validatePath(relativePath: string): string {
    const normalized = normalize(relativePath).replace(/^[/\\]+/, "");
    const fullPath = resolve(join(this.rootPath, normalized));
    const rootResolved = resolve(this.rootPath);

    if (!fullPath.startsWith(rootResolved)) {
      throw new Error("Path traversal detected");
    }

    return normalized;
  }

  private getDir(absolutePath: string): string {
    return absolutePath.substring(0, absolutePath.lastIndexOf("/"));
  }
}
