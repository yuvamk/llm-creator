import { toast } from "@/hooks/use-toast";

export const validateApiKey = (apiKey: string, provider: string): boolean => {
  if (!apiKey) {
    toast({
      variant: "destructive",
      title: "Configuration Error",
      description: "Please enter your API key",
    });
    return false;
  }

  if (provider === 'openai' && !apiKey.startsWith('sk-')) {
    toast({
      variant: "destructive",
      title: "Invalid API Key",
      description: "OpenAI API key should start with 'sk-'. Please check your API key.",
    });
    return false;
  }

  if (provider === 'gemini' && apiKey.startsWith('sk-')) {
    toast({
      variant: "destructive",
      title: "Invalid API Key",
      description: "You're using an OpenAI API key with Gemini. Please provide a valid Gemini API key.",
    });
    return false;
  }

  return true;
};

export interface Node {
  id: string;
  type: string;
  data: {
    value?: string;
    apiKey?: string;
    provider?: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
    isLoading?: boolean;
  };
}