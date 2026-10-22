import { PropertyController } from '../../controllers/property.controller';
import { requireAdminAuth } from '../../utils/auth';

export default defineEventHandler(async (event) => {
  requireAdminAuth(event);
  const body = await readBody(event);
  return await PropertyController.createProperty(body);
});
