import { useState } from "react";
import axios from "axios";

function ResumeUploader({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/resumes/upload", formData);
      onUploadSuccess(res.data);
    } catch (err) {
      alert("Upload failed. Check server logs.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-box">
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload Resume"}
      </button>
    </div>
  );
}

export default ResumeUploader;
