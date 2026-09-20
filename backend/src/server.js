import express from 'express';
import cors from 'cors';
import crypto from 'node:crypto';

import { calculateLegacy } from './calculator.js';
import { addCalculation, deleteCalculation, readDb } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

// CORS
app.use(
  cors({
    origin: '*',
  })
);

app.use(express.json({ limit: '1mb' }));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'parental-legacy-api',
    timestamp: new Date().toISOString(),
  });
});

// Calculate + optionally save
app.post('/api/calculations', async (req, res) => {
  try {
    const { dob, save = true } = req.body || {};

    const result = calculateLegacy(dob);

    const saved = {
      id: crypto.randomUUID(),
      ...result,
      savedAt: new Date().toISOString(),
    };

    if (save) {
      await addCalculation(saved);
    }

    res.status(201).json({
      success: true,
      result: saved,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Unable to calculate result.',
    });
  }
});

// Get calculation history
app.get('/api/calculations', async (_req, res) => {
  try {
    const db = await readDb();

    res.json({
      success: true,
      results: db.calculations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Unable to read calculation history.',
    });
  }
});

// Delete calculation
app.delete('/api/calculations/:id', async (req, res) => {
  try {
    const deleted = await deleteCalculation(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Calculation not found.',
      });
    }

    res.json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Unable to delete calculation.',
    });
  }
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: 'Unexpected server error.',
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Parental Legacy API running on port ${PORT}`);
});
