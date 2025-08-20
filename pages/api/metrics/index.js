import axios from 'axios';
import https from 'https';
import config from '../../../config.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = req.headers['api_key'] || req.headers['x-api-key'] || req.headers['authorization'];
  if (!apiKey) {
    return res.status(401).json({ error: 'No api_key provided' });
  }

  try {
    const url = `${config.controllerAddress}${config.apiEndpoints.metricsGet}`;
    const response = await axios.get(url, {
      headers: { 'Content-Type': 'application/json', 'api_key': apiKey },
      timeout: config.controllerTimeout,
      httpsAgent: new https.Agent({ rejectUnauthorized: false, timeout: config.controllerTimeout })
    });
    return res.status(200).json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    return res.status(status).json({ error: error.response?.data || error.message });
  }
}