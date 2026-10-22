import { PropertyController } from '../../controllers/property.controller';
import { requireAdminAuth } from '../../utils/auth';

export default defineEventHandler(async (event) => {
  requireAdminAuth(event);
  const id = getRouterParam(event, 'id')!;
  return await PropertyController.deleteProperty(id);
});
