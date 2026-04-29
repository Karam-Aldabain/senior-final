import { NavLink } from "react-router-dom";

function Navbar() {
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
          <NavLink to="/" className={navItemClass}>
            Home
          </NavLink>
          <NavLink to="/mock-interview" className={navItemClass}>
            Mock Interview
          </NavLink>
          <NavLink to="/jobs" className={navItemClass}>
            Job Assistant
          </NavLink>
          <NavLink to="/admin/jobs" className={navItemClass}>
            Admin Jobs
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <div className="h-6 w-px bg-blue-200/70" />
          <button className="rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-white">
            Sign in
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
