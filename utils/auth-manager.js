import axios from 'axios';
import Cookies from 'js-cookie';

/**
 * Auto token management utility
 */
export class AuthManager {
  
  /**
   * Get current token from cookies
   */
  static getToken() {
    return Cookies.get('authToken');
  }

  /**
   * Check if token exists and is valid format
   */
  static isTokenValid(token) {
    if (!token) return false;
    
    // Clean the token
    const cleanToken = token.trim().replace(/\s+/g, '');
    
    // JWT should have 3 parts
    const parts = cleanToken.split('.');
    return parts.length === 3;
  }

  /**
   * Get a fresh token automatically
   */
  static async getNewToken() {
    try {
      console.log('🔄 Getting fresh token...');
      
      const response = await axios.post('/api/auth/token', {}, {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const token = response.data.access_token;
      if (!token) {
        throw new Error('No token received from server');
      }

      // Clean the token
      const cleanToken = token.trim().replace(/\s+/g, '');
      
      // Validate JWT format
      if (!this.isTokenValid(cleanToken)) {
        throw new Error('Received invalid JWT token format');
      }

      // Save to cookies and localStorage
      Cookies.set('authToken', cleanToken, { 
        expires: 1, 
        path: '/', 
        sameSite: 'lax' 
      });
      Cookies.set('authMethod', 'api_key', { 
        expires: 1, 
        path: '/', 
        sameSite: 'lax' 
      });
      localStorage.setItem('authToken', cleanToken);
      localStorage.setItem('authMethod', 'api_key');
      
      console.log('✅ Fresh token obtained and saved');
      return cleanToken;
      
    } catch (error) {
      console.error('❌ Failed to get fresh token:', error);
      throw error;
    }
  }

  /**
   * Ensure we have a valid token, get new one if needed
   */
  static async ensureValidToken() {
    let token = this.getToken();
    
    // If no token or invalid format, get a new one
    if (!this.isTokenValid(token)) {
      console.log('⚠️ No valid token found, getting new one...');
      token = await this.getNewToken();
    }
    
    return token;
  }

  /**
   * Auto-retry API calls with token refresh
   */
  static async apiCallWithTokenRefresh(apiCall) {
    try {
      // First try with current token
      const token = await this.ensureValidToken();
      return await apiCall(token);
      
    } catch (error) {
      // If 401 or token error, try refreshing token
      if (error.response?.status === 401 || 
          error.message?.includes('JWT') || 
          error.message?.includes('token')) {
        
        console.log('🔄 Token error detected, refreshing...');
        
        try {
          const newToken = await this.getNewToken();
          return await apiCall(newToken);
        } catch (refreshError) {
          console.error('❌ Token refresh failed:', refreshError);
          // Redirect to login
          window.location.href = '/authentication/sign-in';
          throw refreshError;
        }
      }
      
      throw error;
    }
  }
}

export default AuthManager;