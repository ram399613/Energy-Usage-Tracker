/**
 * AI Chatbot Logic
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

const handleChat = (query, state) => {
    appendMsg(query, 'user');
    showTyping();

    setTimeout(() => {
        removeTyping();
        const response = getAIResponse(query, state);
        appendMsg(response, 'ai');
    }, 1500);
};

const getAIResponse = (query, state) => {
    const q = query.toLowerCase();
    const active = state.devices.filter(d => d.status === 'Active' || d.status === 'ON');
    const total = active.reduce((sum, d) => sum + d.usage, 0);

    if (q.includes('usage') || q.includes('power')) {
        return `Current grid load is ${total.toFixed(2)} kW. ${active.length} smart nodes are active.`;
    }
    if (q.includes('save')) {
        return "To optimize, I recommend enabling Eco-Mode on your AC and scheduling your Water Heater for off-peak hours.";
    }
    if (q.includes('highest') || q.includes('top')) {
        const top = [...state.devices].sort((a,b) => b.usage - a.usage)[0];
        return `The ${top.name} is currently the highest consumer at ${top.usage} kW.`;
    }
    return "I have analyzed your request against the current grid telemetry. Everything appears within normal operating parameters.";
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
    typing.innerText = 'Nexus is analyzing...';
    chatBox.appendChild(typing);
    chatBox.scrollTop = chatBox.scrollHeight;
};

const removeTyping = () => {
    document.getElementById('typing-indicator')?.remove();
};
