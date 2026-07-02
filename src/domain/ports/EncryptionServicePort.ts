export interface EncryptedData {
  encryptedData: string;
  iv: string;
  authTag: string;
}

export interface EncryptionServicePort {
  encrypt(plainText: string): EncryptedData;
  decrypt(encryptedData: string, iv: string, authTag: string): string;
}
