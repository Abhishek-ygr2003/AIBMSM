const API_KEY_STORAGE_KEY = 'gemini-api-key';

export const apiKeyService = {
  getApiKey: (): string | null => {
    try {
      return localStorage.getItem(API_KEY_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to get API key from localStorage", error);
      return null;
    }
  },

  setApiKey: (key: string): void => {
    try {
      localStorage.setItem(API_KEY_STORAGE_KEY, key);
    } catch (error) {
      console.error("Failed to save API key to localStorage", error);
    }
  },

  clearApiKey: (): void => {
    try {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear API key from localStorage", error);
    }
  },
};
