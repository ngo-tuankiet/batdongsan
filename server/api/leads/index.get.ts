import { LeadController } from '../../controllers/lead.controller';

export default defineEventHandler(async () => {
  return await LeadController.getLeads();
});
