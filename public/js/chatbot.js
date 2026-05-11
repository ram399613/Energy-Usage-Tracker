/**
 * AI Chatbot Logic - Final Repair
 */

export const initChatbot = (state) => {
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-chat');
    const aiPanel = document.getElementById('ai-panel');
    const toggleBtn = document.getElementById('ai-toggle-btn');
    const closeBtn = document.getElementById('close-ai');

    if (toggleBtn && aiPanel) {
        toggleBtn.onclick = () => {
            aiPanel.classList.remove('hidden');
            toggleBtn.style.display = 'none';
        };
    }

    if (closeBtn && aiPanel) {
        closeBtn.onclick = () => {
            aiPanel.classList.add('hidden');
            if (toggleBtn) toggleBtn.style.display = 'flex';
        };
    }

    if (sendBtn) {
        sendBtn.onclick = () => {
            const val = chatInput.value;
            if (val) handleChat(val, state);
            chatInput.value = '';
        };
    }
};


const handleChat = async (query, state) => {
    appendMsg(query, 'user');
    showTyping();

    try {
        // Real Backend Sync
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, stateContext: state })
        });
        const data = await res.json();
        
        removeTyping();
        document.body.classList.add('ai-is-speaking');
        setTimeout(() => document.body.classList.remove('ai-is-speaking'), 3000);
        appendMsg(data.response, 'ai');
    } catch (e) {
        removeTyping();
        appendMsg("Neural grid link timeout. Error code: 504.", 'ai');
    }
};

const appendMsg = (text, type) => {
    const chatBox = document.getElementById('chat-messages');
    if (!chatBox) return;
    const msg = document.createElement('div');
    msg.className = `message ${type}`;
    msg.innerText = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
};

const showTyping = () => {
    const chatBox = document.getElementById('chat-messages');
    if (!chatBox) return;
    const typing = document.createElement('div');
    typing.id = 'typing-indicator';
    typing.className = 'message ai message-typing';
    typing.innerHTML = 'Nexus is analyzing <div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
    chatBox.appendChild(typing);
    chatBox.scrollTop = chatBox.scrollHeight;
};


const removeTyping = () => {
    document.getElementById('typing-indicator')?.remove();
};
