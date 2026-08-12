import { Bot, User } from "lucide-react";

function ChatMessage({ sender, message }) {
  const isUser = sender === "user";

  return (
    <div
      className={`flex items-start gap-4 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
          <Bot size={20} className="text-black" />
        </div>
      )}

      <div
        className={`max-w-[75%] rounded-3xl px-5 py-4 whitespace-pre-wrap leading-7 shadow-sm ${
          isUser
            ? "bg-green-500 text-black rounded-br-md"
            : "bg-zinc-900 border border-zinc-800 text-white rounded-bl-md"
        }`}
      >
        {message}
      </div>

      {isUser && (
        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
          <User size={20} />
        </div>
      )}
    </div>
  );
}

export default ChatMessage;