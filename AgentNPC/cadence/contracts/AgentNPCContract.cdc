access(all) contract AgentNPC {

    access(all) event MissionAssigned(agent: Address, drone: Address, missionId: String)
    access(all) event AgentInteracted(agent: Address, target: Address, message: String)
    access(all) event AgentCreated(agent: Address, agentId: UInt64)

    access(all) var totalAgents: UInt64

    access(all) resource Agent {
        access(all) let id: UInt64
        access(all) var missionCount: UInt64
        access(all) var interactionCount: UInt64
        access(all) var isActive: Bool

        init() {
            self.id = AgentNPC.totalAgents
            self.missionCount = 0
            self.interactionCount = 0
            self.isActive = true
            
            AgentNPC.totalAgents = AgentNPC.totalAgents + 1
        }

        access(all) fun assignMission(owner: Address, drone: Address, missionId: String) {
            pre {
                self.isActive: "Agent is not active"
                missionId.length > 0: "Mission ID cannot be empty"
            }
            
            self.missionCount = self.missionCount + 1
            emit MissionAssigned(agent: owner, drone: drone, missionId: missionId)
        }

        access(all) fun interactWith(owner: Address, target: Address, message: String) {
            pre {
                self.isActive: "Agent is not active"
                message.length > 0: "Message cannot be empty"
            }
            
            self.interactionCount = self.interactionCount + 1
            emit AgentInteracted(agent: owner, target: target, message: message)
        }

        access(all) fun deactivateAgent() {
            self.isActive = false
        }

        access(all) fun reactivateAgent() {
            self.isActive = true
        }

        access(all) fun getAgentStats(): {String: AnyStruct} {
            return {
                "id": self.id,
                "missionCount": self.missionCount,
                "interactionCount": self.interactionCount,
                "isActive": self.isActive
            }
        }
    }

    access(all) fun createAgent(): @Agent {
        let agent <- create Agent()
        emit AgentCreated(agent: self.account.address, agentId: agent.id)
        return <- agent
    }

    access(all) fun getTotalAgents(): UInt64 {
        return self.totalAgents
    }

    init() {
        self.totalAgents = 0
    }
}