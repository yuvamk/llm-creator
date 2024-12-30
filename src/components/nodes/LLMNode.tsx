import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface LLMNodeProps {
  data: {
    apiKey: string;
    model: string;
    provider: string;
    temperature: number;
    maxTokens: number;
    onApiKeyChange: (value: string) => void;
    onModelChange: (value: string) => void;
    onProviderChange: (value: string) => void;
    onTemperatureChange: (value: number) => void;
    onMaxTokensChange: (value: number) => void;
  };
}

const LLMNode: React.FC<LLMNodeProps> = ({ data }) => {
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
    <Card className="node-card">
      <div className="node-header">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><path d="M4 4h4"/><path d="M4 4v4"/><path d="M16 4h4"/><path d="M20 4v4"/><path d="M20 20v-4"/><path d="M20 20h-4"/><path d="M4 20h4"/><path d="M4 20v-4"/><path d="M12 12v8"/><path d="M12 12h8"/><path d="M12 12H4"/></svg>
        <span>LLM Engine</span>
      </div>
      <div className="node-content">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Provider</Label>
            <RadioGroup
              value={data.provider}
              onValueChange={data.onProviderChange}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="openai" id="openai" />
                <Label htmlFor="openai">ChatGPT</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="gemini" id="gemini" />
                <Label htmlFor="gemini">Gemini</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>API Key</Label>
            <Input
              type="password"
              placeholder={data.provider === 'openai' ? "sk-..." : "Enter Gemini API key"}
              value={data.apiKey}
              onChange={(e) => {
                const key = e.target.value;
                if (validateApiKey(key, data.provider)) {
                  data.onApiKeyChange(key);
                }
              }}
            />
          </div>

          {data.provider === 'openai' && (
            <div className="space-y-2">
              <Label>Model</Label>
              <Select value={data.model} onValueChange={data.onModelChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label>Temperature ({data.temperature})</Label>
            <Input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={data.temperature}
              onChange={(e) => data.onTemperatureChange(parseFloat(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label>Max Tokens</Label>
            <Input
              type="number"
              value={data.maxTokens}
              onChange={(e) => data.onMaxTokensChange(parseInt(e.target.value))}
            />
          </div>
        </div>
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </Card>
  );
};

export default LLMNode;