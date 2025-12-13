import React, { useState } from 'react';
import { validateKey } from '../services/api';


interface ApiKeyInputProps {
    onKeyValidated: (key: string) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onKeyValidated }) => {
    const [key, setKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!key.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const isValid = await validateKey(key);
            if (isValid) {
                onKeyValidated(key);
            } else {
                setError('Invalid API Key. Please check and try again.');
            }
        } catch (err) {
            setError('Connection failed. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card fade-in">
            <h1>Enter API Key</h1>
            <p>Securely access the document RAG system.</p>

            <form onSubmit={handleSubmit} className="auth-form">
                <div className="input-group">
                    <input
                        type="password"
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                        placeholder="Gemini API Key"
                        className="input-field"
                        disabled={loading}
                    />
                </div>

                {error && <div className="error-msg">⚠️ {error}</div>}

                <button type="submit" className="btn full-width" disabled={loading || !key}>
                    {loading ? <div className="spinner" /> : 'Validate Key'}
                </button>
            </form>
        </div>
    );
};

export default ApiKeyInput;
