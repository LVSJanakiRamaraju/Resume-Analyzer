import { useState } from "react";
import ResumeUploader from "./components/ResumeUploader";
import ResumeDetails from "./components/ResumeDetails";
import PastResumesTable from "./components/PastResumesTable";

function App() {
  const [tab, setTab] = useState("upload");
  const [selectedResume, setSelectedResume] = useState(null);

  return (
    <div className="app-container">
      <h1>📄 Resume Analyzer</h1>

      <nav>
        <button onClick={() => setTab("upload")}>Resume Analysis</button>
        <button onClick={() => setTab("history")}>History Viewer</button>
      </nav>

      {tab === "upload" && (
        <>
          <ResumeUploader onUploadSuccess={setSelectedResume} />
          <ResumeDetails data={selectedResume} />
        </>
      )}

      {tab === "history" && (
        <PastResumesTable onViewDetails={setSelectedResume} />
      )}
    </div>
  );
}

export default App;
