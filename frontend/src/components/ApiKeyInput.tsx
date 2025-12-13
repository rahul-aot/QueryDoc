import React, { useState } from 'react';
import { validateKey } from '../services/api';

interface ApiKeyInputProps {
    onKeyValidated: (key: string) => void;
    locked: boolean;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onKeyValidated, locked }) => {
    const [key, setKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!key.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const valid = await validateKey(key);
            if (valid) {
                onKeyValidated(key);
            } else {
                setError('Invalid API Key');
            }
        } catch (err) {
            setError('Connection failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`saas-card fade-enter ${locked ? 'api-status-locked' : ''}`}>
            <div className="card-title">
                <span>API Key Setup</span>
                {locked && (
                    <div className="locked-badge">
                        ✓ Active
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <input
                        type="password"
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                        placeholder="Enter Gemini API Key"
                        className="input-field"
                        disabled={loading || locked}
                    />
                    {error && <p style={{ color: 'var(--error)', fontSize: '0.85rem', marginTop: '0.5rem' }}>{error}</p>}
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || !key || locked}
                    style={{ width: '100%' }}
                >
                    {loading ? 'Validating...' : (locked ? 'Authenticated' : 'Validate Key')}
                </button>
            </form>
        </div>
    );
};

export default ApiKeyInput;
