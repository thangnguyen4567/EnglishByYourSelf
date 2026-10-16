// Vercel serverless function cho mọi đường dẫn /api/* (xem rewrite trong vercel.json).
// Biến môi trường cần đặt trên Vercel: MONGODB_URI, MONGODB_DB.
export {handle as default} from '../server/handler.mjs';
