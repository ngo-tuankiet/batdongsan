import { AgentController } from '../../controllers/agent.controller';

export default defineEventHandler(async () => {
  return await AgentController.getAgents();
});
