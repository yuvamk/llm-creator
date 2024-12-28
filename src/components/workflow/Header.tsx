import React from 'react';
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onRun: () => void;
  isProcessing: boolean;
}

const Header = ({ onRun, isProcessing }: HeaderProps) => {
  return (
    <div className="h-16 border-b border-gray-200 px-4 flex items-center justify-between bg-white">
      <div className="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><path d="M4 4h4"/><path d="M4 4v4"/><path d="M16 4h4"/><path d="M20 4v4"/><path d="M20 20v-4"/><path d="M20 20h-4"/><path d="M4 20h4"/><path d="M4 20v-4"/><path d="M12 12v8"/><path d="M12 12h8"/><path d="M12 12H4"/></svg>
        <span className="font-semibold">OpenAGI</span>
      </div>
      <div className="flex gap-2">
        <Button variant="outline">Deploy</Button>
        <Button 
          onClick={onRun}
          disabled={isProcessing}
          className="bg-green-600 hover:bg-green-700"
        >
          {isProcessing ? "Running..." : "Run"}
        </Button>
      </div>
    </div>
  );
};

export default Header;