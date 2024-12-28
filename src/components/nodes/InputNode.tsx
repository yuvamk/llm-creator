import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface InputNodeProps {
  data: {
    value: string;
    onChange: (value: string) => void;
  };
}

const InputNode: React.FC<InputNodeProps> = ({ data }) => {
  return (
    <Card className="node-card">
      <div className="node-header">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12h-8"/><path d="M12 19h8"/><path d="M12 5h8"/><path d="M3 19h4"/><path d="M3 12h4"/><path d="M3 5h4"/></svg>
        <span>Input</span>
      </div>
      <div className="node-content">
        <Input
          placeholder="Enter your question..."
          value={data.value}
          onChange={(e) => data.onChange(e.target.value)}
        />
      </div>
      <Handle type="source" position={Position.Right} />
    </Card>
  );
};

export default InputNode;