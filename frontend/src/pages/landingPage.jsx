import { Link } from 'react-router-dom';
import { ArrowRight, Brain, FileText, Mic, MessageCircle } from 'lucide-react';

function LandingPage() {
  const features = [
    {
      icon: <FileText size={20} className="text-green-400" />,
      title: 'Check ATS score',
      description: 'Upload your resume and instantly understand how recruiter-friendly it is.',
    },
    {
      icon: <Mic size={20} className="text-green-400" />,
      title: 'Practice interviews',
      description: 'Get interview questions tailored to your goals and improve with confidence.',
    },
    {
      icon: <MessageCircle size={20} className="text-green-400" />,
      title: 'Ask doubts',
      description: 'Clarify concepts and get support whenever you need help preparing.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <main className="mx-auto flex max-w-7xl flex-col px-6 py-24 md:px-10 lg:px-16">
        <section className="grid items-center gap-12 rounded-[2rem] border border-white/10 bg-zinc-900/60 p-8 shadow-2xl shadow-black/30 backdrop-blur md:grid-cols-[1.15fr_0.85fr] md:p-12 lg:p-16">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-sm text-green-300">
              <Brain size={16} />
              Smart interview preparation
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                <span className="text-white">AI</span>{' '}
                <span className="text-green-500">INTERVIEW</span>{' '}
                <span className="text-zinc-300">PLATFORM</span>
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-zinc-400">
                Check your ATS score, practice interviews, and ask your doubts in one place. Build confidence before every opportunity.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-500 px-6 py-3 font-semibold text-black transition hover:bg-green-400"
              >
                Get Started <ArrowRight size={18} />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Login
              </Link>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-black/30 p-6">
            <div className="rounded-[1.25rem] border border-green-500/20 bg-green-500/10 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-300">What you can do</p>
              <div className="mt-6 space-y-4">
                {features.map((feature) => (
                  <div key={feature.title} className="flex items-start gap-3 rounded-2xl bg-zinc-950/70 p-4">
                    <div className="mt-0.5 rounded-xl bg-zinc-800 p-2">{feature.icon}</div>
                    <div>
                      <h3 className="font-semibold text-white">{feature.title}</h3>
                      <p className="mt-1 text-sm text-zinc-400">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default LandingPage;
