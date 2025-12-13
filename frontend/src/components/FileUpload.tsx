import React, { useState } from 'react';
import { uploadFile } from '../services/api';

interface FileUploadProps {
    apiKey: string;
    enabled: boolean;
    onUploadSuccess: (filename: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ apiKey, enabled, onUploadSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!enabled) return;

        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type !== 'application/pdf') {
                setError('Only PDF files are allowed.');
                return;
            }

            // Upload immediately on selection
            await processUpload(selectedFile);
        }
    };

    const processUpload = async (file: File) => {
        setLoading(true);
        setError(null);
        try {
            await uploadFile(apiKey, file);
            // Short delay for visual feedback
            setTimeout(() => {
                onUploadSuccess(file.name);
            }, 800);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Upload failed');
            setLoading(false);
        }
    };

    return (
        <div className="upload-container fade-enter">
            <label className={`upload-area ${!enabled ? 'disabled' : ''}`}>
                <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    disabled={!enabled || loading}
                    style={{ display: 'none' }}
                />

                <span className="upload-icon">
                    {loading ? '⏳' : (enabled ? '☁️' : '🔒')}
                </span>

                <h3 className="upload-text-main">
                    {loading ? 'Processing Document...' : (enabled ? 'Click to Upload PDF' : 'Validate Key to Upload')}
                </h3>

                <p className="upload-text-sub">
                    {loading ? 'Please wait while we index the content.' : 'Supported format: .pdf'}
                </p>

                {error && <p style={{ color: 'var(--error)', marginTop: '1rem' }}>{error}</p>}
            </label>
        </div>
    );
};

export default FileUpload;
