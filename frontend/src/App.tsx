import React, { useState, useEffect } from 'react';
import { getSessionId, getNewSessionId, clearSession } from './services/api';
import ApiKeyInput from './components/ApiKeyInput';
import FileUpload from './components/FileUpload';
import ChatInterface from './components/ChatInterface';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isKeyValid, setIsKeyValid] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [fileName, setFileName] = useState<string>('');

  useEffect(() => {
    const init = async () => {
      const existingSession = getSessionId();
      if (existingSession) {
        try {
          await clearSession('');
        } catch {
          // Ignore errors during cleanup
        }
      }
      getNewSessionId();
    };
    init();
  }, []);

  const handleKeyValidated = (key: string) => {
    setApiKey(key);
    setIsKeyValid(true);
  };

  const handleUploadSuccess = (name: string) => {
    setFileName(name);
    setFileUploaded(true);
  };

  const handleReset = async () => {
    await clearSession(apiKey);
    getNewSessionId();
    setApiKey('');
    setIsKeyValid(false);
    setFileUploaded(false);
    setFileName('');
  };

  return (
    <div className="app-wrapper">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1>QueryDoc</h1>
          <p>Secure AI Document Assistant</p>
        </div>
        <button onClick={handleReset} className="btn btn-ghost">
          ↺ Reset Session
        </button>
      </header>

      {/* Main Content */}
      <div className="main-grid">

        {/* Left Panel: Configuration */}
        <aside className="left-panel">
          <ApiKeyInput
            onKeyValidated={handleKeyValidated}
            locked={isKeyValid}
          />
        </aside>

        {/* Right Panel: Dynamic Interaction */}
        <main className="right-panel">
          {!fileUploaded ? (
            <FileUpload
              apiKey={apiKey}
              enabled={isKeyValid}
              onUploadSuccess={handleUploadSuccess}
            />
          ) : (
            <ChatInterface
              apiKey={apiKey}
              fileName={fileName}
            />
          )}
        </main>

      </div>
    </div>
  );
};

export default App;
