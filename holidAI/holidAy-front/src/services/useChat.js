import { useState, useCallback } from "react";

const useChatBotApi = (setData, setFileResponse) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendText = useCallback(
    async (text) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("http://localhost:8000/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: text }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.text();
        console.log("Fetched data:", data);
        setData(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    },
    [setData]
  );

  const sendFile = useCallback(
    async (file) => {
      setLoading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("http://localhost:8000/chat/file", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.text();
        console.log("Fetched data:", data);
        setFileResponse(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    },
    [setFileResponse]
  );

  return { loading, error, sendText, sendFile };
};

export default useChatBotApi;
