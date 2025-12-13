import React, { useState, useRef, useEffect } from 'react';
import { askQuestion } from '../services/api';
import type { ChatMessage } from '../types';

interface ChatInterfaceProps {
    apiKey: string;
    onClearSession: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ apiKey, onClearSession }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const question = input.trim();
        setInput('');

        // Add user message
        const userMsg: ChatMessage = { role: 'user', content: question };
        setMessages(prev => [...prev, userMsg]);
        setLoading(true);

        try {
            const response = await askQuestion(apiKey, question);
            const aiMsg: ChatMessage = { role: 'model', content: response.answer };
            setMessages(prev => [...prev, aiMsg]);
        } catch (err: any) {
            const errorMsg: ChatMessage = {
                role: 'model',
                content: `Error: ${err.message || 'Something went wrong.'}`
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chat-container fade-in">
            <div className="chat-header glass-card">
                <h1>Document Chat</h1>
                <button onClick={onClearSession} className="btn btn-secondary danger-btn">
                    Clear Session
                </button>
            </div>

            <div className="chat-messages">
                {messages.length === 0 && (
                    <div className="empty-state">
                        <p>Ask a question about your uploaded document to get started.</p>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div key={idx} className={`message-row ${msg.role === 'user' ? 'user-row' : 'model-row'}`}>
                        <div className={`message-bubble ${msg.role}`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="message-row model-row">
                        <div className={`message-bubble model typing`}>
                            <div className="dot"></div><div className="dot"></div><div className="dot"></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area glass-card">
                <form onSubmit={handleSend} className="input-row">
                    <input
                        type="text"
                        className="input-field"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Ask a question..."
                        disabled={loading}
                    />
                    <button type="submit" className="btn" disabled={loading || !input.trim()}>
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatInterface;
