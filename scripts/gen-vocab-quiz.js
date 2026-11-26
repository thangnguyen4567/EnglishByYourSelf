// Sinh src/data/quizzes/tu-vung-tong-hop.json – kiểm tra tổng hợp từ vựng 7 câu chuyện.
const fs = require('fs');
const path = require('path');
const out = process.argv[2] || path.join(__dirname, '../src/data/quizzes/tu-vung-tong-hop.json');
// Chạy: node scripts/gen-vocab-quiz.js  (thêm từ mới vào EASY/NORMAL/HARD rồi chạy lại)

// Xáo trộn có seed để kết quả ổn định giữa các lần chạy.
let seed = 1;
const rnd = () => { // mulberry32
  seed = (seed + 0x6d2b79f5) | 0; let t = seed;
  t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const shuffle = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const LET = ['A', 'B', 'C', 'D'];
const group = (p) => (['n', 'v', 'adj'].includes(p) ? p : 'other');

// ---- Cấp Dễ: chọn nghĩa ----  [story, từ, từ loại, nghĩa]
const EASY = [
  [1, 'rollout', 'n', 'đợt triển khai, ra mắt (sản phẩm, tính năng)'],
  [1, 'provision', 'v', 'cấp phát, chuẩn bị sẵn (tài nguyên)'],
  [1, 'spike', 'v', 'tăng vọt đột ngột'],
  [1, 'outage', 'n', 'sự cố ngừng hoạt động (mất điện, sập hệ thống)'],
  [1, 'redundancy', 'n', 'cơ chế dự phòng, sự dư thừa'],
  [1, 'coalescing', 'n', 'việc gộp nhiều request giống nhau thành một'],
  [1, 'stale', 'adj', 'cũ, lỗi thời (dữ liệu chưa được cập nhật)'],
  [1, 'isolation', 'n', 'sự cô lập, tách biệt'],
  [1, 'tolerance', 'n', '(fault tolerance) khả năng chịu lỗi'],
  [1, 'recap', 'n', 'phần tóm tắt lại'],
  [2, 'rigid', 'adj', 'cứng nhắc'],
  [2, 'fight over', 'phr. v', 'tranh giành, cãi nhau vì'],
  [2, 'whereas', 'conj', 'trong khi (chỉ sự đối lập)'],
  [2, 'for instance', 'phrase', 'ví dụ như'],
  [2, 'chronological', 'adj', 'theo trình tự thời gian'],
  [2, 'interpreter', 'n', 'phiên dịch viên'],
  [2, 'back and forth', 'phrase', 'qua lại, tới lui'],
  [2, 'get carried away', 'idiom', 'quá hăng say, bị cuốn theo'],
  [2, 'open-ended', 'adj', 'mở, không có đáp án cố định'],
  [2, 'concentration', 'n', 'sự tập trung'],
  [3, 'excursion', 'n', 'chuyến tham quan, dã ngoại'],
  [3, 'stride (strode)', 'v', 'sải bước'],
  [3, 'amble', 'v', 'đi thong thả'],
  [3, 'ridge', 'n', 'sống núi, dải đồi'],
  [3, 'streak', 'n', 'vệt, sọc'],
  [4, 'pandemic', 'n', 'đại dịch'],
  [4, 'investment', 'n', 'sự đầu tư'],
  [5, 'consultant', 'n', 'chuyên gia tư vấn'],
  [5, 'elementary', 'adj', 'sơ đẳng, ở mức nhập môn'],
  [5, 'relentless', 'adj', 'không ngừng nghỉ, bền bỉ, không buông'],
  [5, 'ambition', 'n', 'hoài bão, tham vọng'],
  [5, 'intuition', 'n', 'trực giác'],
  [5, 'get along with', 'phr. v', 'hợp với, hoà thuận với ai'],
  [5, 'take after', 'phr. v', 'giống (bố mẹ, người thân)'],
  [5, 'genuinely', 'adv', 'thật sự, thật lòng'],
  [6, 'fairly', 'adv', 'khá, tương đối'],
  [6, 'be fond of', 'phrase', 'thích, quý mến'],
  [6, 'squeak', 'v', 'kêu cót két, kêu chít chít'],
  [6, 'roast', 'v', 'quay, nướng (thịt)'],
  [6, 'durian', 'n', 'sầu riêng'],
  [6, 'anchor', 'v', 'thả neo'],
  [6, 'crouch', 'v', 'ngồi xổm, cúi khom người'],
  [6, 'manifest', 'adj', 'rõ ràng, hiển nhiên'],
  [7, 'Pope', 'n', 'Giáo hoàng'],
  [7, 'prologue', 'n', 'lời mở đầu, đoạn mở màn'],
  [7, 'overthrow', 'v', 'lật đổ'],
  [7, 'haggle', 'v', 'mặc cả, trả giá'],
  [7, 'rive (riven)', 'v', 'xé toạc, chia rẽ'],
  [7, 'backslide', 'v', 'tái phạm, quay lại thói cũ'],
  [7, 'disguise', 'v', 'cải trang, ngụy trang'],
];

// ---- Cấp Trung bình: điền từ ----  [story, từ gốc, từ loại, nghĩa, câu, đáp án, [nhiễu x3], ghi chú?]
const NORMAL = [
  [1, 'anticipate', 'v', 'lường trước, dự đoán trước', "We didn't ___ so many visitors, so we ran out of food.", 'anticipate', ['mitigate', 'deduce', 'leverage']],
  [1, 'collapse', 'v', 'sụp đổ', 'The old bridge ___ after three days of heavy rain.', 'collapsed', ['spiked', 'provisioned', 'deduced']],
  [1, 'evenly', 'adv', 'đều, đồng đều', 'Cut the cake so that it is shared ___ among the ten children.', 'evenly', ['genuinely', 'barely', 'nevertheless']],
  [1, 'mitigate', 'v', 'giảm nhẹ, giảm thiểu', 'Planting more trees can help ___ the effects of air pollution.', 'mitigate', ['anticipate', 'contest', 'emulate']],
  [1, 'volatile', 'adj', 'dễ biến động, thất thường', 'Bitcoin prices are very ___ – they can rise or fall 10% in a single day.', 'volatile', ['stale', 'rigid', 'concise']],
  [1, 'deduce', 'v', 'suy ra, luận ra', 'From the muddy shoes, the detective ___ that the man had walked through the garden.', 'deduced', ['leveraged', 'enticed', 'absorbed']],
  [1, 'subsequent', 'adj', 'tiếp theo, sau đó', 'The first test failed, but all ___ tests were successful.', 'subsequent', ['outermost', 'elementary', 'crooked']],
  [1, 'iterative', 'adj', 'lặp theo từng vòng, cải tiến dần', 'We build the app in an ___ way: release, get feedback, improve, and repeat.', 'iterative', ['indifferent', 'ambiguous', 'infeasible']],
  [1, 'leverage', 'v', 'tận dụng', 'Small companies can ___ social media to reach customers for free.', 'leverage', ['salvage', 'haggle', 'crouch']],
  [2, 'mandatory', 'adj', 'bắt buộc', "Wearing a helmet on a motorbike is ___ in Vietnam – you'll be fined if you don't.", 'mandatory', ['open-ended', 'generous', 'volatile']],
  [2, 'ambiguous', 'adj', 'mơ hồ, hiểu được nhiều nghĩa', "The message 'Meet me after lunch' is ___ – it could mean 1 p.m. or 4 p.m.", 'ambiguous', ['concise', 'cordial', 'sustainable']],
  [2, 'contest', 'v', 'phản đối, tranh cãi (một quyết định)', "The losing team decided to ___ the referee's decision.", 'contest', ['convey', 'accommodate', 'complement']],
  [2, 'illustrate', 'v', 'minh hoạ, làm rõ', 'The teacher used a simple drawing to ___ how the heart works.', 'illustrate', ['overthrow', 'backslide', 'adhere']],
  [2, 'associated', 'adj', 'liên quan, gắn liền (associated with)', 'There are many health risks ___ with smoking.', 'associated', ['fond', 'enticed', 'riven'], 'Cụm cố định: be associated with = gắn liền với.'],
  [2, 'convey', 'v', 'truyền đạt, chuyển tải', 'It is hard to ___ your feelings in a short text message.', 'convey', ['contest', 'roast', 'rive']],
  [2, 'absorb', 'v', 'hấp thụ, tiếp thu', 'Plants ___ water through their roots.', 'absorb', ['emulate', 'salvage', 'haggle']],
  [2, 'infeasible', 'adj', 'không khả thi', 'Finishing the whole project in one day is ___ – we need at least a week.', 'infeasible', ['domestic', 'cordial', 'genuine']],
  [2, 'adhere', 'v', 'tuân thủ (adhere to)', 'All staff must ___ to the safety rules.', 'adhere', ['absorb', 'convey', 'entice'], 'Cụm cố định: adhere to + quy định = tuân thủ.'],
  [3, 'subsidise', 'v', 'trợ giá, bao cấp', 'The government ___ electric cars, so they are cheaper to buy.', 'subsidises', ['overthrows', 'anchors', 'deduces']],
  [3, 'entice', 'v', 'lôi kéo, hấp dẫn', 'Shops use free gifts to ___ customers inside.', 'entice', ['adhere', 'crouch', 'contest']],
  [3, 'crooked', 'adj', 'cong queo, xiêu vẹo', 'The old man walked slowly down the narrow, ___ street.', 'crooked', ['volatile', 'concise', 'mandatory']],
  [3, 'obstacle', 'n', 'chướng ngại vật, trở ngại', 'Lack of money was the biggest ___ to his plan to study abroad.', 'obstacle', ['remedy', 'recap', 'durian']],
  [3, 'outermost', 'adj', 'ở xa nhất, ngoài cùng', 'Pluto was once called the ___ planet of our solar system.', 'outermost', ['subsequent', 'elementary', 'stale']],
  [4, 'investigate', 'v', 'điều tra, tìm hiểu kỹ', 'The police are ___ the cause of the fire.', 'investigating', ['subsidising', 'emulating', 'haggling']],
  [4, 'interference', 'n', 'sự can thiệp', 'She hates any ___ from her parents in her personal life.', 'interference', ['investment', 'ambition', 'intuition']],
  [5, 'salvage', 'v', 'cứu vãn, cứu được (thứ sắp hỏng)', 'Firefighters managed to ___ some old photos from the burning house.', 'salvage', ['leverage', 'illustrate', 'deduce']],
  [5, 'generous', 'adj', 'hào phóng, rộng rãi', "It was very ___ of you to pay for everyone's dinner.", 'generous', ['indifferent', 'frustrated', 'crooked']],
  [5, 'fundamental', 'adj', 'cơ bản, nền tảng, cốt lõi', 'Freedom of speech is a ___ human right.', 'fundamental', ['stale', 'volatile', 'crooked']],
  [5, 'remedy', 'n', 'cách khắc phục, phương thuốc', 'Honey and lemon is a popular home ___ for a sore throat.', 'remedy', ['obstacle', 'outage', 'prologue']],
  [5, 'sustainable', 'adj', 'bền vững', 'We need ___ energy sources such as solar and wind power.', 'sustainable', ['ambiguous', 'rigid', 'frustrated']],
  [5, 'distinction', 'n', 'sự phân biệt, khác biệt', "It's important to make a clear ___ between facts and opinions.", 'distinction', ['interference', 'concentration', 'incident'], 'Cụm: make a distinction between A and B = phân biệt A với B.'],
  [5, 'genuine', 'adj', 'thật, chân thành', 'This bag is made of ___ leather, not plastic.', 'genuine', ['stale', 'cordial', 'elementary']],
  [5, 'endeavour', 'n', 'nỗ lực, việc khó cần cố gắng', 'Climbing Everest is a dangerous ___ that needs years of training.', 'endeavour', ['remedy', 'recap', 'durian']],
  [6, 'accommodate', 'v', 'cho ở, có sức chứa; đáp ứng', 'The new hotel can ___ up to 500 guests.', 'accommodate', ['emulate', 'crouch', 'contest']],
  [6, 'distraction', 'n', 'sự xao nhãng, thứ làm phân tâm', "Turn off your phone – it's a big ___ when you're studying.", 'distraction', ['distinction', 'investment', 'endeavour'], 'Đừng nhầm distraction (sự xao nhãng) với distinction (sự phân biệt).'],
  [6, 'complement', 'v', 'bổ sung, làm tôn lên', 'A glass of white wine will ___ the fish perfectly.', 'complement', ['compliment', 'accommodate', 'convey'], 'complement = bổ sung, làm tôn lên; compliment = khen ngợi. Hai từ phát âm gần giống nhau.'],
  [6, 'barely', 'adv', 'hầu như không, vừa đủ', 'I was so tired that I could ___ keep my eyes open.', 'barely', ['evenly', 'genuinely', 'fairly']],
  [6, 'astonished', 'adj', 'kinh ngạc', 'We were ___ to hear that the quiet boy had won the singing contest.', 'astonished', ['indifferent', 'generous', 'crooked']],
  [6, 'nevertheless', 'adv', 'tuy nhiên, dù vậy', 'The weather was terrible. ___, we enjoyed the trip.', 'Nevertheless', ['Whereas', 'For instance', 'Barely'], "'Whereas' là liên từ nối hai vế trong cùng một câu, không đứng đầu câu như 'Nevertheless,'."],
  [6, 'cast', 'v', 'quăng, thả (lưới, cần câu)', 'The fisherman ___ his net into the river and waited.', 'cast', ['crouched', 'anchored', 'roasted'], 'cast – cast – cast (bất quy tắc, ba dạng giống nhau).'],
  [6, 'indifferent', 'adj', 'thờ ơ, dửng dưng', "He is completely ___ to other people's problems – he never helps anyone.", 'indifferent', ['generous', 'fond', 'cordial'], 'be indifferent to = thờ ơ với.'],
  [7, 'concise', 'adj', 'ngắn gọn, súc tích', 'Please keep your answer ___ – no more than 50 words.', 'concise', ['frustrated', 'domestic', 'cordial']],
  [7, 'cordial', 'adj', 'thân mật, thân thiện (lịch sự)', 'The two leaders had a ___ meeting and promised to work closely together.', 'cordial', ['frustrated', 'domestic', 'concise']],
  [7, 'frustrated', 'adj', 'bực bội, nản lòng', "I'm really ___ because my laptop keeps crashing.", 'frustrated', ['concise', 'moderate', 'cordial']],
  [7, 'domestic', 'adj', 'trong nước, nội địa; (thuộc) gia đình', '___ flights inside Vietnam are usually cheaper than international ones.', 'Domestic', ['Cordial', 'Concise', 'Frustrated']],
  [7, 'incident', 'n', 'sự cố, vụ việc', 'The police are investigating a serious ___ at the stadium last night.', 'incident', ['disguise', 'prologue', 'Pope']],
  [7, 'panic', 'n', 'sự hoảng loạn', 'When the fire alarm went off, people ran out of the building in ___.', 'panic', ['disguise', 'prologue', 'incident']],
  [7, 'moderate', 'adj', 'vừa phải, phải chăng; ôn hoà', 'Doctors recommend ___ exercise, such as walking for 30 minutes a day.', 'moderate', ['cordial', 'concise', 'domestic']],
  [7, 'emulate', 'v', 'noi gương, bắt chước để được bằng', 'Young footballers often try to ___ their heroes, like Messi or Ronaldo.', 'emulate', ['overthrow', 'haggle', 'rive']],
];

// ---- Cấp Khó ----  [story, câu hỏi, đáp án đúng, [nhiễu x3], giải thích]
const HARD = [
  [6, "Chọn câu ĐÚNG:", 'The spicy sauce complements the grilled fish well.', ['The spicy sauce compliments the grilled fish well.', 'My boss complemented me on my report.', 'She complemented his new haircut.'], 'complement = bổ sung, làm tôn lên (món ăn, màu sắc); compliment = khen. Các câu B, C, D đã nhầm nghĩa hai từ.'],
  [5, 'Her interest in our team was ___, not just part of the job.', 'genuine', ['genuinely', 'genuineness', 'genuined'], 'Sau động từ to be (was) cần tính từ → genuine. genuinely là trạng từ (I was genuinely sad).'],
  [2, 'We decided to adhere ___ the new rule.', 'to', ['with', 'on', 'for'], 'Cụm cố định: adhere to = tuân thủ.'],
  [6, 'My aunt is very fond ___ guests.', 'of', ['with', 'to', 'about'], 'Cụm cố định: be fond of + N/V-ing = thích, quý mến.'],
  [5, "'I take after my father' nghĩa là:", 'Tôi giống bố tôi.', ['Tôi chăm sóc bố tôi.', 'Tôi đi theo sau bố tôi.', 'Tôi hợp tính với bố tôi.'], 'take after = giống (người thân lớn tuổi). Chăm sóc = look after; hợp tính = get along with.'],
  [3, 'Yesterday, the guide ___ quickly up the hill.', 'strode', ['strided', 'stridden', 'strid'], 'stride – strode – stridden (bất quy tắc). Quá khứ đơn là strode.'],
  [6, 'We were ___ by how sweet the durian was.', 'astonished', ['astonishing', 'astonish', 'astonishment'], 'Người cảm thấy kinh ngạc → tính từ -ed: astonished. -ing dùng cho thứ gây kinh ngạc: an astonishing result.'],
  [7, 'Waiting two hours for a delayed flight is very ___.', 'frustrating', ['frustrated', 'frustrate', 'frustration'], 'Sự việc gây bực bội → -ing: frustrating. Người cảm thấy bực → -ed: I am frustrated.'],
  [7, 'When she saw the snake, she ___ and screamed.', 'panicked', ['paniced', 'panicking', 'panics'], "Động từ tận cùng -ic thêm 'k' trước -ed/-ing: panicked, panicking."],
  [7, 'The thief escaped from the hotel disguised ___ a waiter.', 'as', ['like', 'with', 'for'], 'Cụm cố định: disguised as = cải trang thành.'],
  [7, "Trong câu 'Domestic violence is a serious problem', 'domestic' nghĩa là:", 'trong gia đình', ['trong nước', 'quốc tế', 'nơi công cộng'], 'domestic có 2 nghĩa: trong nước (domestic flight) và trong gia đình (domestic violence, domestic chores).'],
  [7, "Trong câu 'Mr Nam will moderate the panel discussion', 'moderate' nghĩa là:", 'điều phối, chủ trì', ['lật đổ', 'hủy bỏ', 'che giấu'], 'moderate (v) = điều phối, chủ trì buổi thảo luận; người điều phối = moderator.'],
  [7, 'The ___ of the king led to years of chaos.', 'overthrow', ['overthrew', 'overthrown', 'overthrowing'], 'Sau "The … of" cần danh từ; overthrow vừa là động từ vừa là danh từ (sự lật đổ).'],
  [7, 'For years, the party has been ___ by internal conflicts.', 'riven', ['rived up', 'riving', 'rives'], 'Bị động has been + V3; rive – rived – riven → riven by = bị chia rẽ bởi.'],
  [7, 'He promised to stop gambling, but last month he ___ into his old habits.', 'backslid', ['backslided', 'backslidden', 'backslide'], 'backslide chia như slide: quá khứ đơn backslid. backslidden chỉ là một dạng V3.'],
  [2, "Chọn từ TRÁI NGHĨA với 'ambiguous':", 'clear', ['vague', 'unclear', 'confusing'], 'ambiguous = mơ hồ ↔ clear = rõ ràng. Ba từ còn lại đều gần nghĩa với ambiguous.'],
  [2, "Chọn từ TRÁI NGHĨA với 'rigid' (về quy định, kế hoạch):", 'flexible', ['strict', 'firm', 'fixed'], 'rigid = cứng nhắc ↔ flexible = linh hoạt.'],
  [1, "Chọn từ đồng nghĩa với 'mitigate':", 'reduce', ['increase', 'predict', 'ignore'], 'mitigate = giảm nhẹ, giảm thiểu ≈ reduce / lessen.'],
  [1, "Chọn cụm đồng nghĩa với 'leverage' trong 'We leveraged a free tool':", 'make use of', ['pay for', 'build from scratch', 'get rid of'], 'leverage (v) = tận dụng ≈ make use of / take advantage of.'],
  [2, "Chọn từ TRÁI NGHĨA với 'mandatory':", 'optional', ['compulsory', 'required', 'necessary'], 'mandatory = bắt buộc ↔ optional = tuỳ chọn. compulsory, required là đồng nghĩa.'],
  [3, "Chọn từ đồng nghĩa với 'entice':", 'tempt', ['warn', 'force', 'forbid'], 'entice = lôi kéo, hấp dẫn ≈ tempt / attract.'],
  [6, "Chọn từ TRÁI NGHĨA với 'indifferent':", 'concerned', ['uninterested', 'careless', 'cold'], 'indifferent = thờ ơ ↔ concerned / interested = quan tâm.'],
  [2, 'Lan likes coffee, ___ her sister prefers tea.', 'whereas', ['nevertheless', 'for instance', 'barely'], 'whereas nối hai vế đối lập trong cùng một câu. Nevertheless đứng đầu câu mới: "… Nevertheless, …".'],
  [6, "'I barely slept last night' nghĩa là:", 'Tối qua tôi gần như không ngủ.', ['Tối qua tôi ngủ rất ngon.', 'Tối qua tôi ngủ đủ giấc.', 'Tối qua tôi ngủ quá giờ.'], 'barely = hầu như không, rất ít (≈ hardly).'],
  [2, 'Reviewing every line of code twice is ___ – we simply don\'t have enough people.', 'infeasible', ['unfeasible to', 'infeasibility', 'feasibly'], 'Sau is cần tính từ: infeasible = không khả thi (feasible + tiền tố in-).'],
  [7, "Chọn câu gần nghĩa nhất với 'concise':", 'brief and clear', ['long and detailed', 'rude and unfriendly', 'confused and unclear'], 'concise = ngắn gọn nhưng rõ ý.'],
  [7, "Chọn từ TRÁI NGHĨA với 'cordial':", 'hostile', ['friendly', 'warm', 'polite'], 'cordial = thân mật ↔ hostile = thù địch.'],
  [1, "Trong 'Some users still saw stale prices', 'stale' nghĩa là:", 'cũ, chưa được cập nhật', ['quá đắt', 'bị ẩn đi', 'đang giảm giá'], 'stale = cũ, lỗi thời (dữ liệu, bánh mì…). stale data = dữ liệu cũ trong cache.'],
  [5, "Chọn câu dùng 'relentless' ĐÚNG:", 'The relentless rain lasted for a whole week.', ['She relentless worked all night.', 'He is a relentlessly man.', 'They relentlessed the project.'], 'relentless là tính từ (đứng trước danh từ): relentless rain = mưa không ngớt. Trạng từ: relentlessly.'],
  [2, "Chọn câu dùng 'get carried away' ĐÚNG nghĩa:", 'I got carried away and spent all my money at the sale.', ['The box got carried away by two men.', 'He got carried away to the hospital by car.', 'Please get carried away your books.'], 'get carried away (idiom) = quá hăng, bị cuốn theo đến mức mất kiểm soát. B, C hiểu theo nghĩa đen "bị khiêng đi".'],
];

const mkOpts = (correct, wrongs) => {
  const opts = shuffle([correct, ...wrongs]);
  const o = {}; opts.forEach((t, i) => (o[LET[i]] = t));
  return {options: o, answer: LET[opts.indexOf(correct)]};
};

// Pool nghĩa theo nhóm từ loại cho câu chọn nghĩa.
const pool = [...EASY.map((e) => ({w: e[1], p: e[2], m: e[3]})), ...NORMAL.map((e) => ({w: e[1], p: e[2], m: e[3]}))];
const SIMILAR = [['elementary', 'fundamental'], ['genuinely', 'genuine'], ['absorb', 'concentration'], ['illustrate', 'for instance'], ['ridge', 'streak'], ['recap', 'prologue'], ['outage', 'incident'], ['remedy', 'endeavour']];
const similar = (a, b) => SIMILAR.some(([x, y]) => (a.includes(x) && b.includes(y)) || (a.includes(y) && b.includes(x)));

const easy = shuffle(EASY).map(([s, w, p, m], i) => {
  const cands = shuffle(pool.filter((x) => x.w !== w && group(x.p) === group(p) && !similar(x.w, w))).slice(0, 3).map((x) => x.m);
  return {no: i + 1, code: `S${s}`, q: `'${w}' (${p}) nghĩa là gì?`, ...mkOpts(m, cands), explain: `${w} (${p}) = ${m}. Xem lại trong câu chuyện ${s}.`};
});
const normal = shuffle(NORMAL).map(([s, w, p, m, q, ans, wr, note], i) => ({
  no: i + 1, code: `S${s}`, q, ...mkOpts(ans, wr),
  explain: `${ans} (${w}, ${p}) = ${m}.${note ? ' ' + note : ''}`,
}));
const hard = shuffle(HARD).map(([s, q, ans, wr, ex], i) => ({no: i + 1, code: `S${s}`, q, ...mkOpts(ans, wr), explain: ex}));

const data = {easy, normal, hard};
fs.writeFileSync(out, JSON.stringify(data, null, 1) + '\n', 'utf8');
for (const [k, qs] of Object.entries(data)) {
  const l = {}; qs.forEach((q) => (l[q.answer] = (l[q.answer] || 0) + 1));
  const st = {}; qs.forEach((q) => (st[q.code] = (st[q.code] || 0) + 1));
  console.log(k, qs.length, JSON.stringify(l), JSON.stringify(st));
}
console.log('words covered:', EASY.length + NORMAL.length);
