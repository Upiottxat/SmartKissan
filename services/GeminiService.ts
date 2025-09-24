// app/services/GeminiService.ts (New Version)

// ... (keep the StreamCallback interface)

const YOUR_BACKEND_URL = 'https://smart-crop-advisory-backend-5yqc.vercel.app/api/krishimitra/chat';

export const GeminiService = {
  async streamChatResponse(
    { messageText, imageAsset, langInstruction }: { messageText: string; imageAsset?: any; langInstruction: string },
    callbacks: StreamCallback
  ) {
    try {
      const response = await fetch(YOUR_BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          image: imageAsset?.base64, // Send base64 string
          mimeType: imageAsset?.mimeType,
          language: langInstruction,
        }),
      });

      if (!response.body) {
          throw new Error("Streaming not supported or response has no body.");
      }

      // Read the stream from your backend
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        fullResponse += chunk;
        callbacks.onChunk(fullResponse);
      }

      callbacks.onComplete(fullResponse);

    } catch (error) {
      console.error("Backend Service Error:", error);
      callbacks.onError(error as Error);
    }
  },
};