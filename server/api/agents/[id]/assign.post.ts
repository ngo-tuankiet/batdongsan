import { AgentController } from '../../../controllers/agent.controller';
import { requireAdminAuth } from '../../../utils/auth';

export default defineEventHandler(async (event) => {
  requireAdminAuth(event);
  const id = getRouterParam(event, 'id')!;
  const body = await readBody(event);
  const propertyIds = body.propertyIds || [];
  return await AgentController.assignProperties(id, propertyIds);
});
