// Chạy API trên máy: cd server && npm install && npm start   (đọc biến môi trường từ server/.env)
// Trên Vercel API chạy dưới dạng serverless function: xem api/index.mjs + vercel.json.
import http from 'node:http';
import {connect, handle} from './handler.mjs';

const {PORT = '4000', MONGODB_DB = 'ngu-phap'} = process.env;
const {client} = await connect();
const server = http.createServer(handle);

server.listen(Number(PORT), () => {
  console.log(`API chạy tại http://localhost:${PORT} (db: ${MONGODB_DB})`);
});

for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, () => server.close(() => client.close().then(() => process.exit(0))));
}
