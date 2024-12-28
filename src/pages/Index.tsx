import React, { useState, useCallback, DragEvent } from 'react';
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
import { useToast } from "@/components/ui/use-toast";
import InputNode from '@/components/nodes/InputNode';
import LLMNode from '@/components/nodes/LLMNode';
import OutputNode from '@/components/nodes/OutputNode';
import Header from '@/components/workflow/Header';
import Sidebar from '@/components/workflow/Sidebar';
import '@xyflow/react/dist/style.css';

const nodeTypes = {
  input: InputNode,
  llm: LLMNode,
  output: OutputNode,
};

const Index = () => {
  const { toast } = useToast();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = {
        x: event.clientX - 200,  // Adjust for sidebar width
        y: event.clientY - 64,   // Adjust for header height
      };

      const newNode = {
        id: `${type}-${nodes.length + 1}`,
        type,
        position,
        data: { value: '', onChange: () => {} },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [nodes, setNodes],
  );

  const handleRun = async () => {
    try {
      setIsProcessing(true);
      
      const inputNode = nodes.find((n) => n.type === 'input');
      const llmNode = nodes.find((n) => n.type === 'llm');
      
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

      setNodes((nds) =>
        nds.map((node) => {
          if (node.type === 'output') {
            return {
              ...node,
              data: { ...node.data, value: response },
            };
          }
          return node;
        }),
      );
      
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