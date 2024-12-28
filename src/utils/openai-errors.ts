export const handleOpenAIError = (error: any) => {
  if (error.status === 429) {
    if (error.body?.includes("insufficient_quota")) {
      return "Your OpenAI API key has exceeded its quota. Please check your billing details.";
    }
    return "Too many requests. Please try again later.";
  }
  
  if (error.message?.includes("api key")) {
    return "Invalid API key. Please check your OpenAI API key.";
  }
  
  return error.message || "An error occurred while processing your request.";
};