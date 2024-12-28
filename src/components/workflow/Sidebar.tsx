import React from 'react';

const Sidebar = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-4">Components</h2>
      <p className="text-sm text-gray-500 mb-4">Drag and Drop</p>
      <div className="space-y-2">
        <div 
          className="p-3 bg-white border rounded-lg shadow-sm cursor-move flex items-center gap-2"
          draggable
          onDragStart={(e) => onDragStart(e, 'input')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12h-8"/><path d="M12 19h8"/><path d="M12 5h8"/><path d="M3 19h4"/><path d="M3 12h4"/><path d="M3 5h4"/></svg>
          <span>Input</span>
        </div>
        <div 
          className="p-3 bg-white border rounded-lg shadow-sm cursor-move flex items-center gap-2"
          draggable
          onDragStart={(e) => onDragStart(e, 'llm')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><path d="M4 4h4"/><path d="M4 4v4"/><path d="M16 4h4"/><path d="M20 4v4"/><path d="M20 20v-4"/><path d="M20 20h-4"/><path d="M4 20h4"/><path d="M4 20v-4"/><path d="M12 12v8"/><path d="M12 12h8"/><path d="M12 12H4"/></svg>
          <span>LLM Engine</span>
        </div>
        <div 
          className="p-3 bg-white border rounded-lg shadow-sm cursor-move flex items-center gap-2"
          draggable
          onDragStart={(e) => onDragStart(e, 'output')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12h-8"/><path d="M21 19h-8"/><path d="M21 5h-8"/><path d="M7 19V5"/><path d="M3 19V5"/></svg>
          <span>Output</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;