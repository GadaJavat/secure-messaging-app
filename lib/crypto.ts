import CryptoJS from "crypto-js";

export type DESConfig = {
  secretKey: string;
  iv: string;
};

const DES_BLOCK_SIZE_BYTES = 8;

function getUtf8ByteLength(value: string) {
  return new TextEncoder().encode(value).length;
}

function validateDESConfig(config: DESConfig) {
  const keyLength = getUtf8ByteLength(config.secretKey);
  const ivLength = getUtf8ByteLength(config.iv);

  if (keyLength !== DES_BLOCK_SIZE_BYTES) {
    throw new Error("DES secret key must be exactly 8 bytes long.");
  }

  if (ivLength !== DES_BLOCK_SIZE_BYTES) {
    throw new Error("DES IV must be exactly 8 bytes long.");
  }
}

function createDESOptions(config: DESConfig) {
  return {
    iv: CryptoJS.enc.Utf8.parse(config.iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  };
}

export function encryptDES(plaintext: string, config: DESConfig) {
  validateDESConfig(config);

  const key = CryptoJS.enc.Utf8.parse(config.secretKey);
  const encrypted = CryptoJS.DES.encrypt(plaintext, key, createDESOptions(config));

  // Store and transmit only the raw ciphertext bytes, represented as Base64 text.
  return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
}

export function decryptDES(ciphertext: string, config: DESConfig) {
  validateDESConfig(config);

  if (!ciphertext.trim()) {
    throw new Error("Ciphertext is required for DES decryption.");
  }

  const key = CryptoJS.enc.Utf8.parse(config.secretKey);
  const ciphertextBytes = CryptoJS.enc.Base64.parse(ciphertext);
  const cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: ciphertextBytes,
  });
  const decrypted = CryptoJS.DES.decrypt(
    cipherParams,
    key,
    createDESOptions(config),
  );

  return decrypted.toString(CryptoJS.enc.Utf8);
}
