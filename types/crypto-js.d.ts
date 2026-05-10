declare module "crypto-js" {
  type WordArray = {
    toString: (encoder?: Encoder) => string;
  };

  type Encoder = {
    parse: (value: string) => WordArray;
    stringify: (value: WordArray) => string;
  };

  type CipherParams = {
    ciphertext: WordArray;
  };

  type DESOptions = {
    iv: WordArray;
    mode: unknown;
    padding: unknown;
  };

  const CryptoJS: {
    DES: {
      encrypt: (
        plaintext: string,
        key: WordArray,
        options: DESOptions,
      ) => CipherParams;
      decrypt: (
        cipherParams: CipherParams,
        key: WordArray,
        options: DESOptions,
      ) => WordArray;
    };
    enc: {
      Base64: Encoder;
      Utf8: Encoder;
    };
    lib: {
      CipherParams: {
        create: (params: { ciphertext: WordArray }) => CipherParams;
      };
    };
    mode: {
      CBC: unknown;
    };
    pad: {
      Pkcs7: unknown;
    };
  };

  export default CryptoJS;
}
