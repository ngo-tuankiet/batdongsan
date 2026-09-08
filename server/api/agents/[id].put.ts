import { AgentController } from '../../controllers/agent.controller';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!;
  const body = await readBody(event);
  return await AgentController.updateAgent(id, body);
});
