import { AgentController } from '../../controllers/agent.controller';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  return await AgentController.createAgent(body);
});
