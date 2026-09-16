import { LeadController } from '../../controllers/lead.controller';
import { requireAdminAuth } from '../../utils/auth';

export default defineEventHandler(async (event) => {
  requireAdminAuth(event);
  return await LeadController.getLeads();
});
