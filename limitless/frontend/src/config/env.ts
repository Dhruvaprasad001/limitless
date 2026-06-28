function required(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env variable: ${key}`);
  return value;
}

function optional(key: string, fallback = ""): string {
  return process.env[key] ?? fallback;
}

export const env = {
  apiBaseUrl: optional("NEXT_PUBLIC_API_BASE_URL", "http://localhost:8000"),
  firebase: {
    apiKey: optional("NEXT_PUBLIC_FIREBASE_API_KEY"),
    authDomain: optional("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
    projectId: optional("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
    appId: optional("NEXT_PUBLIC_FIREBASE_APP_ID"),
  },
} as const;
