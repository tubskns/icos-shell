import axios from 'axios';
import https from 'https';
import config from '../../../config.js';
import { saveTokenToConfigFile } from '../../../utils/token-manager.js';

// Authenticate against ICOS Shell and return api_key token
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, password, otp } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: 'username and password are required' });
    }

    const loginUrl = `${config.controllerAddress}${config.apiEndpoints.userLogin}`;

    const params = { username, password };
    if (otp) params.otp = otp;

    const response = await axios.get(loginUrl, {
      params,
      headers: { 'Accept': 'application/json' },
      timeout: config.controllerTimeout,
      httpsAgent: new https.Agent({ rejectUnauthorized: false, timeout: config.controllerTimeout })
    });

    // Shell returns a token string; normalize to { access_token }
    const tokenString = typeof response.data === 'string' ? response.data : (response.data?.token || response.data?.access_token);
    if (!tokenString) {
      return res.status(500).json({ error: 'Invalid login response from Shell' });
    }

    const cleanToken = String(tokenString).trim();
    saveTokenToConfigFile(cleanToken);

    return res.status(200).json({ access_token: cleanToken, method: 'shell', timestamp: new Date().toISOString() });
  } catch (error) {
    const status = error.response?.status || 500;
    return res.status(status).json({ error: error.response?.data || error.message });
  }
}