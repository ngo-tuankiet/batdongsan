import { AuthController } from '../../controllers/auth.controller';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const result = await AuthController.login(body);
  if (result && result.token) {
    setCookie(event, 'bds_admin_token', result.token, {
      path: '/',
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'lax',
    });
  }
  return result;
});
