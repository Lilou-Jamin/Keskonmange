const scheme = import.meta.env.VITE_BACKEND_SCHEME || 'http';
export const backendBaseUrl = `${scheme}://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}`;
