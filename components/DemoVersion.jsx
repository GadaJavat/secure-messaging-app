"use client";

import { useCallback } from "react";

import AttackerPanel from "@/components/AttackerPanel";
import DemoLayout from "@/components/DemoLayout";
import EncryptedHistory from "@/components/EncryptedHistory";
import ReceiverPanel from "@/components/ReceiverPanel";
import SenderPanel from "@/components/SenderPanel";
import TransmissionCard from "@/components/TransmissionCard";
import { useDESCrypto } from "@/hooks/useDESCrypto";
import { useMessages } from "@/hooks/useMessages";

export default function DemoVersion() {
  const { messages, addMessage, deleteMessage } = useMessages();
  const { encrypt } = useDESCrypto();
  const latestMessage = messages.at(-1) ?? null;
  const latestCiphertext = latestMessage?.ciphertext ?? latestMessage?.text ?? "";

  const handleEncryptAndSend = useCallback(
    (plaintext) => {
      const ciphertext = encrypt(plaintext);

      addMessage({
        sender: "user-a",
        text: ciphertext,
        ciphertext,
      });

      return ciphertext;
    },
    [addMessage, encrypt],
  );

  return (
    <DemoLayout
      attacker={<AttackerPanel ciphertext={latestCiphertext} />}
      history={<EncryptedHistory messages={messages} />}
      receiver={
        <ReceiverPanel
          messages={messages}
          onDeleteMessage={deleteMessage}
        />
      }
      sender={<SenderPanel onSend={handleEncryptAndSend} />}
      transmission={<TransmissionCard ciphertext={latestCiphertext} />}
    />
  );
}
