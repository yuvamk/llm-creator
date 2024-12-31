import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { toast } from "@/hooks/use-toast";
import { Node } from '@/utils/workflow-utils';

export class APIService {
  static async callOpenAI(inputText: string, llmNode: Node): Promise<string> {
    try {
      const openai = new OpenAI({
        apiKey: llmNode.data.apiKey,
        dangerouslyAllowBrowser: true,
      });

      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: inputText }],
        model: llmNode.data.model || 'gpt-3.5-turbo',
        temperature: llmNode.data.temperature || 0.7,
        max_tokens: llmNode.data.maxTokens || 1000,
      });

      return completion.choices[0]?.message?.content || "No response generated";
    } catch (error: any) {
      // Handle quota exceeded error
      if (error.status === 429) {
        throw new Error("API quota exceeded. Please check your OpenAI billing details.");
      }
      // Handle model not found error
      if (error.status === 404) {
        throw new Error("Invalid model selected. Please choose a different model.");
      }
      // Handle other errors
      throw new Error(error.message || "An error occurred while calling OpenAI API");
    }
  }

  static async callGemini(inputText: string, apiKey: string): Promise<string> {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(inputText);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      throw new Error(error.message || "An error occurred while calling Gemini API");
    }
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