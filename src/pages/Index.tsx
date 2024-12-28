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
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import InputNode from '@/components/nodes/InputNode';
import LLMNode from '@/components/nodes/LLMNode';
import OutputNode from '@/components/nodes/OutputNode';
import '@xyflow/react/dist/style.css';

type NodeData = {
  value?: string;
  onChange?: (value: string) => void;
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  onApiKeyChange?: (value: string) => void;
  onModelChange?: (value: string) => void;
  onTemperatureChange?: (value: number) => void;
  onMaxTokensChange?: (value: number) => void;
}

const nodeTypes = {
  input: InputNode,
  llm: LLMNode,
  output: OutputNode,
};

const initialNodes = [];

const Index = () => {
  const { toast } = useToast();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const updateNodeData = useCallback((nodeId: string, newData: Partial<NodeData>) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: { ...node.data, ...newData },
          };
        }
        return node;
      }),
    );
  }, [setNodes]);

  const handleRun = async () => {
    try {
      setIsProcessing(true);
      
      const inputNode = nodes.find((n) => n.id === 'input-1');
      const llmNode = nodes.find((n) => n.id === 'llm-1');
      
      if (!inputNode?.data.value) {
        throw new Error("Please enter an input question");
      }

      if (!llmNode?.data.apiKey) {
        throw new Error("Please enter your OpenAI API key");
      }

      const response = await new Promise<string>((resolve) => {
        setTimeout(() => {
          resolve(`This is a simulated response to: ${inputNode.data.value}`);
        }, 1000);
      });

      updateNodeData('output-1', { value: response });
      
      toast({
        title: "Success",
        description: "Workflow executed successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  React.useEffect(() => {
    const inputHandler = (value: string) => updateNodeData('input-1', { value });
    const apiKeyHandler = (value: string) => updateNodeData('llm-1', { apiKey: value });
    const modelHandler = (value: string) => updateNodeData('llm-1', { model: value });
    const temperatureHandler = (value: number) => updateNodeData('llm-1', { temperature: value });
    const maxTokensHandler = (value: number) => updateNodeData('llm-1', { maxTokens: value });

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === 'input-1') {
          return {
            ...node,
            data: { ...node.data, onChange: inputHandler },
          };
        }
        if (node.id === 'llm-1') {
          return {
            ...node,
            data: {
              ...node.data,
              onApiKeyChange: apiKeyHandler,
              onModelChange: modelHandler,
              onTemperatureChange: temperatureHandler,
              onMaxTokensChange: maxTokensHandler,
            },
          };
        }
        return node;
      }),
    );
  }, [setNodes, updateNodeData]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <h2 className="text-lg font-semibold mb-4">Components</h2>
        <p className="text-sm text-gray-500 mb-4">Drag and Drop</p>
        <div className="space-y-2">
          <div className="p-3 bg-white border rounded-lg shadow-sm cursor-move flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12h-8"/><path d="M12 19h8"/><path d="M12 5h8"/><path d="M3 19h4"/><path d="M3 12h4"/><path d="M3 5h4"/></svg>
            <span>Input</span>
          </div>
          <div className="p-3 bg-white border rounded-lg shadow-sm cursor-move flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><path d="M4 4h4"/><path d="M4 4v4"/><path d="M16 4h4"/><path d="M20 4v4"/><path d="M20 20v-4"/><path d="M20 20h-4"/><path d="M4 20h4"/><path d="M4 20v-4"/><path d="M12 12v8"/><path d="M12 12h8"/><path d="M12 12H4"/></svg>
            <span>LLM Engine</span>
          </div>
          <div className="p-3 bg-white border rounded-lg shadow-sm cursor-move flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12h-8"/><path d="M21 19h-8"/><path d="M21 5h-8"/><path d="M7 19V5"/><path d="M3 19V5"/></svg>
            <span>Output</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 border-b border-gray-200 px-4 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><path d="M4 4h4"/><path d="M4 4v4"/><path d="M16 4h4"/><path d="M20 4v4"/><path d="M20 20v-4"/><path d="M20 20h-4"/><path d="M4 20h4"/><path d="M4 20v-4"/><path d="M12 12v8"/><path d="M12 12h8"/><path d="M12 12H4"/></svg>
            <span className="font-semibold">OpenAGI</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Deploy</Button>
            <Button 
              onClick={handleRun}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? "Running..." : "Run"}
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 bg-gray-50">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
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