import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import ModelSelector from './llm/ModelSelector';
import ProviderSelector from './llm/ProviderSelector';
import ApiKeyInput from './llm/ApiKeyInput';

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
  return (
    <Card className="node-card">
      <div className="node-header">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><path d="M4 4h4"/><path d="M4 4v4"/><path d="M16 4h4"/><path d="M20 4v4"/><path d="M20 20v-4"/><path d="M20 20h-4"/><path d="M4 20h4"/><path d="M4 20v-4"/><path d="M12 12v8"/><path d="M12 12h8"/><path d="M12 12H4"/></svg>
        <span>LLM Engine</span>
      </div>
      <div className="node-content">
        <div className="space-y-4">
          <ProviderSelector 
            provider={data.provider}
            onProviderChange={data.onProviderChange}
          />

          <ApiKeyInput
            apiKey={data.apiKey}
            provider={data.provider}
            onApiKeyChange={data.onApiKeyChange}
          />

          {data.provider === 'openai' && (
            <ModelSelector
              model={data.model}
              onModelChange={data.onModelChange}
            />
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