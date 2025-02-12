import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './style.css'; // import the CSS file

const ChatPage: React.FC = () => {
  const [question, setQuestion] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<{
    userQuestion: string;
    aiResponse: string;
  }[]>([]);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:8080/api/chat/history/${userId}`)
        .then((res) => res.json())
        .then((data) => setChatHistory(data))
        .catch((err) => console.error("Error fetching chat history:", err));
    }
  }, [userId]);

  const askQuestion = async () => {
    if (!userId) {
      alert("Please log in first");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/chat/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: { id: Number(userId) },
          userQuestion: question,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setChatHistory((prev) => [...prev, data]);
        setQuestion("");
      } else {
        alert("Error getting response");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/users/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        localStorage.removeItem("userId");
        navigate("/login");
      } else {
        alert("Logout failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="ask">
      <h2>Chat with AI</h2>
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>

      {/* Move chat history here */}
      <h3>Chat History</h3>
      <ul>
        {chatHistory.map((chat, index) => (
          <li key={index} className="chat-item">
            <div className="user-question">
              <strong>You:</strong> {chat.userQuestion}
            </div>
            <div className="ai-response">
              <strong>AI:</strong> {chat.aiResponse}
            </div>
          </li>
        ))}
      </ul>

      {/* Ask question input below */}
      <div className="chat-container">
        <input
          type="text"
          placeholder="Ask a question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button onClick={askQuestion}>Send</button>
      </div>
    </div>
  );
};

export default ChatPage;
