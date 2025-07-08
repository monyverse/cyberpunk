import * as fcl from "@onflow/fcl";

export async function assignMissionOnChain(droneAddress: string, missionId: string) {
  return fcl.mutate({
    cadence: `
      import AgentNPC from 0xAgentNPC
      transaction(drone: Address, missionId: String) {
        prepare(signer: AuthAccount) {
          let agent <- AgentNPC.createAgent()
          agent.assignMission(owner: signer.address, drone: drone, missionId: missionId)
          destroy agent
        }
      }
    `,
    args: (arg, t) => [
      arg(droneAddress, t.Address),
      arg(missionId, t.String)
    ],
    proposer: fcl.currentUser().authorization,
    payer: fcl.currentUser().authorization,
    authorizations: [fcl.currentUser().authorization],
    limit: 100
  });
}

export async function interactWithAgentOnChain(targetAddress: string, message: string) {
  return fcl.mutate({
    cadence: `
      import AgentNPC from 0xAgentNPC
      transaction(target: Address, message: String) {
        prepare(signer: AuthAccount) {
          let agent <- AgentNPC.createAgent()
          agent.interactWith(owner: signer.address, target: target, message: message)
          destroy agent
        }
      }
    `,
    args: (arg, t) => [
      arg(targetAddress, t.Address),
      arg(message, t.String)
    ],
    proposer: fcl.currentUser().authorization,
    payer: fcl.currentUser().authorization,
    authorizations: [fcl.currentUser().authorization],
    limit: 100
  });
} 