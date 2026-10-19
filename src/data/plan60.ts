// Lộ trình 60 ngày: ngữ pháp học 3 vòng (học mới → ôn lần 2 → ôn lần 3), mỗi ngày 1 chủ đề nói,
// phản xạ xen kẽ, đầu buổi ôn từ vựng hôm trước, cuối buổi chuẩn bị từ vựng cho hôm sau.
// Nội dung lấy từ dữ liệu sẵn có: topics.json (ngữ pháp), skills.ts (luyện nói), reflex/topics.json (phản xạ).

import topicsData from '@site/src/data/topics.json';
import reflexData from '@site/src/data/reflex/topics.json';
import {SKILLS} from '@site/src/data/skills';

const grammar = topicsData as Record<string, {short: string; path: string}>;
const reflexTopics = reflexData as {no: number; slug: string; vi: string; en: string}[];

export type Link = {label: string; to: string; hint?: string};
export type Block = {kind: 'vocab' | 'grammar' | 'speaking' | 'reflex' | 'test' | 'prep'; title: string; minutes: number; how: string; links: Link[]};
export type PlanDay = {day: number; week: number; sunday: boolean; focus: string; blocks: Block[]};
export type PlanWeek = {no: number; title: string; goal: string};

export const WEEKS: PlanWeek[] = [
  {no: 1, title: 'Vòng 1 · Nền tảng & thì hiện tại', goal: 'Học mới G01–G06. Chủ đề nói xen kẽ: bản thân, sở thích, phỏng vấn, học tập, ẩm thực, stand-up.'},
  {no: 2, title: 'Vòng 1 · Thì hoàn thành, tương lai, modal', goal: 'Học mới G07–G13. Chủ đề nói xen kẽ đời sống – kể chuyện – công việc – quan điểm – IT.'},
  {no: 3, title: 'Vòng 1 · Danh từ, tính từ, câu điều kiện', goal: 'Học mới G14–G21. Mỗi tuần vẫn đủ 5 nhóm chủ đề nói, không học dồn một nhóm.'},
  {no: 4, title: 'Vòng 1 · Câu phức & cấu trúc nâng cao', goal: 'Học mới G22–G29 – xong vòng 1. Thêm chủ đề quan điểm & phỏng vấn kỹ thuật.'},
  {no: 5, title: 'Vòng 2 · Ôn lần 2 (trộn chủ đề)', goal: 'Mỗi buổi ôn 2–3 chủ đề ngữ pháp khác nhóm. Làm quiz trước, chỉ đọc lại phần sai.'},
  {no: 6, title: 'Vòng 2 · Ôn lần 2 (trộn chủ đề)', goal: 'Hoàn thành vòng 2. Chủ đề nói cuối: system design, tiền bạc, AI, thỏa thuận lương.'},
  {no: 7, title: 'Vòng 3 · Ôn lần 3 (trộn chủ đề)', goal: 'Tự viết lại công thức từ trí nhớ. Xen kẽ nói lại chủ đề cũ ở cấp 3 và phỏng vấn thử.'},
  {no: 8, title: 'Vòng 3 · Ôn lần 3 (trộn chủ đề) + tổng ôn', goal: 'Hoàn thành vòng 3. Phỏng vấn thử xen kẽ nói lại, bài kiểm tra cuối khóa.'},
];

// ---- Ngữ pháp: 3 vòng, mỗi mã xuất hiện đúng 3 lần ----
// Vòng 1 giữ thứ tự vì bài sau dựa trên bài trước; vòng 2–3 trộn chủ đề khác nhóm trong cùng một buổi
// cho đỡ ngán và để phải phân biệt các cấu trúc với nhau.
const R1: string[][] = [
  ['G01'], ['G02'], ['G03'], ['G04'], ['G05'], ['G06'],
  ['G07'], ['G08'], ['G09', 'G10'], ['G11'], ['G12'], ['G13'],
  ['G14', 'G15'], ['G16', 'G17'], ['G18'], ['G19'], ['G20'], ['G21'],
  ['G22'], ['G23'], ['G24'], ['G25'], ['G26', 'G27'], ['G28', 'G29'],
];
const R2: string[][] = [
  ['G01', 'G14', 'G20'], ['G02', 'G03', 'G18'], ['G04', 'G05', 'G22'], ['G06', 'G07', 'G17'], ['G08', 'G23'], ['G09', 'G10', 'G24'],
  ['G11', 'G19'], ['G12', 'G21'], ['G13', 'G15'], ['G16', 'G25'], ['G26', 'G27'], ['G28', 'G29'],
];
const R3: string[][] = [
  ['G02', 'G19', 'G22'], ['G04', 'G06', 'G21'], ['G03', 'G13', 'G16'], ['G05', 'G08', 'G25'], ['G09', 'G17'], ['G01', 'G24'],
  ['G07', 'G11', 'G27'], ['G10', 'G18'], ['G12', 'G20'], ['G14', 'G23'], ['G15', 'G28'], ['G26', 'G29'],
];

const ROUND_HOW: Record<1 | 2 | 3, {title: string; how: string; minutes: number}> = {
  1: {
    title: 'Ngữ pháp · Học mới (lần 1)',
    minutes: 30,
    how: 'Đọc kỹ bài, chép công thức và 3 ví dụ vào vở. Làm bài quiz cuối trang. Đặt 5 câu về chính bạn với cấu trúc vừa học.',
  },
  2: {
    title: 'Ngữ pháp · Ôn lần 2',
    minutes: 25,
    how: 'Làm quiz cuối trang TRƯỚC khi đọc lại. Chỉ đọc lại phần làm sai, ghi lỗi vào sổ. Cố dùng mỗi cấu trúc ít nhất 1 lần trong bài nói hôm nay.',
  },
  3: {
    title: 'Ngữ pháp · Ôn lần 3',
    minutes: 20,
    how: 'Gấp sách, tự viết lại công thức và 1 ví dụ cho mỗi chủ đề từ trí nhớ. Mở bài ra so, làm lại quiz (mục tiêu ≥ 90%). Nói 3 câu không chuẩn bị với mỗi cấu trúc.',
  },
};

// ---- Luyện nói: mỗi ngày 1 chủ đề (new = học mới, review = nói lại cấp 3, mock = phỏng vấn thử) ----
// Không theo thứ tự menu: mỗi tuần 1–6 xen kẽ đủ 5 nhóm (đời sống, kể chuyện, học tập/công việc, quan điểm, 2 chủ đề IT);
// chủ đề ít ngữ pháp xếp tuần đầu, chủ đề cần câu điều kiện / bị động xếp sau.
type Sp = [number, 'new' | 'review' | 'mock'];
const SPEAKING: Sp[] = [
  [1, 'new'], [7, 'new'], [17, 'new'], [9, 'new'], [15, 'new'], [35, 'new'], [1, 'review'],
  [3, 'new'], [5, 'new'], [18, 'new'], [11, 'new'], [13, 'new'], [23, 'new'], [18, 'review'],
  [2, 'new'], [6, 'new'], [22, 'new'], [10, 'new'], [16, 'new'], [36, 'new'], [6, 'review'],
  [27, 'new'], [30, 'new'], [19, 'new'], [31, 'new'], [14, 'new'], [24, 'new'], [14, 'review'],
  [4, 'new'], [8, 'new'], [20, 'new'], [12, 'new'], [34, 'new'], [25, 'new'], [8, 'review'],
  [28, 'new'], [29, 'new'], [21, 'new'], [32, 'new'], [33, 'new'], [26, 'new'], [21, 'review'],
  [17, 'mock'], [6, 'review'], [33, 'review'], [18, 'mock'], [29, 'review'], [16, 'review'], [12, 'review'],
  [20, 'mock'], [11, 'review'], [22, 'mock'], [1, 'review'], [24, 'mock'], [35, 'mock'], [26, 'review'],
  [36, 'review'], [25, 'mock'], [21, 'mock'], [17, 'mock'],
];

const SPEAK_HOW: Record<Sp[1], {title: string; how: string; minutes: number}> = {
  new: {
    title: 'Luyện nói · Chủ đề mới',
    minutes: 25,
    how: 'Trả lời nhanh 3–4 câu Part 1. Mở 🧭 Dàn ý đề Part 2: làm Cấp 1 → Cấp 2, ghi từ khóa của bạn vào ô, bấm ⏱ và ghi âm. Còn thời gian thì thử Cấp 3. Sau đó mới nghe bài mẫu.',
  },
  review: {
    title: 'Luyện nói · Nói lại (cấp 3)',
    minutes: 20,
    how: 'Không mở dàn ý: nói đề Part 2 trong 2 phút ở Cấp 3 (lý do + ví dụ + cảm xúc), ghi âm. Mở dàn ý ra so, bổ sung ý còn thiếu, nói lại lần 2. Shadowing bài mẫu 1 lần.',
  },
  mock: {
    title: 'Luyện nói · Phỏng vấn thử',
    minutes: 25,
    how: 'Đặt điện thoại ghi âm, tự hỏi (hoặc nhờ người hỏi) 3–5 câu của chủ đề và trả lời không nhìn tài liệu, 1–2 phút mỗi câu, có số liệu thật của bạn. Nghe lại, chấm theo checklist cuối trang.',
  },
};

// ---- Phản xạ: 30 chủ đề. Tuần 1–6: ngày 2, 4, 6 của tuần; tuần 7–8: mọi ngày học ----
const REFLEX_DAYS = [2, 4, 6, 9, 11, 13, 16, 18, 20, 23, 25, 27, 30, 32, 34, 37, 39, 41, 43, 44, 45, 46, 47, 48, 50, 51, 52, 53, 54, 55];
// Thứ tự chủ đề phản xạ cũng trộn nhóm (bản thân – mua sắm – giải trí – đi lại – công việc…) thay vì 1 → 30.
const REFLEX_ORDER = [2, 7, 13, 21, 10, 26, 1, 5, 9, 23, 14, 25, 3, 6, 12, 27, 19, 22, 4, 8, 15, 28, 17, 24, 11, 16, 18, 20, 29, 30];

// ---- Chủ nhật & 4 ngày cuối ----
type Extra = {focus: string; grammar: Block; reflex?: Block};
const test = (slug: string, label: string): Link => ({label, to: `/docs/bai-kiem-tra/${slug}`});
const SUNDAY_REFLEX: Block = {
  kind: 'reflex',
  title: 'Phản xạ · Ôn câu sai trong tuần',
  minutes: 10,
  how: 'Mở lại các chủ đề phản xạ trong tuần, chỉ làm lại những câu lần trước bạn nói chậm hoặc sai.',
  links: [],
};
const EXTRA: Record<number, Extra> = {
  7: {focus: 'Ôn tuần 1', grammar: {kind: 'grammar', title: 'Ngữ pháp · Ôn tuần', minutes: 25, how: 'Làm lại quiz G01–G06, chỉ đọc lại phần sai. Viết 1 đoạn 10 câu về bản thân dùng đủ hiện tại đơn, tiếp diễn, hoàn thành.', links: ['G01', 'G02', 'G03', 'G04', 'G05', 'G06'].map(gLink)}},
  14: {focus: 'Kiểm tra tuần 1', grammar: {kind: 'test', title: 'Bài kiểm tra Tuần 1 (G01–G07)', minutes: 30, how: 'Làm bài trong 30 phút, không xem tài liệu. Dưới 80%: ghi lại mã chủ đề sai để ôn kỹ ở vòng 2.', links: [test('tuan-1', 'Bài kiểm tra Tuần 1')]}},
  21: {focus: 'Kiểm tra tuần 2', grammar: {kind: 'test', title: 'Bài kiểm tra Tuần 2 (G08–G13)', minutes: 30, how: 'Làm bài trong 30 phút, không xem tài liệu. Ghi mã chủ đề sai vào sổ.', links: [test('tuan-2', 'Bài kiểm tra Tuần 2')]}},
  28: {focus: 'Kiểm tra tuần 3', grammar: {kind: 'test', title: 'Bài kiểm tra Tuần 3 (G14–G19)', minutes: 30, how: 'Làm bài trong 30 phút, không xem tài liệu. Ghi mã chủ đề sai vào sổ.', links: [test('tuan-3', 'Bài kiểm tra Tuần 3')]}},
  35: {focus: 'Kiểm tra tuần 4', grammar: {kind: 'test', title: 'Bài kiểm tra Tuần 4 (G20–G29)', minutes: 30, how: 'Vòng 1 đã xong toàn bộ 29 chủ đề. Làm bài trong 30 phút, ghi mã chủ đề sai vào sổ.', links: [test('tuan-4', 'Bài kiểm tra Tuần 4')]}},
  42: {focus: 'Làm lại kiểm tra 1–2', grammar: {kind: 'test', title: 'Làm lại Bài kiểm tra Tuần 1 + 2', minutes: 35, how: 'Hết vòng 2. So điểm với lần đầu – mục tiêu ≥ 85%. Chủ đề nào vẫn sai, đánh dấu ưu tiên cho vòng 3.', links: [test('tuan-1', 'Tuần 1'), test('tuan-2', 'Tuần 2')]}},
  49: {focus: 'Làm lại kiểm tra 3–4', grammar: {kind: 'test', title: 'Làm lại Bài kiểm tra Tuần 3 + 4', minutes: 35, how: 'So điểm với lần đầu – mục tiêu ≥ 85%. Đọc Sổ tay lỗi thường gặp, đối chiếu với lỗi của bạn.', links: [test('tuan-3', 'Tuần 3'), test('tuan-4', 'Tuần 4'), {label: 'Sổ tay lỗi thường gặp', to: '/docs/tra-cuu/loi-thuong-gap'}]}},
  56: {focus: 'Tổng ôn ngữ pháp', grammar: {kind: 'grammar', title: 'Ngữ pháp · Tổng ôn', minutes: 30, how: 'Học bảng tổng hợp 12 thì. Tự kiểm tra: nhìn tên thì → nói công thức + 1 ví dụ.', links: [{label: 'Tổng hợp 12 thì', to: '/docs/ngu-phap/tong-hop-12-thi'}]}},
  57: {focus: 'Ôn chủ đề yếu', grammar: {kind: 'grammar', title: 'Ngữ pháp · Chủ đề yếu nhất', minutes: 30, how: 'Lấy 3 chủ đề sai nhiều nhất trong sổ lỗi, học lại theo cách vòng 3 (viết từ trí nhớ → so → quiz).', links: [{label: 'Bản đồ 29 chủ đề', to: '/docs/ngu-phap'}, {label: 'Sổ tay lỗi thường gặp', to: '/docs/tra-cuu/loi-thuong-gap'}]}, reflex: {...SUNDAY_REFLEX, title: 'Phản xạ · Trộn chủ đề', how: 'Chọn ngẫu nhiên 3 chủ đề phản xạ đã học, mỗi chủ đề làm 10 câu nâng cao.'}},
  58: {focus: 'Kiểm tra cuối khóa', grammar: {kind: 'test', title: 'Bài kiểm tra Cuối khóa (G01–G29)', minutes: 45, how: 'Làm bài trong 45 phút, không xem tài liệu. Mục tiêu ≥ 80%.', links: [test('cuoi-khoa', 'Bài kiểm tra Cuối khóa')]}},
  59: {focus: 'Sửa lỗi bài cuối khóa', grammar: {kind: 'grammar', title: 'Ngữ pháp · Chữa bài cuối khóa', minutes: 30, how: 'Với mỗi câu sai trong bài cuối khóa: mở chủ đề tương ứng, đọc lại đúng phần đó, viết 2 câu đúng.', links: [test('cuoi-khoa', 'Bài kiểm tra Cuối khóa')]}, reflex: {...SUNDAY_REFLEX, title: 'Phản xạ · Trộn chủ đề', how: 'Chọn ngẫu nhiên 3 chủ đề phản xạ khác hôm qua, mỗi chủ đề làm 10 câu nâng cao.'}},
  60: {focus: 'Tổng kết 2 tháng', grammar: {kind: 'grammar', title: 'Ngữ pháp · Tổng kết', minutes: 20, how: 'Nghe lại bản ghi âm ngày 1 và hôm nay, ghi 3 điểm đã tiến bộ và 3 điểm cần luyện tiếp. Lập kế hoạch 2 tháng tiếp theo.', links: [{label: 'Sổ tay lỗi thường gặp', to: '/docs/tra-cuu/loi-thuong-gap'}]}},
};

function gLink(code: string): Link {
  return {label: `${code} · ${grammar[code]?.short ?? ''}`, to: grammar[code]?.path ?? '/docs/ngu-phap'};
}

function speakTopic(no: number) {
  return SKILLS.noi.topics.find((t) => t.no === no)!;
}
function speakLink(no: number): Link {
  const t = speakTopic(no);
  return {label: `${String(no).padStart(2, '0')} · ${t.title}`, to: `${SKILLS.noi.base}/${t.slug}`};
}
function reflexLink(no: number): Link {
  const t = reflexTopics.find((r) => r.no === no)!;
  return {label: `${String(no).padStart(2, '0')} · ${t.vi}`, to: `/luyen-phan-xa/${t.slug}`};
}

function build(): PlanDay[] {
  const learnDays: number[] = [];
  for (let d = 1; d <= 56; d++) if (d % 7 !== 0) learnDays.push(d);
  // 48 ngày học trong 8 tuần: 24 ngày vòng 1, 12 ngày vòng 2, 12 ngày vòng 3
  const grammarOf = new Map<number, {round: 1 | 2 | 3; codes: string[]}>();
  [...R1.map((c) => ({round: 1 as const, codes: c})), ...R2.map((c) => ({round: 2 as const, codes: c})), ...R3.map((c) => ({round: 3 as const, codes: c}))].forEach(
    (g, i) => grammarOf.set(learnDays[i], g),
  );
  const reflexOf = new Map(REFLEX_DAYS.map((d, i) => [d, REFLEX_ORDER[i]]));

  const days: PlanDay[] = [];
  for (let d = 1; d <= 60; d++) {
    const [spNo, spMode] = SPEAKING[d - 1];
    const sp = SPEAK_HOW[spMode];
    const g = grammarOf.get(d);
    const extra = EXTRA[d];
    const reflexNo = reflexOf.get(d);
    const sunday = d % 7 === 0;

    const blocks: Block[] = [];
    // ô "ôn từ vựng" & "chuẩn bị" được điền ở vòng sau, khi đã biết hôm trước/hôm sau
    blocks.push({kind: 'vocab', title: 'Ôn từ vựng', minutes: sunday ? 20 : 10, how: '', links: []});
    if (g) {
      const r = ROUND_HOW[g.round];
      blocks.push({kind: 'grammar', title: r.title, minutes: r.minutes, how: r.how, links: g.codes.map(gLink)});
    } else if (extra) {
      blocks.push(extra.grammar);
    }
    blocks.push({kind: 'speaking', title: sp.title, minutes: sp.minutes, how: sp.how, links: [speakLink(spNo)]});
    if (reflexNo) {
      blocks.push({
        kind: 'reflex',
        title: 'Phản xạ',
        minutes: 15,
        how: 'Làm 10 câu cơ bản + 10 câu trung bình: nhìn câu tiếng Việt, nói to câu tiếng Anh trong 5 giây rồi mới xem đáp án. Câu nào chậm/sai đánh dấu để ôn Chủ nhật.',
        links: [reflexLink(reflexNo)],
      });
    } else if (extra?.reflex) {
      blocks.push(extra.reflex);
    } else if (sunday) {
      const weekStart = d - 6;
      blocks.push({...SUNDAY_REFLEX, links: REFLEX_DAYS.filter((x) => x >= weekStart && x < d).map((x) => reflexLink(reflexOf.get(x)!))});
    }
    blocks.push({kind: 'prep', title: 'Chuẩn bị từ vựng cho buổi sau', minutes: 10, how: '', links: []});

    const focus = g
      ? `${g.round === 1 ? 'Học' : `Ôn lần ${g.round}`} ${g.codes.join(', ')} · Nói ${String(spNo).padStart(2, '0')}`
      : `${extra?.focus ?? ''} · Nói ${String(spNo).padStart(2, '0')}`;
    days.push({day: d, week: Math.min(8, Math.ceil(d / 7)), sunday, focus, blocks});
  }

  // Điền ô ôn từ vựng (từ hôm trước) và chuẩn bị (cho hôm sau)
  const vocabLinks = (day: PlanDay | undefined): Link[] =>
    day ? day.blocks.filter((b) => b.kind === 'speaking' || (b.kind === 'reflex' && b.title === 'Phản xạ')).flatMap((b) => b.links) : [];
  days.forEach((day, i) => {
    const review = day.blocks[0];
    const prep = day.blocks[day.blocks.length - 1];
    if (day.sunday) {
      review.how =
        'Buổi ôn từ vựng của cả tuần: mở mục 1 (Từ vựng) của từng chủ đề nói trong tuần, che cột nghĩa, nhìn từ → nói nghĩa + đặt 1 câu. Từ nào quên chép vào sổ / trang Từ vựng đang học.';
      review.links = days
        .slice(i - 6, i)
        .flatMap((x) => x.blocks.filter((b) => b.kind === 'speaking').flatMap((b) => b.links))
        .filter((l, k, arr) => arr.findIndex((o) => o.to === l.to) === k)
        .concat({label: '📒 Từ vựng đang học', to: '/docs/tra-cuu/tu-vung-dang-hoc'});
    } else if (i === 0) {
      review.how = 'Ngày đầu: đọc trang Từ vựng đang học, chọn 10 từ muốn nhớ, bấm 🔊 nghe và nhắc lại.';
      review.links = [{label: '📒 Từ vựng đang học', to: '/docs/tra-cuu/tu-vung-dang-hoc'}];
    } else {
      review.how =
        'Ôn từ của buổi trước: che cột nghĩa trong bảng từ vựng, nhìn từ → nói nghĩa và đặt 1 câu ngắn. Bấm 🔊 cho từ nào phát âm chưa chắc. Từ quên → chép vào sổ.';
      review.links = vocabLinks(days[i - 1]);
    }
    const next = days[i + 1];
    if (next) {
      prep.how =
        'Xem trước từ vựng buổi sau: mở mục 1 (Từ vựng) của chủ đề nói ngày mai, bấm 🔊 nghe từng từ, nhắc lại 2 lần, chọn 5 từ sẽ dùng khi nói. Nếu mai có phản xạ, đọc lướt phần gợi ý từ vựng.';
      prep.links = vocabLinks(next);
    } else {
      prep.title = 'Từ vựng · Kế hoạch tiếp theo';
      prep.how = 'Gom các từ trong sổ bạn vẫn hay quên thành 1 danh sách, ôn lại mỗi sáng trong tuần tới.';
      prep.links = [{label: '📒 Từ vựng đang học', to: '/docs/tra-cuu/tu-vung-dang-hoc'}];
    }
  });
  return days;
}

export const PLAN: PlanDay[] = build();

/** Số lần mỗi mã ngữ pháp được học/ôn trong lộ trình (dùng để hiển thị và kiểm tra đủ 3 lần). */
export const GRAMMAR_COUNT: Record<string, number> = [...R1, ...R2, ...R3].flat().reduce(
  (acc, c) => ({...acc, [c]: (acc[c] ?? 0) + 1}),
  {} as Record<string, number>,
);
