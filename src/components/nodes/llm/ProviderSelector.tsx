import React from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ProviderSelectorProps {
  provider: string;
  onProviderChange: (value: string) => void;
}

const ProviderSelector: React.FC<ProviderSelectorProps> = ({ provider, onProviderChange }) => {
  return (
    <div className="space-y-2">
      <Label>Provider</Label>
      <RadioGroup
        value={provider}
        onValueChange={onProviderChange}
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
  );
};

export default ProviderSelector;