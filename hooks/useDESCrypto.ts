"use client";

import { useCallback, useMemo } from "react";

import { decryptDES, encryptDES, type DESConfig } from "@/lib/crypto";

function readDESConfigFromEnv(): DESConfig {
  const secretKey =
    process.env.NEXT_PUBLIC_DES_SECRET_KEY ?? process.env.DES_SECRET_KEY;
  const iv = process.env.NEXT_PUBLIC_DES_IV ?? process.env.DES_IV;

  if (!secretKey || !iv) {
    throw new Error(
      "Missing DES configuration. Add NEXT_PUBLIC_DES_SECRET_KEY and NEXT_PUBLIC_DES_IV to .env.local.",
    );
  }

  return {
    secretKey,
    iv,
  };
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
