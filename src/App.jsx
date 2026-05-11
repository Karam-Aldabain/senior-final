import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { useAuth } from "./context/useAuth";
import Navbar from "./Navbar";
import Home from "./pages/Home";
import AdminJobs from "./pages/AdminJobs";
import ImproveMatch from "./pages/ImproveMatch";
import JobDetails from "./pages/JobDetails";
import Jobs from "./pages/Jobs";
import MockInterview from "./pages/MockInterview";
import SignIn from "./pages/SignIn";

function AdminRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/jobs" replace />;
  }

  return children;
}

function CompanyRedirect({ children }) {
  const { user } = useAuth();
  return user?.role === "company" ? <Navigate to="/jobs" replace /> : children;
}

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <Routes>
        <Route path="/" element={<CompanyRedirect><Home /></CompanyRedirect>} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/mock-interview" element={<CompanyRedirect><MockInterview /></CompanyRedirect>} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/admin/jobs" element={<AdminRoute><AdminJobs /></AdminRoute>} />
        <Route path="/job/:id" element={<JobDetails />} />
        <Route path="/job/:id/improve" element={<CompanyRedirect><ImproveMatch /></CompanyRedirect>} />
        <Route path="/coach/:id" element={<CompanyRedirect><ImproveMatch /></CompanyRedirect>} />
      </Routes>
    </div>
  );
}

export default App;
