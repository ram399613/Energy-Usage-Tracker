/**
 * AI Chatbot Logic - Final Repair
 */

export const initChatbot = (state) => {
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-chat');

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
    const typing = document.createElement('div');
    typing.id = 'typing-indicator';
    typing.className = 'message ai message-typing';
    typing.innerText = 'Nexus is analyzing telemetry...';
    chatBox.appendChild(typing);
    chatBox.scrollTop = chatBox.scrollHeight;
};

const removeTyping = () => {
    document.getElementById('typing-indicator')?.remove();
};
