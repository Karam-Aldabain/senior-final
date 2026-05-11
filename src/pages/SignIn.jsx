import { useState } from "react";
import { BriefcaseBusiness, LoaderCircle, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const ROLE_OPTIONS = [
  {
    value: "company",
    label: "Company",
    icon: BriefcaseBusiness,
    email: "company@hiresense.local",
    password: "company123",
  },
  {
    value: "job_seeker",
    label: "Job Seeker",
    icon: UserRound,
    email: "seeker@hiresense.local",
    password: "seeker123",
  },
];

function SignIn() {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const [mode, setMode] = useState("signin");
  const [role, setRole] = useState("job_seeker");
  const selectedRole = ROLE_OPTIONS.find((option) => option.value === role) || ROLE_OPTIONS[1];
  const [email, setEmail] = useState(selectedRole.email);
  const [password, setPassword] = useState(selectedRole.password);
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleRoleChange = (nextRole) => {
    const option = ROLE_OPTIONS.find((item) => item.value === nextRole);
    setRole(nextRole);

    if (mode === "signin") {
      setEmail(option.email);
      setPassword(option.password);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const loginRole = email.trim().toLowerCase() === "admin@hiresense.local" ? "admin" : role;
      const session =
        mode === "signup"
          ? await signup({ email, password, role, name })
          : await login({ email, password, role: loginRole });
      navigate(session.user.role === "admin" ? "/admin/jobs" : "/jobs", { replace: true });
    } catch (signInError) {
      setError(signInError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-slate-50 px-6 py-16">
      <section className="mx-auto max-w-3xl rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">
          {mode === "signup" ? "Sign Up" : "Sign In"}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Choose your role</h1>

        <div className="mt-6 inline-flex rounded-2xl border border-slate-200 bg-slate-50 p-1">
          <button
            type="button"
            onClick={() => setMode("signin")}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              mode === "signin" ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              if (email.endsWith("@hiresense.local")) {
                setEmail("");
                setPassword("");
              }
            }}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              mode === "signup" ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid gap-3 sm:grid-cols-2">
            {ROLE_OPTIONS.map((option) => {
              const Icon = option.icon;
              const isSelected = role === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleRoleChange(option.value)}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-4 text-left text-sm font-semibold transition ${
                    isSelected
                      ? "border-blue-300 bg-blue-50 text-blue-700 ring-4 ring-blue-100"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {option.label}
                </button>
              );
            })}
          </div>

          {mode === "signup" ? (
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              Name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </label>
          ) : null}

          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Email
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </label>

          {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            {mode === "signup" ? "Create account" : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default SignIn;
