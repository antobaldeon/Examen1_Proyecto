const isLocalBrowser =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') &&
  window.location.port !== '' &&
  window.location.port !== '80' &&
  window.location.port !== '8061';

export const API_URL = isLocalBrowser ? 'http://localhost:8061/api/v1' : '/api/v1';
