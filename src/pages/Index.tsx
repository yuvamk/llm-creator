import React, { useState, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  Connection,
  Edge,
  useNodesState,
  useEdgesState,
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

const initialNodes = [
  {
    id: 'input-1',
    type: 'input',
    position: { x: 100, y: 100 },
    data: { value: '', onChange: () => {} } as NodeData,
  },
  {
    id: 'llm-1',
    type: 'llm',
    position: { x: 500, y: 100 },
    data: {
      apiKey: '',
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 1000,
      onApiKeyChange: () => {},
      onModelChange: () => {},
      onTemperatureChange: () => {},
      onMaxTokensChange: () => {},
    } as NodeData,
  },
  {
    id: 'output-1',
    type: 'output',
    position: { x: 900, y: 100 },
    data: { value: '' } as NodeData,
  },
];

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

      // Simulate API call (replace with actual OpenAI call)
      const response = await new Promise((resolve) => {
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
    <div className="workflow-container">
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
      </ReactFlow>
      
      <div className="absolute bottom-4 right-4 flex gap-2">
        <Button 
          variant="outline"
          onClick={() => {
            setNodes(initialNodes);
            setEdges([]);
          }}
        >
          Reset
        </Button>
        <Button 
          onClick={handleRun}
          disabled={isProcessing}
        >
          {isProcessing ? "Running..." : "Run Workflow"}
        </Button>
      </div>
    </div>
  );
};

export default Index;