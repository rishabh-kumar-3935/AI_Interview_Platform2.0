import { useState } from "react";
import axiosInstance from "../api/axios";
import { Loader2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

function AIInterview() {
  const [topic, setTopic] = useState("");
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState("Easy");

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState("");

  const generateQuestions = async (e) => {
  e.preventDefault();

  if (!topic.trim()) {
    toast.error("Please enter a topic.");
    return;
  }

  setLoading(true);

  try {
    const response = await axiosInstance.post("/api/v1/interview/generate", {
      topic,
      difficulty,
      numberOfQuestions: Number(questionCount),
    });

    const generatedQuestions = response?.data?.data?.questions || [];
    setQuestions(generatedQuestions);

    toast.success("Questions generated successfully!");
  } catch (error) {
    console.error(error);

    toast.error(
      error.response?.data?.message || "Failed to generate questions."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-[#050505] text-white flex justify-center py-12 px-4">
      <div className="w-full max-w-3xl bg-zinc-900/40 rounded-3xl border border-zinc-800 p-8">

        <div className="flex items-center gap-3 mb-8">
          <Sparkles className="text-green-500" />
          <h1 className="text-3xl font-bold">
            AI Interview Question Generator
          </h1>
        </div>

        <form
          onSubmit={generateQuestions}
          className="space-y-6"
        >
          <div>
            <label className="block mb-2 text-sm">
              Interview Topic
            </label>

            <input
              type="text"
              placeholder="Example: React, DBMS, Operating System..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full rounded-xl bg-zinc-950 border border-zinc-700 p-4 outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm">
              Number of Questions
            </label>

            <input
              type="number"
              min={1}
              max={30}
              value={questionCount}
              onChange={(e) => setQuestionCount(e.target.value)}
              className="w-full rounded-xl bg-zinc-950 border border-zinc-700 p-4 outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm">
              Difficulty
            </label>

            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full rounded-xl bg-zinc-950 border border-zinc-700 p-4 outline-none"
            >
              <option>Easy</option>
              <option>Moderate</option>
              <option>Tough</option>
            </select>
          </div>

          <button
            disabled={loading}
            className="w-full h-12 rounded-xl bg-green-500 hover:bg-green-600 font-bold text-black flex justify-center items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Generating...
              </>
            ) : (
              "Generate Questions"
            )}
          </button>
        </form>

        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">
            Generated Questions
          </h2>

          <div className="min-h-[220px] rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6">
            {questions && questions.length > 0 ? (
              <ol className="list-decimal space-y-3 pl-5 text-zinc-200 leading-7">
                {questions.map((q, index) => (
                  <li key={`${q}-${index}`} className="pl-1">
                    {q}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-zinc-500">
                Your generated interview questions will appear here after you click generate.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIInterview;