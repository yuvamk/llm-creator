import { useToast } from "@/hooks/use-toast";
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Node {
  id: string;
  type: string;
  data: {
    value?: string;
    apiKey?: string;
    provider?: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
    isLoading?: boolean;
  };
}

interface WorkflowExecutorProps {
  nodes: Node[];
  setNodes: (nodes: Node[]) => void;
  setIsProcessing: (isProcessing: boolean) => void;
}

export const WorkflowExecutor = ({ nodes, setNodes, setIsProcessing }: WorkflowExecutorProps) => {
  const { toast } = useToast();

  const setOutputLoading = (isLoading: boolean) => {
    setNodes(nodes.map((node) => {
      if (node.type === 'output') {
        return {
          ...node,
          data: { ...node.data, isLoading },
        };
      }
      return node;
    }));
  };

  const updateOutput = (response: string, provider: string) => {
    const formattedResponse = `Generated Output (via ${provider}):\n\n${response}`;
    setNodes(nodes.map((node) => {
      if (node.type === 'output') {
        return {
          ...node,
          data: { 
            ...node.data, 
            value: formattedResponse,
            isLoading: false 
          },
        };
      }
      return node;
    }));
  };

  const handleRun = async () => {
    try {
      const inputNode = nodes.find((n) => n.type === 'input');
      const llmNode = nodes.find((n) => n.type === 'llm');
      
      if (!inputNode?.data.value?.trim()) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please enter a question",
        });
        return;
      }

      if (!llmNode?.data.apiKey) {
        toast({
          variant: "destructive",
          title: "Configuration Error",
          description: "Please enter your API key",
        });
        return;
      }

      setIsProcessing(true);
      setOutputLoading(true);

      let response: string;
      const provider = llmNode.data.provider || 'openai';

      if (provider === 'openai') {
        const openai = new OpenAI({
          apiKey: llmNode.data.apiKey,
          dangerouslyAllowBrowser: true,
        });

        const completion = await openai.chat.completions.create({
          messages: [{ role: "user", content: inputNode.data.value }],
          model: llmNode.data.model || 'gpt-4',
          temperature: llmNode.data.temperature || 0.7,
          max_tokens: llmNode.data.maxTokens || 1000,
        });

        response = completion.choices[0]?.message?.content || "No response generated";
      } else {
        // Gemini API
        const genAI = new GoogleGenerativeAI(llmNode.data.apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const result = await model.generateContent(inputNode.data.value);
        response = result.response.text();
      }

      updateOutput(response, provider);
      
      toast({
        title: "Success",
        description: "Response generated successfully",
      });
    } catch (error: any) {
      console.error('API Error:', error);
      
      const errorMessage = error?.message || "An unexpected error occurred";
      
      updateOutput(`Error: ${errorMessage}`, llmNode?.data.provider || 'openai');
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsProcessing(false);
      setOutputLoading(false);
    }
  };

  return { handleRun };
};