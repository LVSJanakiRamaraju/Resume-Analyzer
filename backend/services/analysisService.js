const pdfParse = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

exports.parsePDFAndAnalyze = async (fileBuffer) => {
  const data = await pdfParse(fileBuffer);
  const resumeText = data.text;

  const model = genAI.getGenerativeModel({ model: 'models/gemini-pro' });
  const chat = model.startChat({
    history: [],
  });

  const prompt = `
You are an expert resume parser and reviewer.
Extract the following information in proper JSON format:

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
  "projects": ["string"],
  "certifications": ["string"],
  "resume_rating": number (1-10),
  "improvement_areas": "string",
  "upskill_suggestions": ["string"]
}

Resume Text:
"""
${resumeText}
"""
`;

  const result = await chat.sendMessage(prompt);
  const response = result.response;
  const responseText = response.text();

  let structuredJSON = {};
  try {
    structuredJSON = JSON.parse(responseText);
  } catch (err) {
    console.error('Failed to parse Gemini response:', err.message);
    throw new Error('LLM response format invalid');
  }

  return structuredJSON;
};
