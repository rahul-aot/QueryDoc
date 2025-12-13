import React, { useState } from 'react';
import { uploadFile } from '../services/api';

interface FileUploadProps {
    apiKey: string;
    onUploadSuccess: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ apiKey, onUploadSuccess }) => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type !== 'application/pdf') {
                setError('Only PDF files are allowed.');
                setFile(null);
                return;
            }
            setFile(selectedFile);
            setError(null);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setLoading(true);
        setError(null);

        try {
            const response = await uploadFile(apiKey, file);
            setSuccess(response.message || 'File processed successfully!');

            // Navigate after short delay to show success message
            setTimeout(() => {
                onUploadSuccess();
            }, 1500);

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Upload failed');
            setLoading(false); // Only unset loading if error, otherwise we are navigating
        }
    };

    return (
        <div className="glass-card fade-in">
            <h1>Upload Document</h1>
            <p>Upload a PDF to start chatting with it.</p>

            <form onSubmit={handleUpload} className="upload-form">
                <label className={`file-drop-area ${file ? 'has-file' : ''}`}>
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        disabled={loading}
                    />
                    <span className="file-msg">
                        {file ? file.name : 'Click to select a PDF file'}
                    </span>
                </label>

                {error && <div className="error-msg">⚠️ {error}</div>}
                {success && <div className="success-msg">✅ {success}</div>}

                <button type="submit" className="btn full-width" disabled={loading || !file}>
                    {loading ? <div className="spinner" /> : 'Upload and Process'}
                </button>
            </form>
        </div>
    );
};

export default FileUpload;
