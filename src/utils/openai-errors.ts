export const handleOpenAIError = (error: any) => {
  // Handle quota exceeded error specifically
  if (error.status === 429) {
    if (error.body?.includes("insufficient_quota")) {
      return "Your OpenAI API key has exceeded its quota. Please check your billing details at https://platform.openai.com/account/billing";
    }
    return "Too many requests. Please try again later.";
  }
  
  // Handle invalid API key
  if (error.message?.includes("api key")) {
    return "Invalid API key. Please check your OpenAI API key.";
  }
  
  return error.message || "An error occurred while processing your request.";
};