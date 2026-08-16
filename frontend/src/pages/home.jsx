import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import {
    FileText,
    TrendingUp,
    Loader2,
    BadgeCheck,
} from "lucide-react";

function Home() {
    const [loading, setLoading] = useState(true);
    const [resume, setResume] = useState(null);

    const fetchLatestResume = async () => {
        try {
           const response = await axiosInstance.get(
    "/api/v1/resume/history"
);

            const resumes = response?.data?.data || [];
            console.log(resumes);
            setResume(resumes[0] || null);
            
        } catch (error) {
            console.log(error);

            if (error.response?.status !== 404) {
                console.error(error);
            }

            setResume(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLatestResume();
    }, []);

    const username =
        resume?.user?.username ||
        localStorage.getItem("username") ||
        "User";

    const score = resume?.atsScore || 0;

    const getPerformance = () => {
        if (score >= 90) {
            return {
                title: "Best",
                color: "text-green-400",
                bg: "bg-green-500/10",
                border: "border-green-500",
            };
        }

        if (score >= 80) {
            return {
                title: "Better",
                color: "text-yellow-400",
                bg: "bg-yellow-500/10",
                border: "border-yellow-500",
            };
        }

        return {
            title: "Good",
            color: "text-red-400",
            bg: "bg-red-500/10",
            border: "border-red-500",
        };
    };

    const performance = getPerformance();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#09090B] flex justify-center items-center text-white">
                <Loader2 className="animate-spin mr-3" />
                Loading dashboard...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#09090B] text-white px-8 py-8">

            {/* Header */}

            <div className="mb-10">

                <h1 className="text-4xl font-bold">
                    Hello,
                    <span className="text-green-500">
                        {" "}
                        {username}
                    </span>
                    👋
                </h1>

                <p className="text-zinc-400 mt-3 text-lg">
                    Welcome back. Here's your latest resume analysis.
                </p>

            </div>

            {!resume ? (
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-12 text-center">

                    <FileText
                        size={70}
                        className="mx-auto text-zinc-500 mb-5"
                    />

                    <h2 className="text-2xl font-semibold">
                        No Resume Found
                    </h2>

                    <p className="text-zinc-400 mt-3">
                        Upload your resume from the Resume Analyzer page
                        to receive an ATS score and personalized feedback.
                    </p>

                </div>
            ) : (
                <>
                    {/* ATS + Resume */}

                    <div className="grid lg:grid-cols-3 gap-7">

                        {/* ATS Score */}

                        <div className="lg:col-span-2 bg-zinc-900 rounded-3xl border border-zinc-800 p-8">

                            <div className="flex items-center gap-3">

                                <TrendingUp className="text-green-400" />

                                <h2 className="text-2xl font-semibold">
                                    ATS Resume Score
                                </h2>

                            </div>

                            <div className="mt-8 flex items-end gap-4">

                                <span className="text-7xl font-bold text-green-400">
                                    {score}
                                </span>

                                <span className="text-3xl text-zinc-500 mb-2">
                                    /100
                                </span>

                            </div>

                            <div className="w-full h-4 bg-zinc-800 rounded-full mt-8 overflow-hidden">

                                <div
                                    className="h-full bg-green-500 rounded-full transition-all duration-700"
                                    style={{
                                        width: `${score}%`,
                                    }}
                                />

                            </div>

                            <div
                                className={`mt-8 rounded-2xl border p-5 ${performance.bg} ${performance.border}`}
                            >
                                <div className="flex items-center gap-2">

                                    <BadgeCheck className={performance.color} />

                                    <span
                                        className={`font-semibold text-lg ${performance.color}`}
                                    >
                                        {performance.title} Performance
                                    </span>

                                </div>

                                <p className="mt-3 text-zinc-300 leading-7">
                                    Your resume currently falls into the{" "}
                                    <span className={performance.color}>
                                        {performance.title}
                                    </span>{" "}
                                    category based on ATS evaluation.
                                </p>

                            </div>

                        </div>





                        {/* Resume Preview */}

                        <div className="bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden">

                            <div className="px-6 py-5 border-b border-zinc-800">

                                <h2 className="text-xl font-semibold">
                                    Resume Preview
                                </h2>

                                <p className="text-sm text-zinc-400 mt-1 truncate">
                                    {resume.resumeName}
                                </p>

                            </div>

                            <object
    data={resume.resumeUrl}
    type="application/pdf"
    className="w-full h-[550px]"
>
    <div className="flex flex-col items-center justify-center h-full p-6">

        <p className="text-zinc-400 mb-4">
            PDF preview not available
        </p>

        <a
            href={resume.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-green-500 text-black rounded-lg"
        >
            Open Resume
        </a>

    </div>
</object>
                        </div>

                    </div>

                    {/* Performance Benchmarks */}

                    <div className="mt-10">

                        <h2 className="text-2xl font-semibold mb-6">
                            Resume Performance Benchmark
                        </h2>

                        <div className="grid md:grid-cols-3 gap-6">

                            {/* Good */}

                            <div
                                className={`rounded-2xl border p-6 transition-all duration-300 ${performance.title === "Good"
                                        ? "border-red-500 bg-red-500/10 shadow-lg shadow-red-500/20"
                                        : "border-zinc-800 bg-zinc-900"
                                    }`}
                            >
                                <div className="flex items-center justify-between">

                                    <h3 className="text-xl font-semibold">
                                        Good
                                    </h3>

                                    {performance.title === "Good" && (
                                        <span className="text-xs bg-red-500 px-3 py-1 rounded-full font-medium">
                                            Current
                                        </span>
                                    )}

                                </div>

                                <p className="text-red-400 font-medium mt-4">
                                    75% – 79%
                                </p>

                                <p className="text-zinc-400 leading-7 mt-4">
                                    Meets the minimum ATS benchmark. Suitable for
                                    startups and mid-sized companies, but adding
                                    stronger keywords and better formatting can
                                    significantly improve your chances.
                                </p>

                            </div>

                            {/* Better */}

                            <div
                                className={`rounded-2xl border p-6 transition-all duration-300 ${performance.title === "Better"
                                        ? "border-yellow-500 bg-yellow-500/10 shadow-lg shadow-yellow-500/20"
                                        : "border-zinc-800 bg-zinc-900"
                                    }`}
                            >
                                <div className="flex items-center justify-between">

                                    <h3 className="text-xl font-semibold">
                                        Better
                                    </h3>

                                    {performance.title === "Better" && (
                                        <span className="text-xs bg-yellow-500 text-black px-3 py-1 rounded-full font-medium">
                                            Current
                                        </span>
                                    )}

                                </div>

                                <p className="text-yellow-400 font-medium mt-4">
                                    80% – 89%
                                </p>

                                <p className="text-zinc-400 leading-7 mt-4">
                                    Strong ATS compatibility. Your resume is likely
                                    to pass applicant tracking systems and receive
                                    recruiter attention at most IT companies.
                                </p>

                            </div>

                            {/* Best */}

                            <div
                                className={`rounded-2xl border p-6 transition-all duration-300 ${performance.title === "Best"
                                        ? "border-green-500 bg-green-500/10 shadow-lg shadow-green-500/20"
                                        : "border-zinc-800 bg-zinc-900"
                                    }`}
                            >
                                <div className="flex items-center justify-between">

                                    <h3 className="text-xl font-semibold">
                                        Best
                                    </h3>

                                    {performance.title === "Best" && (
                                        <span className="text-xs bg-green-500 text-black px-3 py-1 rounded-full font-medium">
                                            Current
                                        </span>
                                    )}

                                </div>

                                <p className="text-green-400 font-medium mt-4">
                                    90% – 95%
                                </p>

                                <p className="text-zinc-400 leading-7 mt-4">
                                    Excellent ATS score. Your resume is highly
                                    competitive for product companies, MNCs and
                                    senior technical positions.
                                </p>

                            </div>

                        </div>

                    </div>






                    {/* Analysis Section */}

                    <div className="grid lg:grid-cols-2 gap-7 mt-10">

                        {/* Strengths */}

                        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-7">

                            <h2 className="text-2xl font-semibold text-green-400 mb-6">
                                Strengths
                            </h2>

                            <ul className="space-y-4">

                                {resume.strengths.map((item, index) => (

                                    <li
                                        key={index}
                                        className="flex items-start gap-3"
                                    >

                                        <span className="mt-1 text-green-500">
                                            ✔
                                        </span>

                                        <p className="text-zinc-300 leading-7">
                                            {item}
                                        </p>

                                    </li>

                                ))}

                            </ul>

                        </div>

                        {/* Weaknesses */}

                        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-7">

                            <h2 className="text-2xl font-semibold text-red-400 mb-6">
                                Areas to Improve
                            </h2>

                            <ul className="space-y-4">

                                {resume.weaknesses.map((item, index) => (

                                    <li
                                        key={index}
                                        className="flex items-start gap-3"
                                    >

                                        <span className="mt-1 text-red-500">
                                            ✖
                                        </span>

                                        <p className="text-zinc-300 leading-7">
                                            {item}
                                        </p>

                                    </li>

                                ))}

                            </ul>

                        </div>

                    </div>

                    {/* Suggestions */}

                    <div className="mt-10 bg-zinc-900 border border-zinc-800 rounded-3xl p-7">

                        <h2 className="text-2xl font-semibold mb-6">
                            AI Suggestions
                        </h2>

                        <div className="space-y-4">

                            {resume.suggestions.map((item, index) => (

                                <div
                                    key={index}
                                    className="flex gap-4 bg-zinc-950 border border-zinc-800 rounded-xl p-5"
                                >

                                    <span className="text-green-500 font-bold">
                                        {index + 1}.
                                    </span>

                                    <p className="text-zinc-300 leading-7">
                                        {item}
                                    </p>

                                </div>

                            ))}

                        </div>

                    </div>

                    {/* Footer */}

                    <div className="mt-8 flex justify-between items-center text-zinc-500 text-sm">

                        <span>
                            Resume Name :
                            <span className="ml-2 text-zinc-300">
                                {resume.resumeName}
                            </span>
                        </span>

                        <span>
                            Last Analyzed :
                            <span className="ml-2 text-zinc-300">
                                {new Date(resume.createdAt).toLocaleDateString()}
                            </span>
                        </span>

                    </div>

                </>
            )}

        </div>
    );
}

export default Home;