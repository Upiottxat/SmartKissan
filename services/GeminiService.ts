/**
 * @interface StreamCallback
 * Defines the callback functions for handling different states of the streaming API response.
 */
interface StreamCallback {
  /**
   * Called whenever a new chunk of text is received from the stream.
   * @param {string} chunk - The new piece of text from the stream.
   */
  onChunk: (chunk: string) => void;

  /**
   * Called when the entire response has been received and the stream is complete.
   * @param {string} finalText - The final, complete text from the stream.
   */
  onComplete: (finalText: string) => void;

  /**
   * Called if an error occurs during the fetch or streaming process.
   * @param {Error} error - The error object that was thrown.
   */
  onError: (error: Error) => void;
}

/**
 * @interface StreamRequestPayload
 * Defines the structure for the data sent to the streaming service.
 */
interface StreamRequestPayload {
  messageText: string;
  imageAsset?: {
    uri: string;
    mimeType?: string;
  };
  langInstruction: string;
}

// --- Configuration ---
// Use your deployed backend URL for production or local IP for development.
const BACKEND_URL = 'https://smart-crop-advisory-backend-4qgs.onrender.com/api/krishimitra/chat';
// const BACKEND_URL = 'http://172.20.116.244:4000/api/krishimitra/chat';


/**
 * @service GeminiService
 * A service object to handle communication with the Gemini-powered backend.
 */
export const GeminiService = {
  /**
   * Initiates a chat request to the backend and streams the response.
   * Handles both text-only and multipart/form-data (image) requests.
   *
   * @param {StreamRequestPayload} payload - The data to be sent to the backend.
   * @param {StreamCallback} callbacks - The callback functions to handle the stream.
   */
  async streamChatResponse(
    { messageText, imageAsset, langInstruction }: StreamRequestPayload,
    callbacks: StreamCallback
  ): Promise<void> {
    try {
      let response: Response;

      // Conditional logic: if an image is provided, send as multipart/form-data.
      // Otherwise, send as a standard JSON payload.
      if (imageAsset) {
        const formData = new FormData();
        formData.append('message', messageText);
        formData.append('language', langInstruction);

        // Append the image file. React Native's FormData handles the format.
        formData.append('image', {
          uri: imageAsset.uri,
          name: 'photo.jpg', // A default name for the file.
          type: imageAsset.mimeType || 'image/jpeg', // Default to jpeg if not specified.
        } as any);

        response = await fetch(BACKEND_URL, {
          method: 'POST',
          body: formData,
          // Do NOT set 'Content-Type' manually for FormData,
          // the fetch client sets the correct boundary.
        });

      } else {
        // For text-only messages, send a JSON payload.
        response = await fetch(BACKEND_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: messageText,
            language: langInstruction,
          }),
        });
      }

      // Check for a successful response and the presence of a response body.
      if (!response.ok) {
        // Try to get a more detailed error message from the backend response
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      // --- Response Processing ---
      // Check if streaming is supported by the environment (i.e., debugger not attached)
      if (response.body) {
        // --- Streaming Path ---
        console.log("Streaming response is available. Processing in chunks.");
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullResponse = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break; // Exit the loop when the stream is finished.
          }
          const chunk = decoder.decode(value, { stream: true });
          fullResponse += chunk;
          callbacks.onChunk(chunk);
        }

        // Final callback when the entire stream has been processed.
        callbacks.onComplete(fullResponse);
      } else {
        // --- Non-Streaming Fallback Path (e.g., when Chrome debugger is active) ---
        console.warn("Streaming not supported, falling back to full response. This is expected when the Chrome debugger is attached.");
        const fullResponse = await response.text();
        // We have the full response at once, so we call onChunk and onComplete together.
        callbacks.onChunk(fullResponse);
        callbacks.onComplete(fullResponse);
      }

    } catch (error) {
      console.error("GeminiService Error:", error);
      callbacks.onError(error as Error);
    }
  },
};

