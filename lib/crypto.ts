import CryptoJS from "crypto-js";

export type DESConfig = {
  secretKey: string;
  iv: string;
};

type CryptoWordArray = ReturnType<typeof CryptoJS.enc.Base64.parse>;

const DES_BLOCK_SIZE_BYTES = 8;
const ENCRYPTED_PAYLOAD_SEPARATOR = ":";

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

function createDESOptions(iv: CryptoWordArray) {
  return {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  };
}

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function createRandomIV() {
  const ivBytes = new Uint8Array(DES_BLOCK_SIZE_BYTES);

  globalThis.crypto.getRandomValues(ivBytes);

  return CryptoJS.enc.Hex.parse(bytesToHex(ivBytes));
}

function formatBytePairs(wordArray: CryptoWordArray) {
  const hexValue = wordArray.toString(CryptoJS.enc.Hex).toUpperCase();

  return hexValue.match(/.{1,2}/g)?.join(" ") ?? "";
}

function parseStoredPayload(payload: string) {
  const normalizedPayload = payload.trim();
  const [storedIv, storedCiphertext, unexpectedSegment] = normalizedPayload.split(
    ENCRYPTED_PAYLOAD_SEPARATOR,
  );

  if (storedIv && storedCiphertext && unexpectedSegment === undefined) {
    const iv = CryptoJS.enc.Base64.parse(storedIv);

    if (iv.sigBytes !== DES_BLOCK_SIZE_BYTES) {
      throw new Error("Encrypted payload IV must be exactly 8 bytes long.");
    }

    return {
      iv,
      ciphertext: CryptoJS.enc.Base64.parse(storedCiphertext),
      includesIv: true,
    };
  }

  return {
    iv: null,
    ciphertext: CryptoJS.enc.Base64.parse(normalizedPayload),
    includesIv: false,
  };
}

function parseEncryptedPayload(payload: string, config: DESConfig) {
  const storedPayload = parseStoredPayload(payload);

  return {
    ...storedPayload,
    iv: storedPayload.iv ?? CryptoJS.enc.Utf8.parse(config.iv),
  };
}

export function encryptDES(plaintext: string, config: DESConfig) {
  validateDESConfig(config);

  const key = CryptoJS.enc.Utf8.parse(config.secretKey);
  const iv = createRandomIV();
  const encrypted = CryptoJS.DES.encrypt(plaintext, key, createDESOptions(iv));
  const storedIv = iv.toString(CryptoJS.enc.Base64);
  const storedCiphertext = encrypted.ciphertext.toString(CryptoJS.enc.Base64);

  // Store both byte arrays as Base64 text so JSON/localStorage can carry them safely.
  return `${storedIv}${ENCRYPTED_PAYLOAD_SEPARATOR}${storedCiphertext}`;
}

export function encodeCiphertextAsBytePairs(ciphertext: string) {
  if (!ciphertext.trim()) {
    return "";
  }

  const encryptedPayload = parseStoredPayload(ciphertext);
  const ciphertextBytePairs = formatBytePairs(encryptedPayload.ciphertext);

  if (!encryptedPayload.includesIv || !encryptedPayload.iv) {
    return ciphertextBytePairs;
  }

  return `IV ${formatBytePairs(encryptedPayload.iv)} | CT ${ciphertextBytePairs}`;
}

export function decryptDES(ciphertext: string, config: DESConfig) {
  validateDESConfig(config);

  if (!ciphertext.trim()) {
    throw new Error("Ciphertext is required for DES decryption.");
  }

  const key = CryptoJS.enc.Utf8.parse(config.secretKey);
  const encryptedPayload = parseEncryptedPayload(ciphertext, config);
  const cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: encryptedPayload.ciphertext,
  });
  const decrypted = CryptoJS.DES.decrypt(
    cipherParams,
    key,
    createDESOptions(encryptedPayload.iv),
  );

  return decrypted.toString(CryptoJS.enc.Utf8);
}
