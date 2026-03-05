import Cookies from 'js-cookie';

const COOKIE_NAME = 'session_token';
const COOKIE_EXPIRATION = 1; // 1 day

/**
 * Save session token to cookies (24 hour expiration)
 */
export function setSessionToken(token) {
  Cookies.set(COOKIE_NAME, token, {
    expires: COOKIE_EXPIRATION,
    secure: true, // HTTPS only
    sameSite: 'strict', // CSRF protection
  });
}

/**
 * Get session token from cookies
 */
export function getSessionToken() {
  return Cookies.get(COOKIE_NAME);
}

/**
 * Remove session token from cookies
 */
export function removeSessionToken() {
  Cookies.remove(COOKIE_NAME);
}

/**
 * Check if session token exists
 */
export function hasSessionToken() {
  return !!getSessionToken();
}

/**
 * Validate token with backend
 */
export async function validateToken(token) {
  try {
    const response = await fetch(`/session/validate_token?token=${token}`);
    if (!response.ok) {
      return { valid: false, user: null };
    }
    const data = await response.json();
    return {
      valid: data.data.valid,
      user: data.data.user,
    };
  } catch (error) {
    console.error('Token validation error:', error);
    return { valid: false, user: null };
  }
}
