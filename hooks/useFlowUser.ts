import { useEffect, useState } from "react";
import * as fcl from "@onflow/fcl";

export function useFlowUser() {
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    fcl.currentUser().subscribe(setUser);
  }, []);
  return user;
} 