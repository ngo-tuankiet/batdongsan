import { AgentController } from '../../controllers/agent.controller';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!;
  return await AgentController.deleteAgent(id);
});
