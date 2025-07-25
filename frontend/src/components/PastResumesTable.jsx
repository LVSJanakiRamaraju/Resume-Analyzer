import { useEffect, useState } from "react";
import axios from "axios";

function PastResumesTable({ onViewDetails }) {
  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/resumes")
      .then((res) => setResumes(res.data))
      .catch((err) => console.error("Error fetching past resumes:", err));
  }, []);

  return (
    <div className="past-resumes">
      <h2>Previously Uploaded Resumes</h2>
      <table>
        <thead>
          <tr>
            <th>Candidate</th>
            <th>Email</th>
            <th>Uploaded At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {resumes.map((r) => (
            <tr key={r.id}>
              <td>{r.name}</td>
              <td>{r.email}</td>
              <td>{new Date(r.uploaded_at).toLocaleString()}</td>
              <td><button onClick={() => onViewDetails(r)}>View</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PastResumesTable;
