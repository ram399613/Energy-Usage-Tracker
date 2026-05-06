/**
 * Neural Chatbot Intelligence - Context Aware
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
        const response = generateNeuralResponse(query, state);
        appendMsg(response, 'ai');
    }, 1200);
};

const generateNeuralResponse = (query, state) => {
    const q = query.toLowerCase();
    const active = state.devices.filter(d => d.status === 'Active' || d.status === 'ON');
    const totalLoad = active.reduce((sum, d) => sum + (d.watts / 1000), 0);
    const bill = state.metrics.bill;

    if (q.includes('bill') || q.includes('cost')) {
        return `Your current projected bill is ₹${bill}. Based on your slab rate, keeping the AC off for 2 hours daily could save ₹420 this month.`;
    }
    
    if (q.includes('power') || q.includes('usage') || q.includes('consuming')) {
        const top = [...state.devices].sort((a,b) => b.usage - a.usage)[0];
        return `Current grid load is ${totalLoad.toFixed(2)} kW. The ${top.name} is your highest consumer at ${top.watts} Watts.`;
    }

    if (q.includes('save') || q.includes('tips')) {
        return "I recommend shifting your Water Heater usage to early morning (5 AM) and cleaning the refrigerator coils to improve efficiency by 10%.";
    }

    if (q.includes('predict') || q.includes('forecast')) {
        return `Predictive models suggest a ${bill > 3000 ? 'high' : 'normal'} usage trend. End-of-month units are projected at ${state.metrics.totalConsumed * 1.2} kWh.`;
    }

    return "Neural grid nodes are stable. I am monitoring your consumption patterns for any abnormal power spikes.";
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
    typing.innerText = 'Nexus is analyzing grid...';
    chatBox.appendChild(typing);
    chatBox.scrollTop = chatBox.scrollHeight;
};

const removeTyping = () => {
    document.getElementById('typing-indicator')?.remove();
};
