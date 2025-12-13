import React, { useState, useRef, useEffect } from 'react';
import { askQuestion } from '../services/api';
import type { ChatMessage } from '../types';

interface ChatInterfaceProps {
    apiKey: string;
    fileName: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ apiKey, fileName }) => {
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
        <div className="chat-wrapper fade-enter">
            <div className="chat-header-mini">
                <span>Conversing with <strong>{fileName}</strong></span>
                <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>● Active</span>
            </div>

            <div className="chat-messages">
                {messages.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        color: 'var(--text-secondary)',
                        marginTop: '4rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1rem'
                    }}>
                        <div style={{ fontSize: '3rem' }}>💬</div>
                        <p>Ask anything about the document to start.</p>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div key={idx} className={`message-bubble ${msg.role === 'user' ? 'msg-user' : 'msg-model'}`}>
                        {msg.content}
                    </div>
                ))}

                {loading && (
                    <div className="message-bubble msg-model" style={{ width: 'fit-content' }}>
                        <div className="typing-dots">
                            <div className="dot"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-wrapper">
                <form onSubmit={handleSend} className="chat-form">
                    <input
                        type="text"
                        className="input-field"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Type your question here..."
                        disabled={loading}
                    />
                    <button type="submit" className="btn btn-primary" disabled={loading || !input.trim()}>
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatInterface;
