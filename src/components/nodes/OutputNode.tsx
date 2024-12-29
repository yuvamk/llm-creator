import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface OutputNodeProps {
  data: {
    value: string;
    isLoading?: boolean;
  };
}

const OutputNode: React.FC<OutputNodeProps> = ({ data }) => {
  return (
    <Card className="node-card">
      <div className="node-header">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12h-8"/><path d="M21 19h-8"/><path d="M21 5h-8"/><path d="M7 19V5"/><path d="M3 19V5"/></svg>
        <span>Output</span>
      </div>
      <div className="node-content">
        <div className="min-h-[100px] p-4 bg-gray-50 rounded-md whitespace-pre-wrap">
          {data.isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-2">Processing...</span>
            </div>
          ) : (
            data.value || "Output will appear here..."
          )}
        </div>
      </div>
      <Handle type="target" position={Position.Left} />
    </Card>
  );
};

export default OutputNode;