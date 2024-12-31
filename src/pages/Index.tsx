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
import InputNode from '@/components/nodes/InputNode';
import LLMNode from '@/components/nodes/LLMNode';
import OutputNode from '@/components/nodes/OutputNode';
import Header from '@/components/workflow/Header';
import Sidebar from '@/components/workflow/Sidebar';
import { WorkflowExecutor } from '@/components/workflow/WorkflowExecutor';
import '@xyflow/react/dist/style.css';

const nodeTypes = {
  input: InputNode,
  llm: LLMNode,
  output: OutputNode,
};

const Index = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isProcessing, setIsProcessing] = useState(false);

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
            model: 'gpt-4o',  // Updated default model
            provider: 'openai',
            temperature: 0.7,
            maxTokens: 1000,
            onApiKeyChange: (value: string) => updateNodeData(`${type}-${nodes.length + 1}`, { apiKey: value }),
            onModelChange: (value: string) => updateNodeData(`${type}-${nodes.length + 1}`, { model: value }),
            onProviderChange: (value: string) => updateNodeData(`${type}-${nodes.length + 1}`, { provider: value }),
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

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header onRun={handleRun} isProcessing={isProcessing} />
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