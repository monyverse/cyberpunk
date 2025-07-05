import { PandoraService } from "@filoz/synapse-sdk/pandora";
import { useEthersSigner } from "@/hooks/useEthers";
import { useQuery } from "@tanstack/react-query";
import { CONTRACT_ADDRESSES } from "@filoz/synapse-sdk";
import { useNetwork } from "@/hooks/useNetwork";
import { useAccount } from "wagmi";
import { ProofSetDetails, ProofSetsResponse, Provider } from "@/types";

/**
 * Fetches proofset details from a provider's API
 * @param proofsetId - The ID of the proofset
 * @param pdpUrl - The URL of the provider's API
 * @returns Promise resolving to the proofset details or null if not found
 */
const fetchProofSetDetails = async (
  proofsetId: number,
  pdpUrl: string
): Promise<ProofSetDetails | null> => {
  try {
    if (!pdpUrl.endsWith("/")) {
      pdpUrl = `${pdpUrl}/`;
    }

    const response = await fetch(`${pdpUrl}pdp/proof-sets/${proofsetId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching proofset ${proofsetId}:`, error);
    return null;
  }
};

/**
 * Hook to fetch and manage proof sets
 * @returns Query result containing proof sets and their details
 */
export const useProofsets = () => {
  const signer = useEthersSigner();
  const { data: network } = useNetwork();
  const { address } = useAccount();

  return useQuery<ProofSetsResponse, Error>({
    enabled: !!address,
    queryKey: ["proofsets", address],
    queryFn: async () => {
      if (!network) throw new Error("Network not found");
      if (!signer) throw new Error("Signer not found");
      if (!address) throw new Error("Address not found");

      // Initialize Pandora service
      const pandoraService = new PandoraService(
        signer.provider,
        CONTRACT_ADDRESSES.PANDORA_SERVICE[network]
      );

      // Fetch providers and proof sets in parallel
      const [providers, proofsets] = await Promise.all([
        pandoraService.getAllApprovedProviders(),
        pandoraService.getClientProofSetsWithDetails(address),
      ]);

      // Create a map of provider URLs for quick lookup
      const providerUrlMap = new Map(
        providers.map((provider: Provider) => [provider.owner, provider.pdpUrl])
      );

      // Fetch proofset details in parallel with proper error handling
      const proofsetDetailsPromises = proofsets.map(async (proofset) => {
        const pdpUrl = providerUrlMap.get(proofset.payee);
        if (!pdpUrl) {
          console.warn(`No provider URL found for payee ${proofset.payee}`);
          return {
            proofsetId: proofset.pdpVerifierProofSetId,
            details: null,
            pdpUrl: null,
            provider: null,
          };
        }

        try {
          const details = await fetchProofSetDetails(
            proofset.pdpVerifierProofSetId,
            pdpUrl
          );

          // Find the full provider details
          const provider = providers.find(
            (p: Provider) => p.owner === proofset.payee
          );

          return {
            proofsetId: proofset.pdpVerifierProofSetId,
            details: details ? { ...details, pdpUrl } : null,
            pdpUrl,
            provider,
          };
        } catch (error) {
          console.error(
            `Error fetching details for proofset ${proofset.pdpVerifierProofSetId}:`,
            error
          );
          return {
            proofsetId: proofset.pdpVerifierProofSetId,
            details: null,
            pdpUrl,
            provider:
              providers.find((p: Provider) => p.owner === proofset.payee) ||
              null,
          };
        }
      });

      const proofsetDetailsResults = await Promise.all(proofsetDetailsPromises);

      // Combine proof sets with their details
      const proofsetsWithDetails = proofsets.map((proofset) => {
        const detailsResult = proofsetDetailsResults.find(
          (result) => result.proofsetId === proofset.pdpVerifierProofSetId
        );

        return {
          ...proofset,
          details: detailsResult?.details ?? null,
          pdpUrl: detailsResult?.pdpUrl ?? null,
          provider: detailsResult?.provider ?? null,
        };
      });

      return { proofsets: proofsetsWithDetails };
    },
    retry: false,
    gcTime: 2 * 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};
