import { createServer, statemachineTools } from "staruml-controller-mcp-core"

export function createStatemachineServer() {
    return createServer("staruml-controller-statemachine", "1.0.0", statemachineTools)
}
