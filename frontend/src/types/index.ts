export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface AskResponse {
  answer: string;
}

export interface UploadResponse {
  message: string;
  filename: string;
}

export type AppScreen = 'api-key' | 'upload' | 'chat';
