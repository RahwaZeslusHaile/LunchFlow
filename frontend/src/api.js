const BASE_URL = import.meta.env.VITE_API_URL || "https://cyf-lunch-organizer-backend.hosting.codeyourfuture.io";

export const getApiUrl = (path) => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const finalPath = cleanPath.startsWith('/api') ? cleanPath : `/api${cleanPath}`;
  return `${BASE_URL}${finalPath}`;
};

export default getApiUrl;
