import { AuthController } from '../../controllers/auth.controller';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  return await AuthController.login(body);
});
