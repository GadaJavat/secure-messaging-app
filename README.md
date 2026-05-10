# DES Secure Messaging App

## Project Description

This is a browser-based educational secure messaging demo built with Next.js. It demonstrates how a plaintext message can be encrypted with DES in CBC mode, transmitted as Base64 ciphertext, and decrypted by a receiver who has the same shared secret key.

The app is designed for classroom explanation rather than production security. It uses one single-page simulation with Sender, Transmission, Receiver, and Attacker sections.

## Main Features

- Sender encrypts plaintext.
- Transmission card shows Base64 ciphertext.
- Receiver decrypts ciphertext using the shared key.
- Attacker can only see ciphertext and cannot recover plaintext.
- Encrypted message history is stored locally.
- React Custom Hooks pattern is used.

## Algorithm

DES is a symmetric-key block cipher. It operates on 64-bit blocks and uses a 56-bit effective key.

This project uses:

- DES encryption
- CBC mode
- PKCS7 padding
- Base64 encoding for ciphertext display and storage

DES-CBC encrypts plaintext in blocks. PKCS7 padding is applied when the plaintext does not exactly match the block size. The encrypted bytes are encoded as Base64 so the ciphertext can be displayed, stored, and transmitted as readable text.

## React Design Pattern

The project uses the Custom Hooks pattern to keep UI components clean and focused on rendering.

- `useMessages` handles encrypted message state and `localStorage` persistence.
- `useDESCrypto` exposes `encrypt` and `decrypt` functions.
- `useMessageForm` handles input state and validation.

The low-level DES helper functions live in `lib/crypto.ts`, so encryption logic stays separate from UI components.

## Project Structure

```text
app/
components/
hooks/
lib/
types/
.env.example
```

Important files:

- `app/page.jsx` composes the main demo page.
- `components/` contains the Sender, Transmission, Receiver, Attacker, and history UI.
- `hooks/` contains reusable stateful logic.
- `lib/crypto.ts` contains DES-CBC encryption and decryption helpers.
- `.env.example` documents required environment variables.

## How to Run Locally

Install dependencies:

```bash
npm install
```

Create `.env.local` from `.env.example`, then run:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Environment Variables

Create a `.env.local` file based on `.env.example`.

Required variables:

```env
NEXT_PUBLIC_DES_SECRET_KEY=deskey12
NEXT_PUBLIC_DES_IV=initvect
```

For this project, the DES key and IV must each be exactly 8 bytes.

These variables use the `NEXT_PUBLIC_` prefix because the encryption demo runs in the browser. The app also includes the same demo values as a fallback so Vercel preview builds do not fail if the variables are not configured yet. This is acceptable for a classroom demonstration only. Real secure systems should not expose secret keys in client-side code.

## How to Deploy on Vercel

1. Push the project to GitHub.
2. Open Vercel.
3. Import the GitHub repository.
4. Add the required environment variables in the Vercel project settings:
   - `NEXT_PUBLIC_DES_SECRET_KEY`
   - `NEXT_PUBLIC_DES_IV`
5. Deploy the project.
6. Copy the generated live app URL.

## Testing Checklist

- Send a normal plaintext message.
- Confirm ciphertext appears instead of plaintext.
- Decrypt as receiver.
- Confirm attacker cannot read plaintext.
- Test empty message validation.
- Test spaces-only validation.
- Test special characters.
- Test long messages.
- Refresh the browser and confirm encrypted history remains if `localStorage` is used.

## Security Limitation

DES is outdated and not recommended for real-world security. It is used here only for educational purposes. Modern applications should use stronger algorithms such as AES and proper key management.

This project also exposes the demo key and IV to the browser through `NEXT_PUBLIC_` environment variables. That design is intentionally simple for a classroom demo, but it is not secure for production applications.
