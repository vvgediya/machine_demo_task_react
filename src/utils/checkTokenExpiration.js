import { jwtDecode } from "jwt-decode"
export async function checkTokenExpiration(token) {
  try {
    const decoded = await jwtDecode(token);
    if (!decoded || !decoded.exp) {
      return true;
    }
    const currentTime = Math.floor(Date.now() / 1000); 
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return true;
  }
}
