import { AgentController } from '../../controllers/agent.controller';
import { requireAdminAuth } from '../../utils/auth';

export default defineEventHandler(async (event) => {
  requireAdminAuth(event);
  const id = getRouterParam(event, 'id')!;
  return await AgentController.deleteAgent(id);
});
