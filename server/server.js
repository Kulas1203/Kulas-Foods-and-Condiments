import express from 'express';
import cors from 'cors';
import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, 'db.json');
const CLIENT_DIST = path.join(__dirname, '..', 'client', 'dist');
const PORT = process.env.PORT || 3001;

const app = express();

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

// Allow the Vite dev server (and any origin listed in CORS_ORIGIN) to call
// the API. In production the frontend is served from this same server, so
// CORS mostly matters during development.
const allowedOrigins = (
  process.env.CORS_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173'
)
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    // Reflect allowed origins; for anything else send no CORS headers at
    // all (`false`) — same-origin traffic still works (CORS only gates
    // cross-origin reads) and disallowed cross-origin callers are blocked
    // by the browser without turning the request into a 403.
    origin(origin, callback) {
      callback(null, !origin || allowedOrigins.includes(origin));
    },
  })
);

app.use(express.json({ limit: '32kb' }));

// ---------------------------------------------------------------------------
// Tiny JSON-file database
// ---------------------------------------------------------------------------

const EMPTY_DB = { contacts: [], newsletter: [] };

async function readDB() {
  try {
    const raw = await fs.readFile(DB_PATH, 'utf8');
    const data = JSON.parse(raw);
    return { ...EMPTY_DB, ...data };
  } catch (err) {
    if (err.code === 'ENOENT') return structuredClone(EMPTY_DB);
    throw err;
  }
}

// serialize writes so concurrent requests can't clobber each other
let writeChain = Promise.resolve();

function withDB(mutate) {
  const task = writeChain.then(async () => {
    const db = await readDB();
    const result = await mutate(db);
    const tmp = `${DB_PATH}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(db, null, 2));
    await fs.rename(tmp, DB_PATH); // atomic-ish swap
    return result;
  });
  // keep the chain alive even if this task rejects
  writeChain = task.catch(() => {});
  return task;
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function cleanString(value, { min = 1, max = 500 } = {}) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (trimmed.length < min || trimmed.length > max) return null;
  return trimmed;
}

function cleanEmail(value) {
  const email = cleanString(value, { min: 5, max: 254 });
  if (!email || !EMAIL_RE.test(email)) return null;
  return email.toLowerCase();
}

// ---------------------------------------------------------------------------
// API routes
// ---------------------------------------------------------------------------

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'kulas-api' });
});

// POST /api/contact — { name, email, message }
app.post('/api/contact', async (req, res, next) => {
  try {
    const name = cleanString(req.body?.name, { min: 2, max: 100 });
    const email = cleanEmail(req.body?.email);
    const message = cleanString(req.body?.message, { min: 10, max: 2000 });

    if (!name) {
      return res
        .status(400)
        .json({ error: 'Please provide your name (2–100 characters).' });
    }
    if (!email) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }
    if (!message) {
      return res
        .status(400)
        .json({ error: 'Please write a message (10–2000 characters).' });
    }

    const entry = {
      id: randomUUID(),
      name,
      email,
      message,
      createdAt: new Date().toISOString(),
    };
    await withDB((db) => {
      db.contacts.push(entry);
    });

    res.status(201).json({ ok: true, message: 'Message received.', id: entry.id });
  } catch (err) {
    next(err);
  }
});

// POST /api/newsletter — { email }
app.post('/api/newsletter', async (req, res, next) => {
  try {
    const email = cleanEmail(req.body?.email);
    if (!email) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    const { duplicate } = await withDB((db) => {
      if (db.newsletter.some((n) => n.email === email)) {
        return { duplicate: true };
      }
      db.newsletter.push({
        id: randomUUID(),
        email,
        subscribedAt: new Date().toISOString(),
      });
      return { duplicate: false };
    });

    if (duplicate) {
      return res
        .status(200)
        .json({ ok: true, message: "You're already on the list — stay spicy!" });
    }
    res.status(201).json({ ok: true, message: "You're on the list. Stay spicy!" });
  } catch (err) {
    next(err);
  }
});

// unknown API routes → JSON 404 (instead of the SPA fallback)
app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// ---------------------------------------------------------------------------
// Static frontend (production)
// ---------------------------------------------------------------------------

app.use(express.static(CLIENT_DIST));

// SPA fallback for anything that isn't a file or an API route
app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  res.sendFile(path.join(CLIENT_DIST, 'index.html'), (err) => {
    if (err) {
      res
        .status(404)
        .send('Frontend build not found. Run `npm run build` first.');
    }
  });
});

// error handler — keep JSON shape for API consumers
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🌶️  Kulas API ready on http://localhost:${PORT}`);
});
