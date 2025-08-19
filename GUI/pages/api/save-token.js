import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { token } = req.body;
        
        if (!token) {
            return res.status(400).json({ error: 'Token is required' });
        }

        const tokenPath = path.join(process.cwd(), 'token.txt');
        
        // Write token to file
        fs.writeFileSync(tokenPath, token, 'utf8');
        
        res.status(200).json({ 
            success: true, 
            message: 'Token saved successfully' 
        });
    } catch (error) {
        console.error('Error saving token:', error);
        res.status(500).json({ error: 'Failed to save token' });
    }
} 