const pdfParse = require("pdf-parse");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

exports.parsePDFAndAnalyze = async (pdfBuffer) => {
  try {
    const data = await pdfParse(pdfBuffer);
    const resumeText = data.text;

    const prompt = `
You are an expert technical recruiter and career coach. Analyze the following resume text and extract the information into a valid JSON object with this structure:

{
  "name": "string | null",
  "email": "string | null",
  "phone": "string | null",
  "linkedin_url": "string | null",
  "portfolio_url": "string | null",
  "summary": "string | null",
  "work_experience": [{ "role": "string", "company": "string", "duration": "string", "description": ["string"] }],
  "education": [{ "degree": "string", "institution": "string", "graduation_year": "string" }],
  "technical_skills": ["string"],
  "soft_skills": ["string"],
  "resume_rating": "number (1-10)",
  "improvement_areas": "string",
  "upskill_suggestions": ["string"]
}

Resume Text:
"""
${resumeText}
"""`;

    const response = await fetch("https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=" + process.env.GOOGLE_API_KEY, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      }),
    });

    const result = await response.json();
    console.log("🧠 Gemini raw response:\n", JSON.stringify(result, null, 2));

    if (!result?.candidates || !result.candidates[0]?.content?.parts?.[0]?.text) {
      throw new Error("No valid response from Gemini.");
    }

    const responseText = result.candidates[0].content.parts[0].text;
    const cleaned = responseText.replace(/```json|```/g, "").trim();

    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Gemini fetch failed:", err);
    throw new Error("Gemini analysis failed.");
  }
};
