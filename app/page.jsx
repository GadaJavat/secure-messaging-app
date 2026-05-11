"use client";

import { useState } from "react";

import AppTabs from "@/components/AppTabs";
import DemoVersion from "@/components/DemoVersion";
import LiveMessagingApp from "@/components/LiveMessagingApp";

export default function Home() {
  const [activeTab, setActiveTab] = useState("demo");

  return (
    <AppTabs activeTab={activeTab} onChangeTab={setActiveTab}>
      {activeTab === "demo" ? <DemoVersion /> : <LiveMessagingApp />}
    </AppTabs>
  );
}
