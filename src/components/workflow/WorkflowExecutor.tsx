import { useToast } from "@/components/ui/use-toast";
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
  };
}

interface WorkflowExecutorProps {
  nodes: Node[];
  setNodes: (nodes: Node[]) => void;
  setIsProcessing: (isProcessing: boolean) => void;
}

export const WorkflowExecutor = ({ nodes, setNodes, setIsProcessing }: WorkflowExecutorProps) => {
  const { toast } = useToast();

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

      const openai = new OpenAI({
        apiKey: llmNode.data.apiKey,
        dangerouslyAllowBrowser: true,
      });

      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: inputNode.data.value }],
        model: llmNode.data.model || 'gpt-3.5-turbo',
        temperature: llmNode.data.temperature || 0.7,
        max_tokens: llmNode.data.maxTokens || 1000,
      });

      const response = completion.choices[0]?.message?.content || "No response generated";

      setNodes(nodes.map((node) => {
        if (node.type === 'output') {
          return {
            ...node,
            data: { ...node.data, value: response },
          };
        }
        return node;
      }));
      
      toast({
        title: "Success",
        description: "Workflow executed successfully",
      });
    } catch (error: any) {
      const errorMessage = handleOpenAIError(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });

      // Clear output node on error
      setNodes(nodes.map((node) => {
        if (node.type === 'output') {
          return {
            ...node,
            data: { ...node.data, value: `Error: ${errorMessage}` },
          };
        }
        return node;
      }));
    } finally {
      setIsProcessing(false);
    }
  };

  return { handleRun };
};