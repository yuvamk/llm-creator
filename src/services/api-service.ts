import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { toast } from "@/hooks/use-toast";
import { Node } from '@/utils/workflow-utils';

export class APIService {
  static async callOpenAI(inputText: string, llmNode: Node): Promise<string> {
    const openai = new OpenAI({
      apiKey: llmNode.data.apiKey,
      dangerouslyAllowBrowser: true,
    });

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: inputText }],
      model: llmNode.data.model || 'gpt-4',
      temperature: llmNode.data.temperature || 0.7,
      max_tokens: llmNode.data.maxTokens || 1000,
    });

    return completion.choices[0]?.message?.content || "No response generated";
  }

  static async callGemini(inputText: string, apiKey: string): Promise<string> {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(inputText);
    const response = await result.response;
    return response.text();
  }

  static updateOutput(nodes: Node[], response: string, provider: string): Node[] {
    const formattedResponse = `Generated Output (via ${provider}):\n\n${response}`;
    return nodes.map((node) => {
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
    });
  }

  static setOutputLoading(nodes: Node[], isLoading: boolean): Node[] {
    return nodes.map((node) => {
      if (node.type === 'output') {
        return {
          ...node,
          data: { ...node.data, isLoading },
        };
      }
      return node;
    });
  }
}