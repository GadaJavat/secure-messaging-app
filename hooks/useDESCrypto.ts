"use client";

import { useCallback, useMemo } from "react";

import { decryptDES, encryptDES, type DESConfig } from "@/lib/crypto";

const DEMO_DES_CONFIG: DESConfig = {
  secretKey: "deskey12",
  iv: "initvect",
};

function readDESConfigFromEnv(): DESConfig {
  const secretKey = process.env.NEXT_PUBLIC_DES_SECRET_KEY;
  const iv = process.env.NEXT_PUBLIC_DES_IV;

  if (secretKey && iv) {
    return {
      secretKey,
      iv,
    };
  }

  // Classroom fallback so Vercel previews can build even before env vars are set.
  return DEMO_DES_CONFIG;
}

export function useDESCrypto() {
  const config = useMemo(() => readDESConfigFromEnv(), []);

  const encrypt = useCallback(
    (plaintext: string) => encryptDES(plaintext, config),
    [config],
  );

  const decrypt = useCallback(
    (ciphertext: string) => decryptDES(ciphertext, config),
    [config],
  );

  return {
    encrypt,
    decrypt,
  };
}
