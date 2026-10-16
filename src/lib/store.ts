import siteConfig from '@generated/docusaurus.config';

// Dữ liệu học được lưu trên MongoDB qua API (thư mục server/). Trình duyệt chỉ giữ
// "mã học viên" để biết dữ liệu nào là của mình; mở trang với ?uid=<mã> trên máy khác
// để dùng chung tiến độ.
const API = String(siteConfig.customFields?.apiUrl ?? '').replace(/\/$/, '');
const UID_KEY = 'ngu-phap-uid';
const UID = /^[A-Za-z0-9_-]{6,64}$/;
const DEBOUNCE_MS = 400;

let uid: string | undefined;

export function getUid(): string {
  if (uid) return uid;
  const fromUrl = new URLSearchParams(window.location.search).get('uid');
  let stored: string | null = null;
  try {
    stored = window.localStorage.getItem(UID_KEY);
  } catch {
    // storage bị chặn: mã chỉ tồn tại trong phiên này
  }
  uid = fromUrl && UID.test(fromUrl) ? fromUrl : stored && UID.test(stored) ? stored : crypto.randomUUID();
  try {
    window.localStorage.setItem(UID_KEY, uid);
  } catch {
    // bỏ qua
  }
  return uid;
}

const base = () => `${API}/api/learners/${encodeURIComponent(getUid())}`;

type Remote = {progress: unknown | null; notes: Record<string, string>};
let remote: Promise<Remote> | undefined;

/** Tải dữ liệu của học viên một lần cho cả trang. */
export function loadRemote(): Promise<Remote> {
  remote ??= fetch(base()).then((r) => {
    if (!r.ok) throw new Error(`API ${r.status}`);
    return r.json() as Promise<Remote>;
  });
  return remote;
}

// Gom các lần ghi liên tiếp (gõ phím, bấm nhiều lần) thành một request cho mỗi khóa.
const pending = new Map<string, {timer: ReturnType<typeof setTimeout>; send: (keepalive?: boolean) => void}>();

function schedule(id: string, path: string, body: unknown) {
  clearTimeout(pending.get(id)?.timer);
  const send = (keepalive = false) => {
    pending.delete(id);
    fetch(`${base()}${path}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body),
      keepalive,
    }).catch((err) => console.warn('Không lưu được lên máy chủ:', err));
  };
  pending.set(id, {timer: setTimeout(send, DEBOUNCE_MS), send});
}

if (typeof window !== 'undefined') {
  // Rời trang khi còn thay đổi chưa gửi: gửi ngay.
  window.addEventListener('pagehide', () => {
    for (const p of [...pending.values()]) {
      clearTimeout(p.timer);
      p.send(true);
    }
  });
}

export function saveProgress(p: unknown) {
  schedule('progress', '/progress', p);
}

// ---- Ý dàn ý (Outline) ----

const LEGACY_NOTE_PREFIX = 'outline:';
let notes: Promise<Record<string, string>> | undefined;

/** Toàn bộ ý dàn ý của học viên; lần đầu chuyển dữ liệu cũ từ localStorage lên máy chủ. */
export function loadNotes(): Promise<Record<string, string>> {
  notes ??= loadRemote()
    .then((r) => {
      if (Object.keys(r.notes).length) return {...r.notes};
      const legacy: Record<string, string> = {};
      try {
        for (let i = 0; i < window.localStorage.length; i++) {
          const k = window.localStorage.key(i);
          const v = k?.startsWith(LEGACY_NOTE_PREFIX) && window.localStorage.getItem(k);
          if (k && v) legacy[k] = v;
        }
      } catch {
        // bỏ qua
      }
      for (const [k, v] of Object.entries(legacy)) schedule(`note:${k}`, `/notes/${encodeURIComponent(k)}`, {value: v});
      return legacy;
    })
    .catch((err) => {
      console.warn('Không tải được ý dàn ý từ máy chủ:', err);
      return {};
    });
  return notes;
}

export function saveNote(key: string, value: string) {
  void loadNotes().then((n) => {
    if (value) n[key] = value;
    else delete n[key];
  });
  schedule(`note:${key}`, `/notes/${encodeURIComponent(key)}`, {value});
}
