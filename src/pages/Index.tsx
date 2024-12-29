import React, { useState, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
} from '@xyflow/react';
import { Send, MessageSquare, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import InputNode from '@/components/nodes/InputNode';
import LLMNode from '@/components/nodes/LLMNode';
import OutputNode from '@/components/nodes/OutputNode';
import { WorkflowExecutor } from '@/components/workflow/WorkflowExecutor';
import '@xyflow/react/dist/style.css';

const nodeTypes = {
  input: InputNode,
  llm: LLMNode,
  output: OutputNode,
};

const ChatHistory = [
  { id: 1, title: "New Conversation", icon: MessageSquare },
  { id: 2, title: "Create 10 poems for a scenar..", icon: MessageSquare },
  { id: 3, title: "Generate a poem on designin..", icon: MessageSquare },
  { id: 4, title: "Create 5 liner poem", icon: MessageSquare },
  { id: 5, title: "Create a rich in metaphor po..", icon: MessageSquare },
];

const Index = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const [isDeployed, setIsDeployed] = useState(false);

  const { handleRun } = WorkflowExecutor({ nodes, setNodes, setIsProcessing });

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const updateNodeData = (nodeId: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, ...newData } };
        }
        return node;
      }),
    );
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = {
        x: event.clientX - 200,
        y: event.clientY - 64,
      };

      let newNode;
      if (type === 'input') {
        newNode = {
          id: `${type}-${nodes.length + 1}`,
          type,
          position,
          data: { 
            value: '',
            onChange: (value: string) => updateNodeData(`${type}-${nodes.length + 1}`, { value }),
          },
        };
      } else if (type === 'llm') {
        newNode = {
          id: `${type}-${nodes.length + 1}`,
          type,
          position,
          data: {
            apiKey: '',
            model: 'gpt-4',
            temperature: 0.7,
            maxTokens: 1000,
            onApiKeyChange: (value: string) => updateNodeData(`${type}-${nodes.length + 1}`, { apiKey: value }),
            onModelChange: (value: string) => updateNodeData(`${type}-${nodes.length + 1}`, { model: value }),
            onTemperatureChange: (value: number) => updateNodeData(`${type}-${nodes.length + 1}`, { temperature: value }),
            onMaxTokensChange: (value: number) => updateNodeData(`${type}-${nodes.length + 1}`, { maxTokens: value }),
          },
        };
      } else if (type === 'output') {
        newNode = {
          id: `${type}-${nodes.length + 1}`,
          type,
          position,
          data: { value: '' },
        };
      }

      if (newNode) {
        setNodes((nds) => nds.concat(newNode));
      }
    },
    [nodes, setNodes],
  );

  const handleDeploy = () => {
    setIsDeployed(true);
  };

  if (isDeployed) {
    return (
      <div className="flex h-screen bg-white">
        {/* Sidebar */}
        <div className="w-72 bg-[#F1F0FB] p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-lg">O</span>
            </div>
            <span className="text-xl font-semibold">OpenAGI</span>
          </div>
          
          <Button variant="outline" className="mb-6 gap-2">
            <Plus className="w-4 h-4" />
            Start new chat
          </Button>

          <div className="space-y-4">
            <p className="text-sm text-gray-500 font-medium px-2">CHAT HISTORY</p>
            {ChatHistory.map((chat) => (
              <button
                key={chat.id}
                className="flex items-center gap-2 w-full px-2 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <chat.icon className="w-4 h-4 text-blue-500" />
                <span className="text-sm truncate">{chat.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <header className="border-b p-4 flex justify-end items-center">
            <div className="flex items-center gap-2">
              <span className="text-lg">✏️</span>
              <h1 className="text-xl font-semibold">AI Assistant</h1>
            </div>
          </header>

          <main className="flex-1 flex flex-col p-8">
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4 max-w-2xl">
                <h2 className="text-2xl font-bold">Ask the AI Assistant Anything</h2>
                <p className="text-gray-600">
                  Ask me anything, and I'll do my best to provide you with{" "}
                  <a href="#" className="text-blue-500">accurate</a>, and{" "}
                  <a href="#" className="text-blue-500">helpful information</a>, whether you're looking for answers,{" "}
                  <a href="#" className="text-blue-500">guidance</a>, or just curious about the world around you.
                </p>
              </div>
            </div>

            <div className="border-t pt-4 px-4">
              <div className="max-w-4xl mx-auto flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message"
                  className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <Button className="bg-green-600 hover:bg-green-700">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <Button onClick={handleDeploy}>Deploy</Button>
          <Button onClick={handleRun} disabled={isProcessing}>
            Run Workflow
          </Button>
        </div>
        <div className="flex-1 bg-gray-50">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDragOver={onDragOver}
            onDrop={onDrop}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background />
            <Controls />
            <MiniMap />
            
            {nodes.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                  </div>
                  <p className="text-gray-600">Drag & drop to get started</p>
                </div>
              </div>
            )}
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};

export default Index;
