function toggleChat() {
  const chat = document.getElementById("aiChatBox");
  chat.style.display = chat.style.display === "flex" ? "none" : "flex";
}

async function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value.trim();
  const chatMessages = document.getElementById("chatMessages");

  if (message === "") return;

  // Show user message
  const userDiv = document.createElement("div");
  userDiv.className = "ai-message user";
  userDiv.innerText = message;
  chatMessages.appendChild(userDiv);

  input.value = "";

  // Show typing indicator
  const typingDiv = document.createElement("div");
  typingDiv.className = "ai-message bot";
  typingDiv.innerText = "Typing...";
  chatMessages.appendChild(typingDiv);

  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Call backend
  const response = await fetch("http://localhost:3000/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });

  const data = await response.json();

  typingDiv.remove();

  const botDiv = document.createElement("div");
  botDiv.className = "ai-message bot";
  botDiv.innerText = data.reply;
  chatMessages.appendChild(botDiv);

  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ENTER key support
document.getElementById("userInput").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    sendMessage();
  }
});