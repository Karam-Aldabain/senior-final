import React from "react";
import { Link } from "react-router-dom";

/** -------------------------
 * Data
 * ------------------------*/
const features = [
  {
    title: "Mock Interview",
    description:
      "Practice realistic interview rounds with role-specific questions, instant AI feedback on your answers, and clear suggestions to improve confidence, structure, and communication before real interviews.",
    image: "/1707420465234.png",
    Icon: SparklesIcon,
    badge: "Interview Prep",
    href: "/mock-interview",
    cta: "Start interview practice",
  },
  {
    title: "Job Assistant",
    description:
      "Explore matched opportunities and get guided help with job requirements, salary and market trends, resume alignment tips, and practical next steps tailored to your profile and career goals.",
    image: "/03-03-24_LongPostGraphic.webp",
    Icon: BriefcaseIcon,
    badge: "Job Matching",
    href: "/jobs",
    cta: "Open job assistant",
  },
];

const steps = [
  {
    title: "Upload or Paste Your CV",
    description:
      "Start by adding your CV. We'll instantly scan it and extract skills, experience, and keywords.",
    Icon: UploadIcon,
  },
  {
    title: "Get Smart CV Insights",
    description:
      "See a clear summary, detected skills, and suggestions to improve alignment with job requirements.",
    Icon: BrainIcon,
  },
  {
    title: "Discover Matching Jobs",
    description:
      "Explore recommended jobs with a match score and a simple explanation of why each role fits you.",
    Icon: TargetIcon,
  },
  {
    title: "Practice With AI Interviews",
    description:
      "Train with role-specific interview questions and get feedback to improve structure and clarity.",
    Icon: MicIcon,
  },
];

const benefits = [
  {
    title: "Instant Results",
    description: "Get match scores and insights in seconds without complex setup.",
    Icon: BoltIcon,
  },
  {
    title: "Explainable Matching",
    description: "See why a job matches you and what skills you're missing.",
    Icon: CheckCircleIcon,
  },
  {
    title: "Real Interview Practice",
    description: "Role-specific mock interviews with feedback you can act on.",
    Icon: SparklesMiniIcon,
  },
  {
    title: "No Account Required",
    description: "Start quickly. Great for demos and senior project grading.",
    Icon: ShieldIcon,
  },
];

const stats = [
  { value: "82%", label: "Average Match Insight" },
  { value: "AI", label: "CV & Interview Support" },
  { value: "Fast", label: "Simple Demo Experience" },
];

/** -------------------------
 * Icons
 * ------------------------*/
function ArrowRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M5 12h14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="m13 6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckMiniIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4 text-emerald-600"
      aria-hidden="true"
    >
      <path
        d="m6.5 12.5 3.2 3.2 7.8-8.2"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AlertMiniIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4 text-amber-600"
      aria-hidden="true"
    >
      <path
        d="M12 8v5"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <circle cx="12" cy="16.5" r="1" fill="currentColor" />
      <path
        d="M10.3 4.7 3.8 16a2 2 0 0 0 1.7 3h13a2 2 0 0 0 1.7-3L13.7 4.7a2 2 0 0 0-3.4 0Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-8 w-8 text-blue-700"
      aria-hidden="true"
    >
      <path
        d="M9 6V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M4 8h16a1 1 0 0 1 1 1v9a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V9a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path d="M3 13h18" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-8 w-8 text-blue-700"
      aria-hidden="true"
    >
      <path
        d="M12 3 9.7 8.2 4.5 10.5l5.2 2.3L12 18l2.3-5.2 5.2-2.3-5.2-2.3L12 3Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="m5 3 .7 1.6L7.3 5.3 5.7 6 5 7.6 4.3 6 2.7 5.3l1.6-.7L5 3Zm14 11 .6 1.3 1.4.6-1.4.6-.6 1.3-.6-1.3-1.4-.6 1.4-.6.6-1.3Z"
        fill="currentColor"
      />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-7 w-7 text-blue-700"
      aria-hidden="true"
    >
      <path
        d="M12 16V4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M7.5 8.5 12 4l4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 20h14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BrainIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-7 w-7 text-blue-700"
      aria-hidden="true"
    >
      <path
        d="M9 4a3 3 0 0 0-3 3v1a3 3 0 0 0 0 6v2a3 3 0 0 0 3 3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M15 4a3 3 0 0 1 3 3v1a3 3 0 0 1 0 6v2a3 3 0 0 1-3 3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M9 10h6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-7 w-7 text-blue-700"
      aria-hidden="true"
    >
      <path
        d="M12 21a9 9 0 1 1 9-9"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M12 17a5 5 0 1 1 5-5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M12 12l7-7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M16 5h3v3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-7 w-7 text-blue-700"
      aria-hidden="true"
    >
      <path
        d="M12 14a3 3 0 0 0 3-3V7a3 3 0 0 0-6 0v4a3 3 0 0 0 3 3Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M19 11a7 7 0 0 1-14 0"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M12 18v3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M9 21h6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-6 w-6 text-blue-700"
      aria-hidden="true"
    >
      <path
        d="M13 2 3 14h8l-1 8 11-14h-8l0-6Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-6 w-6 text-blue-700"
      aria-hidden="true"
    >
      <path
        d="M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="m8.5 12.5 2.2 2.2 4.8-5.2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SparklesMiniIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-6 w-6 text-blue-700"
      aria-hidden="true"
    >
      <path
        d="M12 3 9.7 8.2 4.5 10.5l5.2 2.3L12 18l2.3-5.2 5.2-2.3-5.2-2.3L12 3Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-6 w-6 text-blue-700"
      aria-hidden="true"
    >
      <path
        d="M12 2 20 6v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6l8-4Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** -------------------------
 * Reusable UI
 * ------------------------*/
function Pill({ children, dark = false }) {
  return (
    <span
      className={
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold " +
        (dark
          ? "border border-white/20 bg-white/10 text-white"
          : "border border-blue-200 bg-blue-50 text-blue-700")
      }
    >
      {children}
    </span>
  );
}

function PrimaryButton({ children, to }) {
  const classes =
    "inline-flex items-center justify-center rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white shadow-md transition duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl active:scale-[0.99]";

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  return <button className={classes}>{children}</button>;
}

function SecondaryButton({ children, to, dark = false }) {
  const classes =
    "inline-flex items-center justify-center rounded-xl px-7 py-3 font-semibold transition duration-300 active:scale-[0.99] " +
    (dark
      ? "bg-white/10 text-white ring-1 ring-white/25 backdrop-blur hover:bg-white/15"
      : "bg-white/80 text-slate-900 shadow-sm ring-1 ring-slate-200 backdrop-blur hover:bg-white hover:shadow-md");

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  return <button className={classes}>{children}</button>;
}

function SectionHeader({ title, subtitle, center = true, light = false }) {
  return (
    <div className={center ? "text-center" : ""}>
      <h2
        className={
          "text-3xl font-bold tracking-tight md:text-4xl " +
          (light ? "text-white" : "text-slate-900")
        }
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={
            "mt-4 text-base leading-relaxed " +
            (light ? "text-blue-100 " : "text-slate-600 ") +
            (center ? "mx-auto max-w-2xl" : "max-w-2xl")
          }
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

function GlassCard({ children }) {
  return (
    <div className="rounded-2xl border border-white/40 bg-white/75 p-4 shadow-sm backdrop-blur">
      {children}
    </div>
  );
}

function Home() {
  return (
    <div className="bg-white text-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_#dbeafe_0%,_#eff6ff_35%,_#ffffff_70%)] py-24 md:py-32">
        <div className="pointer-events-none absolute left-1/2 top-10 h-[540px] w-[540px] -translate-x-1/2 rounded-full bg-blue-300/30 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 top-44 h-[280px] w-[280px] rounded-full bg-indigo-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-48 h-[280px] w-[280px] rounded-full bg-sky-200/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <Pill>AI Career Platform</Pill>

            <h1 className="mt-6 text-5xl font-bold tracking-tight text-slate-900 md:text-6xl">
              Build Confidence for
              <span className="block bg-gradient-to-r from-blue-700 via-sky-600 to-indigo-700 bg-clip-text text-transparent">
                Jobs & Interviews
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
              Analyze your CV, discover matching jobs, and practice interviews
              with AI-powered guidance that feels like a real career product.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <PrimaryButton to="/mock-interview">Get started</PrimaryButton>
              <SecondaryButton to="/jobs">Explore jobs</SecondaryButton>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {stats.map((item) => (
                <GlassCard key={item.label}>
                  <p className="text-xl font-bold text-slate-900">{item.value}</p>
                  <p className="mt-1 text-sm text-slate-600">{item.label}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="bg-gradient-to-b from-white to-slate-50 py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader
            title="Powerful Tools for Your Career"
            subtitle="Everything you need to analyze your profile, discover opportunities, and prepare for interviews."
          />

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
            {features.map((feature) => (
              <Link
                key={feature.title}
                to={feature.href}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="h-56 w-full object-cover transition duration-500 group-hover:scale-[1.03] md:h-72"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent" />
                  <div className="absolute left-5 top-5">
                    <Pill>{feature.badge}</Pill>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">
                    <feature.Icon />
                  </div>

                  <h3 className="text-xl font-semibold text-slate-900">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>

                  <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-blue-700">
                    <span>{feature.cta}</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      <ArrowRightIcon />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="bg-white py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader
            title="How It Works"
            subtitle="A smooth workflow that feels like a complete product: CV -> Insights -> Jobs -> Interviews."
          />

          <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, idx) => (
              <div
                key={step.title}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-50 transition duration-300 group-hover:scale-110" />

                <div className="relative">
                  <div className="flex items-center justify-between gap-3">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">
                      <step.Icon />
                    </div>
                    <Pill>Step {idx + 1}</Pill>
                  </div>

                  <h3 className="mt-5 text-base font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="relative overflow-hidden bg-blue-700 py-20 md:py-24">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6">
          <SectionHeader
            title="Why Use This Platform?"
            subtitle="Designed for fast results, clear explanations, and realistic interview training."
            light
          />

          <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-3xl border border-white/15 bg-white/95 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100">
                  <benefit.Icon />
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-900">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo / Match score */}
      <section className="bg-white py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <SectionHeader
                center={false}
                title="See Match Score in Action"
                subtitle="Show your AI clearly: match percentage, matched skills, and missing skills. This makes your senior project demo look much more professional."
              />

              <div className="mt-8 flex flex-wrap gap-2">
                <Pill>Explainable Matching</Pill>
                <Pill>Skills Gap</Pill>
                <Pill>Recommendations</Pill>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <PrimaryButton to="/mock-interview">Analyze my CV</PrimaryButton>
                <SecondaryButton to="/jobs">View recommended jobs</SecondaryButton>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-xl">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    Frontend Developer
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Example Tech â€¢ Remote â€¢ Mid-Level
                  </p>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 px-5 py-3 text-center text-white shadow-md">
                  <p className="text-xs uppercase tracking-wide text-blue-100">Match</p>
                  <p className="text-2xl font-bold">82%</p>
                </div>
              </div>

              <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-blue-600 to-indigo-600" />
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-sm font-semibold text-slate-900">Matched Skills</p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-700">
                    {["React", "JavaScript", "CSS", "REST APIs"].map((skill) => (
                      <li key={skill} className="flex items-center gap-2">
                        <CheckMiniIcon />
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-sm font-semibold text-slate-900">Missing Skills</p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-700">
                    {["TypeScript", "Testing (Jest)", "Next.js"].map((skill) => (
                      <li key={skill} className="flex items-center gap-2">
                        <AlertMiniIcon />
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Why recommended</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Your profile strongly matches the roleâ€™s frontend stack and API
                  experience. Adding TypeScript, Next.js, and testing would make
                  this profile even stronger.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 py-20">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <Pill dark>Start Your Career Journey</Pill>

          <h2 className="mt-6 text-3xl font-bold text-white md:text-5xl">
            Ready to Boost Your Career?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-blue-100">
            Analyze your CV, discover relevant job matches, and practice interviews
            with AI feedback in one smooth experience.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <PrimaryButton to="/mock-interview">Get started</PrimaryButton>
            <SecondaryButton to="/jobs" dark>
              Explore jobs
            </SecondaryButton>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="max-w-md">
              <p className="text-lg font-bold text-slate-900">AI Career Assistant</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                A smart career platform for CV analysis, job matching, and AI
                interview practice - built as a polished senior project.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm text-slate-600 md:grid-cols-1">
              <button className="text-left transition hover:text-slate-900">
                Features
              </button>
              <button className="text-left transition hover:text-slate-900">
                How it works
              </button>
              <button className="text-left transition hover:text-slate-900">
                Demo
              </button>
              <button className="text-left transition hover:text-slate-900">
                Contact
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-2 border-t border-slate-200 pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
            <p>© {new Date().getFullYear()} AI Career Assistant. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;


