import { PropertyController } from '../../controllers/property.controller';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!;
  const body = await readBody(event);
  return await PropertyController.updateProperty(id, body);
});
