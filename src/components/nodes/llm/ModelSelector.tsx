import React from 'react';
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ModelSelectorProps {
  model: string;
  onModelChange: (value: string) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ model, onModelChange }) => {
  return (
    <div className="space-y-2">
      <Label>Model</Label>
      <Select value={model} onValueChange={onModelChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select model" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="gpt-4o">GPT-4 (Best Results)</SelectItem>
          <SelectItem value="gpt-4o-mini">GPT-4 Mini (Fastest)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ModelSelector;