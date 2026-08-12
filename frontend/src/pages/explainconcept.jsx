import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../api/axios";
import toast from "react-hot-toast";

import {
  Send,
  Sparkles,
  Loader2,
  BookOpen,
} from "lucide-react";

import ChatMessage from "../components/chatmessage.jsx";

function ExplainConcept() {
  const user = useSelector((state) => state.auth.userData);

  const username =
    user?.username ||
    user?.fullName ||
    "User";

  const [question, setQuestion] = useState("");

  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      message:
        `Hello ${username}! 👋

I'm your AI Learning Assistant.

You can ask me anything related to programming, DSA, DBMS, Operating System, Computer Networks, Java, Python, React, interview preparation, aptitude and much more.

I'll explain every concept in simple language with examples and interview tips.`,
    },
  ]);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const topics = [
    "React",
    "Node.js",
    "Java",
    "Python",
    "DBMS",
    "Operating System",
    "Computer Networks",
    "OOP",
    "DSA",
    "SQL",
    "JavaScript",
    "HR Interview",
  ];

  const suggestedQuestions = [
    "Explain Virtual DOM with an example.",
    "Difference between TCP and UDP.",
    "What is Normalization in DBMS?",
    "Explain Runtime Polymorphism.",
    "Difference between BFS and DFS.",
    "What is JWT Authentication?",
  ];









    const sendMessage = async () => {

    if (!question.trim()) {
      toast.error("Please enter a question.");
      return;
    }

    const userQuestion = question;

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        message: userQuestion,
      },
    ]);

    setQuestion("");

    setLoading(true);

    try {

      const prompt = `
You are an experienced technical mentor.

Explain the following topic in simple English.

Question:
${userQuestion}

Instructions:

1. Keep explanation beginner friendly.

2. Give one real-world example.

3. Mention where this concept is used.

4. Mention interview importance.

5. Use bullet points whenever needed.

6. Avoid unnecessary complexity.
`;

      const response = await axiosInstance.post("/api/v1/concept/ask", {
        question: userQuestion,
      });

      const answer = response?.data?.data?.answer ||
        "Sorry, I couldn't generate an explanation.";

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          message: answer,
        },
      ]);
    } catch (err) {
      console.error(err);

      const message = err?.response?.data?.message || "Unable to contact Gemini. Make sure the backend is running and the Gemini API key is configured.";

      toast.error(message);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          message,
        },
      ]);
    }

    setLoading(false);
  };



  return (
  <div className="min-h-screen bg-[#09090B] text-white">

    {/* Header */}

    <div className="max-w-7xl mx-auto px-6 py-10">

      <div className="mb-10">

        <h1 className="text-4xl font-black tracking-tight">
          Hello,
          <span className="text-green-500"> {username}</span> 👋
        </h1>

        <p className="mt-4 text-zinc-400 text-lg max-w-3xl leading-8">
          How can I help you today?
        </p>

        <p className="mt-2 text-zinc-500 max-w-3xl leading-7">
          Ask any programming, aptitude, interview, or computer science
          concept. I'll explain it in simple language with examples,
          real-world analogies, interview tips and best practices.
        </p>

      </div>

      {/* Popular Topics */}

      <div className="mb-10">

        <div className="flex items-center gap-3 mb-5">

          <Sparkles className="text-green-500" size={20} />

          <h2 className="font-bold text-xl">
            Popular Topics
          </h2>

        </div>

        <div className="flex flex-wrap gap-3">

          {topics.map((topic) => (

            <button
              key={topic}
              onClick={() => setQuestion(topic)}
              className="px-5 py-2 rounded-full bg-zinc-900 border border-zinc-800 hover:border-green-500 hover:text-green-400 transition"
            >
              {topic}
            </button>

          ))}

        </div>

      </div>

      {/* Main Grid */}

      <div className="grid lg:grid-cols-4 gap-8">

        {/* Chat Section */}

        <div className="lg:col-span-3 bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">

          <div className="border-b border-zinc-800 p-6 flex items-center gap-3">

            <BookOpen
              size={22}
              className="text-green-500"
            />

            <div>

              <h2 className="font-bold text-xl">
                AI Learning Assistant
              </h2>

              <p className="text-sm text-zinc-500">
                Powered by Gemini AI
              </p>

            </div>

          </div>

          {/* Messages */}

          <div className="h-[520px] overflow-y-auto px-6 py-6 space-y-6">

            {messages.map((msg, index) => (

              <ChatMessage
                key={index}
                sender={msg.sender}
                message={msg.message}
              />

            ))}

            {loading && (

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">

                  <Loader2
                    className="animate-spin text-black"
                    size={20}
                  />

                </div>

                <div className="bg-zinc-800 px-5 py-4 rounded-3xl">

                  Gemini is thinking...

                </div>

              </div>

            )}

            <div ref={chatEndRef} />

          </div>

          {/* Input */}

          <div className="border-t border-zinc-800 p-5">

            <div className="flex gap-4">

              <input
                value={question}
                onChange={(e) =>
                  setQuestion(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
                placeholder="Ask your question here..."
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 outline-none focus:border-green-500 transition"
              />

              <button
                onClick={sendMessage}
                disabled={loading}
                className="w-16 rounded-2xl bg-green-500 hover:bg-green-600 flex justify-center items-center transition"
              >

                <Send
                  size={22}
                  className="text-black"
                />

              </button>

            </div>

          </div>

        </div>

        {/* Right Side */}

        <div className="space-y-6">

          {/* Suggestions */}

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">

            <h3 className="font-bold text-lg mb-5">

              Suggested Questions

            </h3>

            <div className="space-y-3">

              {suggestedQuestions.map((item) => (

                <button
                  key={item}
                  onClick={() => setQuestion(item)}
                  className="w-full text-left p-4 rounded-xl bg-zinc-950 hover:border-green-500 border border-transparent transition text-sm text-zinc-300 hover:text-white"
                >
                  {item}
                </button>

              ))}

            </div>

          </div>

          {/* About */}

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">

            <h3 className="font-bold text-lg mb-4">

              What I Can Help With

            </h3>

            <ul className="space-y-3 text-sm text-zinc-400 leading-6">

              <li>✓ Explain technical concepts.</li>

              <li>✓ Solve interview doubts.</li>

              <li>✓ Programming examples.</li>

              <li>✓ Aptitude explanations.</li>

              <li>✓ HR interview guidance.</li>

              <li>✓ Real-world analogies.</li>

              <li>✓ Best practices & tips.</li>

            </ul>

          </div>

        </div>

      </div>

    </div>

  </div>
);

}



export default ExplainConcept;