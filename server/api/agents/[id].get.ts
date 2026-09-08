import { AgentController } from '../../controllers/agent.controller';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!;
  const agent = await AgentController.getAgentById(id);
  if (!agent) {
    throw createError({ statusCode: 404, message: 'Không tìm thấy thông tin chuyên viên!' });
  }
  return agent;
});
