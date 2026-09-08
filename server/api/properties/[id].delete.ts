import { PropertyController } from '../../controllers/property.controller';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!;
  return await PropertyController.deleteProperty(id);
});
