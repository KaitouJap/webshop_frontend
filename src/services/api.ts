import { ResponseError } from "../types/Error";

export const baseUrl = "http://localhost:3000/products";
export const authUrl = "http://localhost:3000/auth/login";

export const  apiRequest = async (
  url: string,
  options: RequestInit = {},
  token?: string
): Promise<any> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>), // Include any additional headers passed
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const error: ResponseError = await response.json();
    throw new Error(`${error.message}`);
  }

  if(response.status !== 204)
    return response.json();
  return response;
};