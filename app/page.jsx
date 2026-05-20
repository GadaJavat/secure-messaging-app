"use client";

import { useState } from "react";

import AppTabs from "@/components/AppTabs";
import DemoVersion from "@/components/DemoVersion";
import LiveMessagingApp from "@/components/LiveMessagingApp";
import { useMessages } from "@/hooks/useMessages";

export default function Home() {
  const [activeTab, setActiveTab] = useState("demo");
  const messageStore = useMessages();

  return (
    <AppTabs activeTab={activeTab} onChangeTab={setActiveTab}>
      {activeTab === "demo" ? (
        <DemoVersion messageStore={messageStore} />
      ) : (
        <LiveMessagingApp messageStore={messageStore} />
      )}
    </AppTabs>
  );
}
