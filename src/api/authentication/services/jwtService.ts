export function decodeJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string | null): boolean {
  if (!token) return true;

  try {
    const decoded = decodeJwt(token);
    if (!decoded?.exp) return true;

    const expiryDate = new Date(0);
    expiryDate.setUTCSeconds(decoded.exp);
    return expiryDate < new Date();
  } catch (error) {
    return true;
  }
}

export function decodeToken(token: string): any {
  try {
    return decodeJwt(token);
  } catch (error) {
    console.error('Błąd przy dekodowaniu tokenu:', error);
    return null;
  }
}

export function getTokenExpirationTime(token: string): number | null {
  try {
    const decodedToken = decodeJwt(token);
    return decodedToken?.exp ? decodedToken.exp * 1000 : null;
  } catch {
    return null;
  }
}
