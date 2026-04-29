import { Briefcase, FileText, Search, Sparkles } from "lucide-react";

function Hero() {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-blue-50/40">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-16 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-100/40 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-20 pb-16 md:pt-24 md:pb-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-2">
          <Sparkles className="h-4 w-4" />
          AI Job Assistant
        </div>

        <h1 className="mt-6 max-w-4xl mx-auto text-4xl md:text-6xl font-bold tracking-tight leading-tight text-slate-900">
          Find Jobs That Match Your Skills
        </h1>

        <p className="mt-6 max-w-2xl mx-auto text-lg leading-8 text-slate-600">
          Upload or paste your CV and let AI recommend jobs tailored to your
          experience. Explore opportunities, understand requirements, and get
          guidance for your next career move.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
          <button
            onClick={() => scrollToSection("cv-section")}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            <FileText className="h-5 w-5" />
            Paste Your CV
          </button>

          <button
            onClick={() => scrollToSection("jobs-section")}
            className="inline-flex items-center gap-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-6 py-3 rounded-xl transition"
          >
            <Search className="h-5 w-5" />
            Browse Jobs
          </button>
        </div>

        <div className="mt-12 grid max-w-3xl mx-auto grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Add Your CV</p>
                <p className="text-sm text-slate-500">Paste or upload in seconds</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">AI Analysis</p>
                <p className="text-sm text-slate-500">Extract skills and strengths</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Smart Matching</p>
                <p className="text-sm text-slate-500">Get recommended jobs fast</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
