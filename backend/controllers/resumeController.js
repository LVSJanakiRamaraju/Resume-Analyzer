const pool = require('../db');
const { parsePDFAndAnalyze } = require('../services/analysisService');

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No resume file uploaded.' });
    }

    const pdfBuffer = req.file.buffer;
    const fileName = req.file.originalname;

    const structuredData = await parsePDFAndAnalyze(pdfBuffer);

    const result = await pool.query(
      `INSERT INTO resumes (
        file_name, name, email, phone, linkedin_url, portfolio_url, summary,
        work_experience, education, technical_skills, soft_skills, projects,
        certifications, resume_rating, improvement_areas, upskill_suggestions
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9::jsonb, $10::jsonb, $11::jsonb, $12::jsonb,
        $13::jsonb, $14, $15, $16::jsonb)
      RETURNING *`,
      [
        fileName,
        structuredData.name,
        structuredData.email,
        structuredData.phone,
        structuredData.linkedin_url,
        structuredData.portfolio_url,
        structuredData.summary,
        JSON.stringify(structuredData.work_experience),
        JSON.stringify(structuredData.education),
        JSON.stringify(structuredData.technical_skills),
        JSON.stringify(structuredData.soft_skills),
        JSON.stringify(structuredData.projects),
        JSON.stringify(structuredData.certifications),
        structuredData.resume_rating,
        structuredData.improvement_areas,
        JSON.stringify(structuredData.upskill_suggestions),
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Resume processing failed.' });
  }
};

exports.getAllResumes = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, resume_rating, uploaded_at FROM resumes ORDER BY uploaded_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch resumes.' });
  }
};

exports.getResumeById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await pool.query('SELECT * FROM resumes WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Resume not found.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch resume.' });
  }
};
