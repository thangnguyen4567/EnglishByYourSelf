// Logic API lưu tiến độ học + ý dàn ý vào MongoDB (thay cho localStorage của trình duyệt).
//
// Site chỉ có một người học nên mọi thiết bị dùng chung một bộ dữ liệu (OWNER).
//
//   GET    /api/data         → {progress, notes}
//   PUT    /api/progress     body: Progress
//   PUT    /api/notes/:key   body: {value}   (value rỗng = xóa)
import {MongoClient} from 'mongodb';

const {MONGODB_URI, MONGODB_DB = 'ngu-phap', CORS_ORIGIN = '*'} = process.env;

// Kết nối dùng lại giữa các request (và giữa các lần gọi serverless function còn "ấm").
let conn;
export function connect() {
  if (!MONGODB_URI) throw new Error('Thiếu MONGODB_URI (xem server/.env.example)');
  conn ??= (async () => {
    const client = await new MongoClient(MONGODB_URI).connect();
    const db = client.db(MONGODB_DB);
    const progressCol = db.collection('progress'); // {_id: uid, data, updatedAt}
    const notesCol = db.collection('notes'); // {_id: `${uid}|${key}`, uid, key, value, updatedAt}
    await notesCol.createIndex({uid: 1});
    return {client, progressCol, notesCol};
  })().catch((err) => {
    conn = undefined;
    throw err;
  });
  return conn;
}

const origins = CORS_ORIGIN.split(',').map((s) => s.trim());
const OWNER = 'me';
const MAX_BODY = 256 * 1024;

function cors(req, res) {
  const origin = req.headers.origin;
  if (origins.includes('*')) res.setHeader('Access-Control-Allow-Origin', '*');
  else if (origin && origins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function send(res, status, body) {
  res.writeHead(status, {'Content-Type': 'application/json; charset=utf-8'});
  res.end(body === undefined ? '' : JSON.stringify(body));
}

async function readJson(req) {
  let size = 0;
  const chunks = [];
  for await (const c of req) {
    size += c.length;
    if (size > MAX_BODY) throw Object.assign(new Error('Body quá lớn'), {status: 413});
    chunks.push(c);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
  } catch {
    throw Object.assign(new Error('JSON không hợp lệ'), {status: 400});
  }
}

/** Xử lý một request HTTP – dùng chung cho server/index.mjs (chạy máy) và api/index.mjs (Vercel). */
export async function handle(req, res) {
  cors(req, res);
  if (req.method === 'OPTIONS') return send(res, 204);

  const url = new URL(req.url, 'http://x');
  // Trên Vercel, vercel.json rewrite /api/* → /api?__path=* nên đường dẫn gốc nằm ở query.
  const pathname = url.searchParams.has('__path') ? `/api/${url.searchParams.get('__path')}` : url.pathname;
  const parts = pathname.split('/').filter(Boolean).map(decodeURIComponent);
  if (parts.join('/') === 'health' || parts.join('/') === 'api/health') return send(res, 200, {ok: true});
  if (parts[0] !== 'api') return send(res, 404, {error: 'Not found'});
  const uid = OWNER;

  try {
    const {progressCol, notesCol} = await connect();

    // GET /api/data
    if (req.method === 'GET' && parts[1] === 'data' && parts.length === 2) {
      const [p, notes] = await Promise.all([
        progressCol.findOne({_id: uid}),
        notesCol.find({uid}, {projection: {key: 1, value: 1}}).toArray(),
      ]);
      return send(res, 200, {
        progress: p?.data ?? null,
        notes: Object.fromEntries(notes.map((n) => [n.key, n.value])),
      });
    }

    // PUT /api/progress
    if (req.method === 'PUT' && parts[1] === 'progress' && parts.length === 2) {
      const data = await readJson(req);
      if (typeof data !== 'object' || data === null || Array.isArray(data)) {
        return send(res, 400, {error: 'Progress phải là object'});
      }
      await progressCol.updateOne(
        {_id: uid},
        {$set: {data, updatedAt: new Date()}},
        {upsert: true},
      );
      return send(res, 204);
    }

    // PUT /api/notes/:key
    if (req.method === 'PUT' && parts[1] === 'notes' && parts.length === 3) {
      const key = parts[2];
      const {value} = await readJson(req);
      if (typeof value !== 'string') return send(res, 400, {error: 'value phải là string'});
      const _id = `${uid}|${key}`;
      if (value) {
        await notesCol.updateOne(
          {_id},
          {$set: {uid, key, value, updatedAt: new Date()}},
          {upsert: true},
        );
      } else {
        await notesCol.deleteOne({_id});
      }
      return send(res, 204);
    }

    return send(res, 404, {error: 'Not found'});
  } catch (err) {
    console.error(err);
    const config = /MONGODB_URI/.test(err.message);
    return send(res, err.status ?? 500, {error: err.status || config ? err.message : 'Lỗi máy chủ'});
  }
}
