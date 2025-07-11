import { MetaverseAssetManager } from "@/components/MetaverseAssetManager";
import { AvatarCreator } from "@/components/AvatarCreator";
import { StorageManager } from "@/components/StorageManager";
import { ViewProofSets } from "@/components/ViewProofSets";
import DroneSimDashboard from "@/components/drone-sim/DroneSimDashboard";
import { ReactNode } from "react";

export type ToolConfig = {
  id: string;
  name: string;
  description: string;
  component: ReactNode | null;
};

export const toolsConfig: ToolConfig[] = [
  {
    id: "asset-manager",
    name: "Asset Manager",
    description: "Upload, organize, and manage your metaverse assets.",
    component: <MetaverseAssetManager />
  },
  {
    id: "avatar-creator",
    name: "Avatar Creator",
    description: "Design and customize your cyberpunk avatar.",
    component: <AvatarCreator />
  },
  {
    id: "storage-manager",
    name: "Storage Manager",
    description: "Monitor and manage decentralized storage.",
    component: <StorageManager />
  },
  {
    id: "proof-sets",
    name: "Proof Sets",
    description: "View and manage proof sets for verification.",
    component: <ViewProofSets />
  },
  {
    id: "drone-sim",
    name: "Drone Simulation",
    description: "Simulate and control drones and agents.",
    component: <DroneSimDashboard />
  },
  {
    id: "add-tool",
    name: "Add Tool",
    description: "Integrate external tools or APIs.",
    component: null // Will open external tool integration modal
  }
];