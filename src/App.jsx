import { Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./Navbar";
import Home from "./pages/Home";
import AdminJobs from "./pages/AdminJobs";
import ImproveMatch from "./pages/ImproveMatch";
import JobDetails from "./pages/JobDetails";
import Jobs from "./pages/Jobs";
import MockInterview from "./pages/MockInterview";

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mock-interview" element={<MockInterview />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/admin/jobs" element={<AdminJobs />} />
        <Route path="/job/:id" element={<JobDetails />} />
        <Route path="/job/:id/improve" element={<ImproveMatch />} />
        <Route path="/coach/:id" element={<ImproveMatch />} />
      </Routes>
    </div>
  );
}

export default App;
