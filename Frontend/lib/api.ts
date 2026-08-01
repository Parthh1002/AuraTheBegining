/**
 * Unified API Client Helper for AURA Backend (Express + PostgreSQL)
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function fetchApi<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  // Attach JWT admin token if available in client localStorage
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('aura-admin-token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const res = await fetch(url, {
    ...options,
    headers,
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(errorBody.error || `API error: ${res.status}`);
  }

  return res.json();
}

/**
 * Upload files to Backend Multer endpoint
 */
export async function uploadFilesApi(files: File[]): Promise<string[]> {
  const url = `${API_BASE_URL}/upload`;
  const formData = new FormData();

  files.forEach((file) => formData.append('files', file));

  const headers: Record<string, string> = {};
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('aura-admin-token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({ error: 'Upload failed' }));
    throw new Error(errData.error || 'File upload failed');
  }

  const data = await res.json();
  return data.urls || [];
}
