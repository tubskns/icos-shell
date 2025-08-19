import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const tokenPath = path.join(process.cwd(), 'token.txt');
        
        if (!fs.existsSync(tokenPath)) {
            return res.status(404).json({ error: 'Token file not found' });
        }

        const token = fs.readFileSync(tokenPath, 'utf8').trim();
        
        if (!token) {
            return res.status(404).json({ error: 'Token is empty' });
        }

        res.status(200).json({ token });
    } catch (error) {
        console.error('Error reading token file:', error);
        res.status(500).json({ error: 'Failed to read token file' });
    }
} 