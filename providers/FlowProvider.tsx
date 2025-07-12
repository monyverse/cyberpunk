"use client";
import { FC, useEffect } from "react";
import * as fcl from "@onflow/fcl";

fcl.config()
  .put("accessNode.api", "https://rest-mainnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/authn");

const FlowProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Any client-side Flow setup
  }, []);
  return <>{children}</>;
};

export default FlowProvider; 