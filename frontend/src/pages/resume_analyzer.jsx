import { useState } from "react";
import { useSelector } from "react-redux";
import { UploadCloud, FileText, Loader2 } from "lucide-react";
import axiosInstance from "../api/axios";
import toast from "react-hot-toast";

function ResumeAnalyzer() {
  const user = useSelector((state) => state.auth.userData);

  const username =
    user?.username || user?.fullName || "User";

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => {
    if (e.target.files.length > 0) {
      setResume(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resume) {
      toast.error("Please upload your resume.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resume);

    try {
      setLoading(true);

      const res = await axiosInstance.post(
        "/api/v1/resume/analyze",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(res.data);

      toast.success("Resume analyzed successfully.");
    } catch (err) {
      console.log(err);
      toast.error("Unable to analyze resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-white px-6 py-12">

      <div className="max-w-6xl mx-auto">


        <div className="mb-12">

          <h1 className="text-4xl font-black">
            Welcome,
            <span className="text-green-500">
              {" "}
              {username}
            </span>
            
          </h1>

          <p className="text-zinc-400 mt-3 max-w-2xl">
            Upload your resume to receive an ATS compatibility
            score, keyword analysis and suggestions for improving
            your chances of getting shortlisted.
          </p>

        </div>

        {/* ATS Benchmarks */}

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">

          <div className="border-b border-zinc-800 px-8 py-5">

            <h2 className="text-xl font-bold">
              ATS Score Benchmarks
            </h2>

          </div>

          <table className="w-full">

            <thead className="bg-zinc-950">

              <tr className="text-zinc-400">

                <th className="text-left p-5">Score</th>

                <th className="text-left">Level</th>

                <th className="text-left">Description</th>

              </tr>

            </thead>

            <tbody>

              <tr className="border-t border-zinc-800">

                <td className="p-5 font-semibold">
                  75–79%
                </td>

                <td className="text-yellow-400 font-semibold">
                  Good
                </td>

                <td className="text-zinc-400">
                  Meets basic ATS requirements but still needs
                  improvements in formatting and keywords.
                </td>

              </tr>

              <tr className="border-t border-zinc-800">

                <td className="p-5 font-semibold">
                  80–89%
                </td>

                <td className="text-green-400 font-semibold">
                  Better
                </td>

                <td className="text-zinc-400">
                  Strong ATS compatibility with a high chance of
                  reaching recruiters.
                </td>

              </tr>

              <tr className="border-t border-zinc-800">

                <td className="p-5 font-semibold">
                  90–95%
                </td>

                <td className="text-blue-400 font-semibold">
                  Best
                </td>

                <td className="text-zinc-400">
                  Excellent resume suitable for top companies and
                  highly competitive positions.
                </td>

              </tr>

            </tbody>

          </table>

        </div>

        {/* Upload */}

        <div className="mt-12 bg-zinc-900 rounded-3xl border border-zinc-800 p-10">

          <h2 className="text-2xl font-bold">
            Resume Analyzer
          </h2>

          <p className="text-zinc-400 mt-2 mb-8">
            You can also check the ATS score of your resume below.
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-8"
          >

            <label
              htmlFor="resume"
              className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-700 rounded-3xl h-72 cursor-pointer hover:border-green-500 transition"
            >

              <UploadCloud
                size={60}
                className="text-green-500 mb-5"
              />

              <h3 className="text-xl font-semibold">
                Drag & Drop Resume
              </h3>

              <p className="text-zinc-500 mt-2">
                or click to browse
              </p>

              <p className="text-sm text-zinc-600 mt-1">
                PDF only
              </p>

              {resume && (

                <div className="mt-8 flex items-center gap-2 text-green-400">

                  <FileText size={20} />

                  {resume.name}

                </div>

              )}

            </label>

            <input
              hidden
              id="resume"
              type="file"
              accept=".pdf"
              onChange={handleFile}
            />

            <button
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-green-500 hover:bg-green-600 text-black font-bold flex justify-center items-center gap-3 transition"
            >

              {loading ? (
                <>
                  <Loader2
                    className="animate-spin"
                    size={20}
                  />
                  Analyzing Resume...
                </>
              ) : (
                "Analyze Resume"
              )}

            </button>

          </form>

        </div>

        {/* Tips */}

        <div className="mt-12 border border-zinc-800 rounded-3xl bg-zinc-900 p-8">

          <h2 className="text-xl font-bold mb-6">
            Before Uploading
          </h2>

          <ul className="space-y-3 text-zinc-400">

            <li>✓ Keep your resume ATS-friendly.</li>

            <li>✓ Include measurable achievements.</li>

            <li>✓ Match skills with the target job.</li>

            <li>✓ Avoid excessive graphics and tables.</li>

            <li>✓ Export your resume as PDF whenever possible.</li>

          </ul>

        </div>

      </div>

    </div>
  );
}

export default ResumeAnalyzer;