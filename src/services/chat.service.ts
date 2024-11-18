import axios from "axios";
import { env } from "@/helpers/env";
import { GoogleGenerativeAI } from "@google/generative-ai";

export class ChatService {
  private germini: GoogleGenerativeAI;

  constructor() {
    this.germini = new GoogleGenerativeAI(env.GERMINI_API_KEY);
  }

  async sendMessage(message: string): Promise<string> {
    try {
      const model = this.germini.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(message);
  
      return result.response.text();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(
          "Error communicating with Germini API:",
          error.response.data
        );
        return "I'm sorry, I'm having trouble understanding you right now.";
      } else {
        console.error("Unexpected error:", error);
        return "I'm sorry, I'm having trouble understanding you right now.";
      }
    }
  }
}