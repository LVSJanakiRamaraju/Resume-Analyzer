function ResumeDetails({ data }) {
  if (!data) return <p>No resume analyzed yet.</p>;

  return (
    <div className="resume-details">
      <h2>{data.name}</h2>
      <p>Email: {data.email}</p>
      <p>Phone: {data.phone}</p>
      <p>LinkedIn: {data.linkedin_url}</p>
      <p>Portfolio: {data.portfolio_url}</p>
      <h3>Summary</h3>
      <p>{data.summary}</p>

      <h3>Technical Skills</h3>
      <ul>{data.technical_skills?.map((s, i) => <li key={i}>{s}</li>)}</ul>

      <h3>Soft Skills</h3>
      <ul>{data.soft_skills?.map((s, i) => <li key={i}>{s}</li>)}</ul>

      <h3>Resume Rating</h3>
      <p>{data.resume_rating}/10</p>

      <h3>Improvement Areas</h3>
      <p>{data.improvement_areas}</p>

      <h3>Upskill Suggestions</h3>
      <ul>{data.upskill_suggestions?.map((s, i) => <li key={i}>{s}</li>)}</ul>
    </div>
  );
}

export default ResumeDetails;
