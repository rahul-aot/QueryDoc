import React, { useState, useEffect } from 'react';
import type { AppScreen } from './types';
import { getSessionId, getNewSessionId, clearSession } from './services/api';
import ApiKeyInput from './components/ApiKeyInput';
import FileUpload from './components/FileUpload';
import ChatInterface from './components/ChatInterface';

const App: React.FC = () => {
  const [screen, setScreen] = useState<AppScreen>('api-key');
  const [apiKey, setApiKey] = useState<string>('');

  useEffect(() => {
    const init = async () => {
      const existingSession = getSessionId();
      if (existingSession) {
        // Attempt to clear old session data on backend
        // We pass empty string for api key as it's not available on reload
        try {
          await clearSession('');
        } catch (e) {
          console.warn("Failed to clear previous session", e);
        }
      }
      getNewSessionId();
    };
    init();
  }, []);

  const handleKeyValidated = (key: string) => {
    setApiKey(key);
    setScreen('upload');
  };

  const handleUploadSuccess = () => {
    setScreen('chat');
  };

  const handleClearSession = async () => {
    // Clear on backend
    await clearSession(apiKey);
    // Generate new session
    getNewSessionId();
    // Reset state
    setApiKey('');
    setScreen('api-key');
  };

  return (
    <>
      {/* Background is handled in index.css body */}
      {screen === 'api-key' && (
        <ApiKeyInput onKeyValidated={handleKeyValidated} />
      )}
      {screen === 'upload' && (
        <FileUpload apiKey={apiKey} onUploadSuccess={handleUploadSuccess} />
      )}
      {screen === 'chat' && (
        <ChatInterface apiKey={apiKey} onClearSession={handleClearSession} />
      )}
    </>
  );
};

export default App;
