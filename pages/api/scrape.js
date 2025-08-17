import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const dataPath = path.join(process.cwd(), 'data', 'daily_briefing.json');
  try {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: 'Failed to read data', details: e.message });
  }
}
