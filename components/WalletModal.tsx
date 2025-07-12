"use client";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import * as fcl from "@onflow/fcl";

function useFlowUser() {
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    fcl.currentUser().subscribe(setUser);
  }, []);
  return user;
}

export default function WalletModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { login, logout, user, ready, authenticated } = usePrivy();
  const flowUser = useFlowUser();

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg focus:outline-none">
          <Dialog.Title className="text-lg font-bold mb-4">Connect Wallet</Dialog.Title>
          <Tabs.Root defaultValue="evm">
            <Tabs.List className="flex gap-2 mb-4">
              <Tabs.Trigger value="evm" className="px-3 py-1 rounded data-[state=active]:bg-black data-[state=active]:text-white">EVM (Privy)</Tabs.Trigger>
              <Tabs.Trigger value="flow" className="px-3 py-1 rounded data-[state=active]:bg-black data-[state=active]:text-white">Flow</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="evm">
              {authenticated ? (
                <div className="flex flex-col gap-2 items-start">
                  <span className="text-sm">Connected: {user?.wallet?.address}</span>
                  <button onClick={logout} className="mt-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Logout</button>
                </div>
              ) : (
                <button onClick={login} disabled={!ready} className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">Connect EVM Wallet</button>
              )}
            </Tabs.Content>
            <Tabs.Content value="flow">
              {flowUser?.addr ? (
                <div className="flex flex-col gap-2 items-start">
                  <span className="text-sm">Connected: {flowUser.addr}</span>
                  <button onClick={() => fcl.unauthenticate()} className="mt-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Logout</button>
                </div>
              ) : (
                <button onClick={() => fcl.authenticate()} className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">Connect Flow Wallet</button>
              )}
            </Tabs.Content>
          </Tabs.Root>
          <Dialog.Close asChild>
            <button className="absolute top-2 right-2 text-gray-500 hover:text-black">×</button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
} 