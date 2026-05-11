import { NavLink } from "react-router-dom";
import { useAuth } from "./context/useAuth";

function Navbar() {
  const { user, logout } = useAuth();
  const navItemClass = ({ isActive }) =>
    `px-4 py-2 rounded-full text-sm font-semibold transition ${
      isActive
        ? "bg-white text-blue-700 shadow-sm ring-1 ring-blue-200"
        : "text-slate-700 hover:bg-white/60 hover:text-slate-900"
    }`;

  return (
    <header className="bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-8">
        <div className="text-lg font-extrabold tracking-tight text-slate-900">
          Hiresense <span className="text-blue-700">AI</span>
        </div>

        <nav className="flex items-center gap-3">
          {user?.role !== "company" ? (
            <>
              <NavLink to="/" className={navItemClass}>
                Home
              </NavLink>
              <NavLink to="/mock-interview" className={navItemClass}>
                Mock Interview
              </NavLink>
            </>
          ) : null}
          <NavLink to="/jobs" className={navItemClass}>
            Job Assistant
          </NavLink>
          {user?.role === "admin" ? (
            <NavLink to="/admin/jobs" className={navItemClass}>
              Admin Jobs
            </NavLink>
          ) : null}
        </nav>

        <div className="flex items-center gap-3">
          <div className="h-6 w-px bg-blue-200/70" />
          {user ? (
            <button
              type="button"
              onClick={() => void logout()}
              className="rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-white"
            >
              Sign out
            </button>
          ) : (
            <NavLink
              to="/signin"
              className="rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-white"
            >
              Sign in
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
