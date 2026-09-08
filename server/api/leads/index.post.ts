import { LeadController } from '../../controllers/lead.controller';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  return await LeadController.createLead(body);
});
