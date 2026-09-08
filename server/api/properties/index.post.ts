import { PropertyController } from '../../controllers/property.controller';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  return await PropertyController.createProperty(body);
});
