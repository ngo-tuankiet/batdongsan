import { AgentController } from '../../controllers/agent.controller';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  return await AgentController.getAgents(query);
});
