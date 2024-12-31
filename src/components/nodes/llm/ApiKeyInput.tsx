import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface ApiKeyInputProps {
  apiKey: string;
  provider: string;
  onApiKeyChange: (value: string) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ apiKey, provider, onApiKeyChange }) => {
  const { toast } = useToast();

  const validateApiKey = (key: string, provider: string) => {
    if (provider === 'openai' && !key.startsWith('sk-')) {
      toast({
        variant: "destructive",
        title: "Invalid API Key",
        description: "OpenAI API key should start with 'sk-'",
      });
      return false;
    }
    return true;
  };

  return (
    <div className="space-y-2">
      <Label>API Key</Label>
      <Input
        type="password"
        placeholder={provider === 'openai' ? "sk-..." : "Enter Gemini API key"}
        value={apiKey}
        onChange={(e) => {
          const key = e.target.value;
          if (validateApiKey(key, provider)) {
            onApiKeyChange(key);
          }
        }}
      />
    </div>
  );
};

export default ApiKeyInput;