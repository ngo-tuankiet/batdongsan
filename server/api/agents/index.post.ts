import { AgentController } from '../../controllers/agent.controller';
import { requireAdminAuth } from '../../utils/auth';

export default defineEventHandler(async (event) => {
  requireAdminAuth(event);
  const body = await readBody(event);
  return await AgentController.createAgent(body);
});
