"use client";

import React, { useEffect, useState } from "react";
import { connect, keyStores, WalletConnection, Contract, utils } from "near-api-js";
import { Box, Button, TextField, Typography, Paper, List, ListItem, ListItemText, Chip, Divider } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const CONTRACT_ID = "cyberpunktest.testnet"; // <-- replace with your deployed contract account

type Intent = {
  id: number;
  intent: string;
  cross_chain_sig: string;
  fulfilled: boolean;
  result: string;
  submitter: string;
};

export default function NearAgentPage() {
  const [wallet, setWallet] = useState<WalletConnection | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [contract, setContract] = useState<any>(null);
  const [intentInput, setIntentInput] = useState("");
  const [sigInput, setSigInput] = useState("");
  const [resultInput, setResultInput] = useState("");
  const [selectedIntent, setSelectedIntent] = useState<Intent | null>(null);
  const queryClient = useQueryClient();

  // Initialize NEAR connection
  useEffect(() => {
    (async () => {
      const near = await connect({
        networkId: "testnet",
        keyStore: new keyStores.BrowserLocalStorageKeyStore(),
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
      });
      const walletConnection = new WalletConnection(near, "cyberpunk-app");
      setWallet(walletConnection);
      setAccountId(walletConnection.getAccountId() || null);

      const contractInstance = new Contract(walletConnection.account(), CONTRACT_ID, {
        viewMethods: ["get_intents"],
        changeMethods: ["submit_intent", "fulfill_intent"],
      });
      setContract(contractInstance);
    })();
  }, []);

  // Fetch intents with React Query
  const {
    data: intents = [],
    isLoading,
    refetch,
  } = useQuery<Intent[]>({
    queryKey: ["intents", contract],
    queryFn: async () => {
      if (!contract) return [];
      return (await contract.get_intents()) as Intent[];
    },
    enabled: !!contract,
  });

  // Submit intent mutation
  const submitIntentMutation = useMutation({
    mutationFn: async ({ intent, cross_chain_sig }: { intent: string; cross_chain_sig: string }) => {
      if (!contract || !accountId) throw new Error("Not connected");
      await contract.submit_intent(
        { intent, cross_chain_sig },
        "300000000000000",
        utils.format.parseNearAmount("0")
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["intents", contract] });
      setIntentInput("");
      setSigInput("");
    },
    onError: (e: any) => alert("Error submitting intent: " + e?.message || e),
  });

  // Fulfill intent mutation
  const fulfillIntentMutation = useMutation({
    mutationFn: async ({ intent_id, result }: { intent_id: number; result: string }) => {
      if (!contract || !accountId) throw new Error("Not connected");
      await contract.fulfill_intent(
        { intent_id, result },
        "300000000000000",
        utils.format.parseNearAmount("0")
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["intents", contract] });
      setResultInput("");
      setSelectedIntent(null);
    },
    onError: (e: any) => alert("Error fulfilling intent: " + e?.message || e),
  });

  // Wallet connect/disconnect
  const handleLogin = () => wallet?.requestSignIn({ contractId: CONTRACT_ID });
  const handleLogout = () => {
    wallet?.signOut();
    setAccountId(null);
  };

  // Submit intent
  const handleSubmitIntent = () => {
    submitIntentMutation.mutate({ intent: intentInput, cross_chain_sig: sigInput });
  };

  // Fulfill intent
  const handleFulfillIntent = () => {
    if (!selectedIntent) return;
    fulfillIntentMutation.mutate({ intent_id: selectedIntent.id, result: resultInput });
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          NEAR AI Intent Agent
        </Typography>
        <Typography variant="body1" gutterBottom>
          Submit and fulfill intents on NEAR blockchain. Connect your NEAR wallet to get started.
        </Typography>
        <Box sx={{ mt: 2, mb: 2 }}>
          {accountId ? (
            <>
              <Chip label={`Connected: ${accountId}`} color="success" sx={{ mr: 2 }} />
              <Button variant="outlined" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <Button variant="contained" onClick={handleLogin}>Connect NEAR Wallet</Button>
          )}
        </Box>
      </Paper>

      {accountId && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Submit New Intent</Typography>
          <TextField
            label="Intent (description or JSON)"
            value={intentInput}
            onChange={e => setIntentInput(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Cross-chain Signature (optional)"
            value={sigInput}
            onChange={e => setSigInput(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            onClick={handleSubmitIntent}
            disabled={submitIntentMutation.isPending || !intentInput}
          >
            {submitIntentMutation.isPending ? "Submitting..." : "Submit Intent"}
          </Button>
        </Paper>
      )}

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>All Intents</Typography>
          <Button onClick={() => refetch()} disabled={isLoading}>Refresh</Button>
        </Box>
        <List>
          {intents.map((intent) => (
            <React.Fragment key={intent.id}>
              <ListItem
                sx={{ bgcolor: intent.fulfilled ? "#e0ffe0" : "#fff" }}
                secondaryAction={
                  !intent.fulfilled && accountId && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setSelectedIntent(intent)}
                    >
                      Fulfill
                    </Button>
                  )
                }
              >
                <ListItemText
                  primary={
                    <>
                      <b>Intent:</b> {intent.intent}
                      <br />
                      <b>Submitter:</b> {intent.submitter}
                      <br />
                      <b>Signature:</b> {intent.cross_chain_sig || <i>none</i>}
                    </>
                  }
                  secondary={
                    intent.fulfilled
                      ? <span style={{ color: "green" }}>Fulfilled: {intent.result}</span>
                      : <span style={{ color: "orange" }}>Pending</span>
                  }
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {/* Fulfill intent dialog */}
      {selectedIntent && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>Fulfill Intent</Typography>
          <Typography gutterBottom>
            <b>Intent:</b> {selectedIntent.intent}
          </Typography>
          <TextField
            label="Result"
            value={resultInput}
            onChange={e => setResultInput(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            onClick={handleFulfillIntent}
            disabled={fulfillIntentMutation.isPending || !resultInput}
            sx={{ mr: 2 }}
          >
            {fulfillIntentMutation.isPending ? "Fulfilling..." : "Fulfill"}
          </Button>
          <Button variant="outlined" onClick={() => setSelectedIntent(null)}>
            Cancel
          </Button>
        </Paper>
      )}
    </Box>
  );
}