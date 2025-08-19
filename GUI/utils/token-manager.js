import fs from 'fs';
import path from 'path';

/**
 * Save token to config_local.yml in the format compatible with your curl command
 * @param {string} token - The JWT token to save
 */
export const saveTokenToConfigFile = (token) => {
  try {
    // Clean the token and ensure it's a single line without any extra characters
    const cleanToken = token.trim().replace(/\s+/g, '');
    const configContent = `# config_local.yml\n${cleanToken}`;
    const configPath = path.join(process.cwd(), 'config_local.yml');
    fs.writeFileSync(configPath, configContent);
    console.log('✅ Token saved to config_local.yml');
    return true;
  } catch (error) {
    console.error('⚠️ Could not save to config_local.yml:', error.message);
    return false;
  }
};

/**
 * Read token from config_local.yml
 * @returns {string|null} - The token or null if not found
 */
export const readTokenFromConfigFile = () => {
  try {
    const configPath = path.join(process.cwd(), 'config_local.yml');
    const content = fs.readFileSync(configPath, 'utf8');
    const lines = content.split('\n');
    // Get the second line (index 1) which contains the token and clean it
    const token = lines[1];
    if (!token) return null;
    
    // Clean the token - remove any whitespace and extra characters
    const cleanToken = token.trim().replace(/\s+/g, '').replace(/%$/, '');
    return cleanToken || null;
  } catch (error) {
    console.error('⚠️ Could not read from config_local.yml:', error.message);
    return null;
  }
};

/**
 * Validate JWT token format
 * @param {string} token - The JWT token to validate
 * @returns {boolean} - True if token format is valid
 */
export const validateJWTFormat = (token) => {
  if (!token) return false;
  
  // JWT should have 3 parts separated by dots
  const parts = token.split('.');
  if (parts.length !== 3) {
    console.error('❌ JWT token malformed: token contains an invalid number of segments');
    return false;
  }
  
  // Each part should be base64 encoded (basic check)
  try {
    for (let i = 0; i < parts.length; i++) {
      if (parts[i].length === 0) {
        console.error(`❌ JWT token malformed: segment ${i + 1} is empty`);
        return false;
      }
    }
    return true;
  } catch (error) {
    console.error('❌ JWT token validation failed:', error.message);
    return false;
  }
};

/**
 * Test if the token format works with your curl command
 * @returns {boolean} - True if format is correct
 */
export const testTokenFormat = () => {
  try {
    const token = readTokenFromConfigFile();
    if (!token) return false;
    
    // Validate JWT format
    if (!validateJWTFormat(token)) {
      console.error('❌ Token format validation failed');
      return false;
    }
    
    // Test the same command format you use
    console.log('🧪 Testing token format for curl command:');
    console.log(`TOKEN=$(cat config_local.yml | head -n 2 | tail -n 1)`);
    console.log(`Token extracted: ${token.substring(0, 20)}...`);
    console.log('✅ Token format is valid');
    
    return true;
  } catch (error) {
    console.error('⚠️ Token format test failed:', error.message);
    return false;
  }
}; 