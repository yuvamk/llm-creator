import { useToast } from "@/hooks/use-toast";
import { APIService } from "@/services/api-service";
import { validateApiKey, Node } from "@/utils/workflow-utils";

interface WorkflowExecutorProps {
  nodes: Node[];
  setNodes: (nodes: Node[]) => void;
  setIsProcessing: (isProcessing: boolean) => void;
}

export const WorkflowExecutor = ({ nodes, setNodes, setIsProcessing }: WorkflowExecutorProps) => {
  const { toast } = useToast();

  const handleRun = async () => {
    const inputNode = nodes.find((n) => n.type === 'input');
    const llmNode = nodes.find((n) => n.type === 'llm');
    
    try {
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

      const provider = llmNode.data.provider || 'openai';
      
      if (!validateApiKey(llmNode.data.apiKey, provider)) {
        return;
      }

      setIsProcessing(true);
      setNodes(APIService.setOutputLoading(nodes, true));

      let responseText: string;

      if (provider === 'openai') {
        responseText = await APIService.callOpenAI(inputNode.data.value, llmNode);
      } else {
        responseText = await APIService.callGemini(inputNode.data.value, llmNode.data.apiKey);
      }

      setNodes(APIService.updateOutput(nodes, responseText, provider));
      
      toast({
        title: "Success",
        description: "Response generated successfully",
      });
    } catch (error: any) {
      console.error('API Error:', error);
      
      const errorMessage = error?.message || "An unexpected error occurred";
      const currentProvider = llmNode?.data.provider || 'openai';
      
      setNodes(APIService.updateOutput(nodes, `Error: ${errorMessage}`, currentProvider));
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsProcessing(false);
      setNodes(APIService.setOutputLoading(nodes, false));
    }
  };

  return { handleRun };
};