import { useToast } from "@/hooks/use-toast";
import OpenAI from 'openai';
import { handleOpenAIError } from "@/utils/openai-errors";

interface Node {
  id: string;
  type: string;
  data: {
    value?: string;
    apiKey?: string;
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
          description: "Please enter your OpenAI API key",
        });
        return;
      }

      setIsProcessing(true);
      setOutputLoading(true);

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

      const response = completion.choices[0]?.message?.content || "No response generated";

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
      const errorMessage = handleOpenAIError(error);
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