"""Kiểm tra file content/quizzes/gXX.json (không ghi file nào).

Chạy:  python -X utf8 scripts/check_quiz.py g02 g03 ...   (không tham số = kiểm tra tất cả)
       python -X utf8 scripts/check_quiz.py tuan-1 cuoi-khoa  (câu bổ sung bài kiểm tra tuần)
"""
import json
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "content" / "quizzes"
LEVELS = ("easy", "normal", "hard")


def check(path: Path) -> list[str]:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        return [f"JSON lỗi: {e}"]
    return check_data(data)


def check_data(data: dict, levels=LEVELS) -> list[str]:
    errors, seen = [], set()
    extra = set(data) - set(LEVELS)
    if extra:
        errors.append(f"khóa thừa: {extra}")
    answers = Counter()
    for level in levels:
        items = data.get(level, [])
        if len(items) != 10:
            errors.append(f"{level}: cần 10 câu, có {len(items)}")
        for i, q in enumerate(items, start=1):
            where = f"{level} #{i}"
            if set(q) - {"q", "options", "answer", "explain"}:
                errors.append(f"{where}: khóa thừa {set(q) - {'q', 'options', 'answer', 'explain'}}")
            opts = q.get("options", {})
            if sorted(opts) != list("ABCD") or not all(str(v).strip() for v in opts.values()):
                errors.append(f"{where}: options phải có đủ A-D, không rỗng")
            elif len({str(v).strip().lower() for v in opts.values()}) != 4:
                errors.append(f"{where}: có 2 phương án trùng nhau")
            ans = q.get("answer")
            if ans not in ("A", "B", "C", "D"):
                errors.append(f"{where}: answer phải là A/B/C/D")
            answers[ans] += 1
            if not str(q.get("q", "")).strip() or not str(q.get("explain", "")).strip():
                errors.append(f"{where}: thiếu câu hỏi hoặc giải thích")
            key = str(q.get("q", "")).strip().lower()
            if key in seen:
                errors.append(f"{where}: câu hỏi bị lặp")
            seen.add(key)
            for field in [q.get("q", ""), q.get("explain", ""), *opts.values()]:
                if any(c in str(field) for c in "{}<>"):
                    errors.append(f"{where}: không dùng ký tự {{ }} < > trong nội dung")
                    break
    total = sum(answers.values())
    if total and max(answers.values()) > total * 0.4:
        errors.append(f"đáp án phân bố lệch: {dict(answers)} (không chữ cái nào quá 40%)")
    return errors


TESTS = ROOT / "content" / "tests"
TEST_RANGE = {"tuan-1": (1, 7), "tuan-2": (8, 13), "tuan-3": (14, 19), "tuan-4": (20, 29), "cuoi-khoa": (1, 29)}


def check_test(path: Path) -> list[str]:
    """File câu bổ sung: {"normal": [...10], "hard": [...10]}, mỗi câu có thêm "code"."""
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        return [f"JSON lỗi: {e}"]
    lo, hi = TEST_RANGE[path.stem]
    tmp = {"easy": [], **{k: [{kk: vv for kk, vv in q.items() if kk != "code"} for q in v] for k, v in data.items()}}
    errors = [e for e in check_data(tmp, levels=("normal", "hard"))]
    for level in ("normal", "hard"):
        for i, q in enumerate(data.get(level, []), start=1):
            code = str(q.get("code", ""))
            if len(code) != 3 or not code.startswith("G") or not code[1:].isdigit() or not lo <= int(code[1:]) <= hi:
                errors.append(f"{level} #{i}: code '{code}' phải trong G{lo:02d}–G{hi:02d}")
    return errors


def main():
    names = sys.argv[1:] or [p.stem for p in sorted(SRC.glob("g*.json"))]
    bad = 0
    for name in names:
        stem = name.lower().removesuffix('.json')
        is_test = stem in TEST_RANGE
        path = (TESTS if is_test else SRC) / f"{stem}.json"
        if not path.exists():
            print(f"✘ {path.name}: không tồn tại")
            bad += 1
            continue
        errs = check_test(path) if is_test else check(path)
        if errs:
            bad += 1
            print(f"✘ {path.name}")
            for e in errs:
                print(f"   - {e}")
        else:
            print(f"✔ {path.name}")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
