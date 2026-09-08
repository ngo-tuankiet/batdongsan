import { PropertyController } from '../../controllers/property.controller';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!;
  const prop = await PropertyController.getPropertyById(id);
  if (!prop) {
    throw createError({ statusCode: 404, message: 'Không tìm thấy bất động sản!' });
  }
  return prop;
});
