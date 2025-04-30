export const saveConversation = (userInput, aiResponse) => {
    const history = JSON.parse(localStorage.getItem("conversationHistory")) || [];
    history.push({ user: userInput, ai: aiResponse });
    localStorage.setItem("conversationHistory", JSON.stringify(history));
  };
  
  export const getConversationHistory = () => {
    return JSON.parse(localStorage.getItem("conversationHistory")) || [];
  };
  
  export const clearConversationHistory = () => {
    localStorage.removeItem("conversationHistory");
  };
  