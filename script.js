



 
  
const inputArea = document.querySelector('.input-area');
    const inputField = document.getElementById('input-field');
    const sendButton = document.getElementById('send-button');
    const messageArea = document.getElementById('message-area');
    const clearChatButton = document.getElementById('clear-chat');

    const messages = JSON.parse(localStorage.getItem('chatHistory')) || [];

    function renderMessages() {
      messageArea.innerHTML = '';
      messages.forEach(({ type, content }) => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', type);
        messageDiv.innerHTML = content;
        messageArea.appendChild(messageDiv);
      });
      
      window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth'
  });
    }

    renderMessages();

    async function sendMessage() {
      const userInput = inputField.value.trim();
      if (!userInput) return;

      inputField.value = '';
      messages.push({ type: 'sent', content: userInput });
      renderMessages();

      try {
 const responseText = await fetch('/api/greet', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userInput }),
        });
        messages.push({ type: 'received', content: responseText });
        renderMessages();
        localStorage.setItem('chatHistory', JSON.stringify(messages));
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }

    sendButton.addEventListener('click', sendMessage);
    inputField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    clearChatButton.addEventListener('click', () => {
      localStorage.removeItem('chatHistory');
      messages.length = 0;
      renderMessages();
    });
   
