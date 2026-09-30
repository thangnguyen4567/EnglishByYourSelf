# Ngữ pháp tiếng Anh 30 ngày – website (Docusaurus)

Website tài liệu được sinh từ `../Ngu-phap-tieng-Anh-30-ngay.xlsx`.

## Chạy

```bash
npm install
npm start          # dev server: http://localhost:3000
npm run build      # build tĩnh vào ./build
npm run serve      # xem bản build
```

## Cập nhật nội dung từ Excel

Sửa file Excel rồi chạy (cần Python + `openpyxl`):

```bash
npm run generate
```

Script `scripts/generate_docs.py` ghi đè các file **sinh tự động**:

| Nguồn (sheet) | Sinh ra |
|---|---|
| Ngữ pháp | `docs/ngu-phap/**/gXX-*.mdx` (29 chủ đề, xếp theo 9 nhóm), `docs/tra-cuu/{bang-tra-cuu,loi-thuong-gap}.mdx` |
| Test Tuần 1–4, Test Cuối Khóa, Đáp án | `docs/bai-kiem-tra/{tuan-1..4,cuoi-khoa}.mdx`, `src/data/tests.json` |

Các trang **viết tay** (không bị ghi đè): `docs/intro.mdx`, `docs/phuong-phap-hoc.mdx`,
`docs/ngu-phap/index.mdx`, `docs/ngu-phap/02-thi/tong-hop-12-thi.mdx`,
`docs/bai-kiem-tra/index.mdx`, `docs/tra-cuu/tu-vung-dang-hoc.mdx`.

Phân nhóm chủ đề nằm ở hằng `GROUPS` đầu file script.

## Nội dung bổ sung cho từng chủ đề

Phần giải thích chi tiết, ví dụ mở rộng, hội thoại mẫu, so sánh… được viết tay trong
`content/grammar/gXX.mdx` và được script chèn vào trang chủ đề tương ứng. File chia khối bằng dòng đánh dấu:

| Khối | Vị trí trong trang |
|---|---|
| `{/* @intro */}` | Đầu trang (hộp Tổng quan) |
| `{/* @structure */}` | Cuối mục Cấu trúc |
| `{/* @usage */}` | Cuối mục Cách dùng |
| `{/* @signals */}` | Cuối mục Dấu hiệu nhận biết |
| `{/* @examples */}` | Cuối mục Ví dụ |
| `{/* @mistakes */}` | Cuối mục Lỗi thường gặp |
| `{/* @compare */}` | Mục riêng "Phân biệt & mở rộng" |
| `{/* @summary */}` | Mục riêng "Tóm tắt ghi nhớ" |

Xem `content/grammar/g02.mdx` làm mẫu. Sau khi sửa, chạy `npm run generate`.

## Component

- `Quiz` – trắc nghiệm, chế độ `exam` (nộp bài, chấm điểm, gợi ý chủ đề cần ôn) và `practice` (xem đáp án ngay).
- `ProgressDashboard` / `DayCheck` – theo dõi tiến độ 30 ngày và điểm bài kiểm tra (lưu trong localStorage).
- `TopicMeta` – dải thông tin đầu trang chủ đề (mã, nhóm, ngày học, chủ đề trước/sau).

## Bài kiểm tra theo cấp độ (30 câu / chủ đề)

Mỗi chủ đề có file `content/quizzes/gXX.json` gồm 3 cấp `easy`, `normal`, `hard`, mỗi cấp 10 câu:

```json
{"easy": [{"q": "She ___ to work every day.", "options": {"A": "go", "B": "goes", "C": "is going", "D": "went"},
           "answer": "B", "explain": "Giải thích bằng tiếng Việt."}], "normal": [], "hard": []}
```

Kiểm tra định dạng: `python -X utf8 scripts/check_quiz.py` (hoặc `... check_quiz.py g02`).
`npm run generate` kiểm tra lại, ghi `src/data/quizzes/gXX.json` và thêm mục bài kiểm tra vào trang chủ đề
(component `LevelQuiz` – 3 tab, điểm cao nhất mỗi cấp lưu trong trình duyệt).

## Câu bổ sung cho bài kiểm tra tuần (Trung bình + Khó)

`content/tests/{tuan-1..4,cuoi-khoa}.json` = `{"normal": [...], "hard": [...]}`; mỗi câu như câu quiz nhưng có thêm
`"code": "G06"` (phải nằm trong phạm vi chủ đề của bài). Các câu này được nối sau các câu "Cơ bản" lấy từ Excel.
Kiểm tra: `python -X utf8 scripts/check_quiz.py tuan-1 cuoi-khoa`.

## Luyện nói & Luyện viết (menu riêng)

Hai mục là 2 instance docs riêng (`speaking/` → `/luyen-noi`, `writing/` → `/luyen-viet`), mỗi mục có sidebar riêng
(`sidebarsSkill.ts`) và mục menu riêng trên thanh điều hướng. Danh sách 26 chủ đề nói (giai đoạn 5 = phỏng vấn IT) + 16 chủ đề viết (id, slug, giai đoạn,
ngữ pháp liên quan) nằm ở `src/data/skills.ts` – lộ trình, thanh thông tin đầu trang và tiến độ đều đọc từ đây.

Component dùng trực tiếp trong MDX (đăng ký ở `src/theme/MDXComponents.tsx`, không cần import):

| Component | Tác dụng |
|---|---|
| `<SkillMeta id="noi-01" />` | Giai đoạn, ngữ pháp nên dùng, bài trước/sau, ô "Đã luyện xong" |
| `<SkillRoadmap skill="noi" />` | Lộ trình theo giai đoạn + tiến độ |
| `<VocabList>` bảng `</VocabList>` | Thêm nút 🔊 nghe phát âm cho từ (cột 1) và câu ví dụ (cột cuối) |
| `<SpeakText title="…">` nội dung `</SpeakText>` | Khung bài mẫu có nút 🔊 Nghe (bỏ qua phần `<details>` bản dịch) |

Âm thanh dùng Web Speech API của trình duyệt – không cần file âm thanh hay API key.
Trang mẫu: `speaking/01-ban-than/01-gioi-thieu-ban-than.mdx`, `writing/01-cau-doan-van/02-doan-van-gioi-thieu.mdx`.

## Triển khai lên GitHub Pages (user site)

Site được cấu hình cho **user site** `https://<username>.github.io/` (`baseUrl: '/'`). Thư mục `website/` là **gốc của repo**.

1. Tạo repo trên GitHub tên **`<username>.github.io`** (public).
2. Trong thư mục `website/`:
   ```bash
   git init -b main
   git add .
   git commit -m "Initial site"
   git remote add origin https://github.com/<username>/<username>.github.io.git
   git push -u origin main
   ```
3. Trên GitHub: **Settings → Pages → Build and deployment → Source = GitHub Actions**.
4. Workflow `.github/workflows/deploy.yml` tự build (`npm ci` + `npm run build`) và deploy mỗi lần push lên `main`
   (xem tab **Actions**). Sau 1–2 phút, site có tại `https://<username>.github.io/`.

Muốn dùng **project site** (`https://<username>.github.io/<repo>/`): trong workflow thêm `BASE_URL: /<repo>/` vào phần `env` của bước Build.

Build thử trên máy: `npm run build` rồi `npm run serve`. Lưu ý: CI không chạy `npm run generate` – hãy chạy lệnh đó trên máy
và commit các file sinh ra trước khi push.
