import { requestJson } from './httpClient';

// AuthenticationController: /auth/login → { username, msg, token }
export const authApi = {
  login: ({ username, password }) => requestJson('/auth/login', { method: 'POST', body: { username, password }, authenticated: false })
};
