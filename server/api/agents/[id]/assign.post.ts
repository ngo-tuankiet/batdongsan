import { AgentController } from '../../../controllers/agent.controller';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!;
  const body = await readBody(event);
  const propertyIds = body.propertyIds || [];
  return await AgentController.assignProperties(id, propertyIds);
});
