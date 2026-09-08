import { PropertyController } from '../../controllers/property.controller';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  return await PropertyController.getProperties(query);
});
