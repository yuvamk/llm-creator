import { useToast } from "@/hooks/use-toast";
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { handleOpenAIError } from "@/utils/openai-errors";

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

      let response = '';

      if (llmNode.data.provider === 'openai') {
        const openai = new OpenAI({
          apiKey: llmNode.data.apiKey,
          dangerouslyAllowBrowser: true,
          baseURL: 'https://api.openai.com/v1'
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
        const text = result.response.text();
        response = text;
      }

      setNodes(nodes.map((node) => {
        if (node.type === 'output') {
          return {
            ...node,
            data: { ...node.data, value: response, isLoading: false },
          };
        }
        return node;
      }));
      
      toast({
        title: "Success",
        description: "Response generated successfully",
      });
    } catch (error: any) {
      let errorMessage = "An unexpected error occurred";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        if ('error' in error && typeof error.error === 'object' && error.error !== null) {
          errorMessage = error.error.message || errorMessage;
        }
      }

      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });

      setNodes(nodes.map((node) => {
        if (node.type === 'output') {
          return {
            ...node,
            data: { 
              ...node.data, 
              value: `Error: ${errorMessage}`,
              isLoading: false 
            },
          };
        }
        return node;
      }));
    } finally {
      setIsProcessing(false);
      setOutputLoading(false);
    }
  };

  return { handleRun };
};