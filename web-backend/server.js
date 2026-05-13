import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 5002;
const AI_BACKEND_URL = 'http://127.0.0.1:8000/predict';
const GEMINI_API_KEY = 'AIzaSyDIZ0xefGt8hqTKIqmx0l0yummux1KyGhc';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

// ─── JSON File DB ────────────────────────────────────────────────────────────
const DB_FILE = './db.json';
const initDB = () => {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify({ recentPredictions: [], feedback: [], snakes: [] }, null, 2));
    }
};
initDB();
const readDB = () => JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
const writeDB = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

// ─── AI Prediction Proxy ─────────────────────────────────────────────────────
app.post('/api/predict', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file provided' });

        const fileBlob = new Blob([req.file.buffer], { type: req.file.mimetype });
        const fileObj = new File([fileBlob], req.file.originalname, { type: req.file.mimetype });
        const form = new FormData();
        form.append('file', fileObj);

        const response = await fetch(AI_BACKEND_URL, { method: 'POST', body: form });
        const data = await response.json();

        if (response.ok && data.prediction) {
            const db = readDB();
            db.recentPredictions.unshift({
                id: Date.now().toString(),
                prediction: data.prediction,
                confidence: data.confidence,
                is_venomous: data.is_venomous,
                timestamp: new Date().toISOString()
            });
            if (db.recentPredictions.length > 10) db.recentPredictions = db.recentPredictions.slice(0, 10);
            writeDB(db);
        }
        res.json(data);
    } catch (error) {
        console.error('AI Proxy Error:', error.message);
        res.status(500).json({ error: 'AI Backend unreachable. Ensure Python server is running on port 8000.' });
    }
});

// ─── Recent Predictions ───────────────────────────────────────────────────────
app.get('/api/recent', (req, res) => {
    const db = readDB();
    res.json(db.recentPredictions || []);
});

// ─── Feedback ─────────────────────────────────────────────────────────────────
app.post('/api/feedback', (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ error: 'All fields required.' });
    const db = readDB();
    db.feedback.push({ id: Date.now().toString(), name, email, message, timestamp: new Date().toISOString() });
    writeDB(db);
    res.json({ success: true });
});

// ─── Snake Database ───────────────────────────────────────────────────────────
app.get('/api/snakes', (req, res) => {
    const { search, type, habitat } = req.query;
    const db = readDB();
    let results = [...(db.snakes || [])];
    if (search) results = results.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.scientificName.toLowerCase().includes(search.toLowerCase()));
    if (type && type !== 'All') results = results.filter(s => s.type === type);
    if (habitat && habitat !== 'All') results = results.filter(s => s.habitat.toLowerCase().includes(habitat.toLowerCase()));
    res.json(results);
});

// Add a new snake
app.post('/api/snakes', (req, res) => {
    const db = readDB();
    const newSnake = {
        ...req.body,
        id: Date.now()
    };
    db.snakes.push(newSnake);
    writeDB(db);
    res.json(newSnake);
});

// Update a snake
app.put('/api/snakes/:id', (req, res) => {
    const db = readDB();
    const id = parseInt(req.params.id);
    const index = db.snakes.findIndex(s => s.id === id);
    if (index !== -1) {
        db.snakes[index] = { ...db.snakes[index], ...req.body };
        writeDB(db);
        res.json(db.snakes[index]);
    } else {
        res.status(404).json({ error: 'Snake not found' });
    }
});

// ─── Snake Lookup via Gemini AI ──────────────────────────────────────────────
app.post('/api/snake-lookup', async (req, res) => {
    const { query } = req.body;
    if (!query || query.trim().length < 2) {
        return res.status(400).json({ error: 'Please provide a snake name to look up.' });
    }

    const prompt = `You are an expert herpetologist. A user wants detailed information about the snake: "${query}".

Return ONLY a valid JSON object (no markdown, no code fences) with exactly these fields:
{
  "commonName": "string",
  "scientificName": "string",
  "family": "string",
  "classification": "Venomous" or "Non-Venomous",
  "riskLevel": "Critical", "High", "Medium", or "Low",
  "venomType": "string (e.g. Neurotoxic, Hemotoxic, Cytotoxic, or None)",
  "habitat": "string",
  "geographicRange": "string",
  "averageLength": "string",
  "lifespan": "string",
  "diet": "string",
  "behavior": "string (2-3 sentences)",
  "firstAidSteps": ["step 1", "step 2", "step 3"],
  "interestingFacts": ["fact 1", "fact 2", "fact 3"],
  "conservationStatus": "string (e.g. Least Concern, Vulnerable, Endangered)",
  "lookalikes": "string (similar or commonly confused species)",
  "found": true
}

If the query is not a valid snake species, return: {"found": false, "message": "No snake found for this query."}

Return ONLY the raw JSON.`;

    try {
        const geminiRes = await axios.post(GEMINI_URL, {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { 
                temperature: 0.1, 
                maxOutputTokens: 2048,
                responseMimeType: "application/json"
            }
        }, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 45000
        });

        let rawText = geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

        if (!rawText) {
            return res.status(500).json({ error: 'Gemini AI returned an empty response. Please try again.' });
        }

        try {
            // 1. Clean the text (remove markdown fences and trailing garbage)
            const cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(cleaned);
            res.json(parsed);
        } catch (parseErr) {
            // 2. Fallback: If direct parse fails, try to find the JSON block manually
            console.error('JSON parse failed. Attempting recovery...');
            const start = rawText.indexOf('{');
            const end = rawText.lastIndexOf('}');
            
            if (start !== -1 && end !== -1) {
                try {
                    const extracted = JSON.parse(rawText.substring(start, end + 1));
                    return res.json(extracted);
                } catch (e) {
                    console.error('Recovery failed:', e.message);
                }
            }
            
            res.status(500).json({ error: 'The AI response was incomplete. Please try a more specific snake name.' });
        }
    } catch (err) {
        const status = err?.response?.status;
        const errData = err?.response?.data;
        console.error('Snake Lookup Error:', status, err.message);

        if (status === 429) {
            const retryInfo = errData?.error?.details?.find(d => d['@type']?.includes('RetryInfo'));
            const retryIn = retryInfo?.retryDelay || '60s';
            return res.status(429).json({
                error: `API rate limit reached. Gemini free-tier quota exhausted. Please retry in ${retryIn}.`,
                retryAfter: retryIn
            });
        }
        res.status(500).json({ error: errData?.error?.message || err.message || 'Failed to process snake lookup.' });
    }
});

// ─── Health Check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', port: PORT, ai_backend: AI_BACKEND_URL }));

// ─── Start Server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`✅ Web Backend running at http://localhost:${PORT}`);
    console.log(`🤖 AI Backend proxied at ${AI_BACKEND_URL}`);
});
