// Danh sách chủ đề luyện NÓI và VIẾT – nguồn dữ liệu chung cho lộ trình, thanh thông tin đầu trang và tiến độ.
// Mỗi chủ đề là một trang trong speaking/ hoặc writing/ với `slug` tương ứng.

export type SkillKey = 'noi' | 'viet';
export type SkillTopic = {
  id: string; // vd. noi-01 – khóa lưu tiến độ
  no: number;
  title: string;
  en: string;
  slug: string;
  stage: number;
  grammar: string[]; // mã chủ đề ngữ pháp liên quan (G01–G29)
};
export type Stage = {no: number; title: string; goal: string; grammar: string};

export const SKILLS: Record<SkillKey, {name: string; base: string; stages: Stage[]; topics: SkillTopic[]}> = {
  noi: {
    name: 'Luyện nói',
    base: '/luyen-noi',
    stages: [
      {no: 1, title: 'Bản thân & cuộc sống hằng ngày', goal: 'Nói trôi chảy 1–2 phút về bản thân, gia đình, thói quen, nơi ở.', grammar: 'Thì hiện tại (G01–G03)'},
      {no: 2, title: 'Kể chuyện & trải nghiệm', goal: 'Kể lại một trải nghiệm có mở đầu – diễn biến – kết thúc.', grammar: 'Thì quá khứ, hiện tại hoàn thành (G04–G08)'},
      {no: 3, title: 'Học tập, công việc & tương lai', goal: 'Nói về kế hoạch, lựa chọn, lời khuyên; đưa ra lý do.', grammar: 'Tương lai, modal, V-ing/to V (G09–G13)'},
      {no: 4, title: 'Quan điểm & xã hội', goal: 'Nêu và bảo vệ quan điểm, so sánh, đưa giải pháp.', grammar: 'So sánh, câu điều kiện, liên từ (G17, G20–G24)'},
      {no: 5, title: 'Phỏng vấn IT – Fullstack Developer', goal: 'Tự tin trả lời phỏng vấn bằng tiếng Anh: giới thiệu, dự án, kiến thức kỹ thuật, câu hỏi hành vi, đàm phán.', grammar: 'Hiện tại hoàn thành, quá khứ, bị động, câu điều kiện, modal (G06, G04, G19, G20, G11)'},
    ],
    topics: [
      {id: 'noi-01', no: 1, stage: 1, title: 'Giới thiệu bản thân', en: 'Introducing yourself', slug: 'gioi-thieu-ban-than', grammar: ['G02', 'G03', 'G01']},
      {id: 'noi-02', no: 2, stage: 1, title: 'Gia đình & bạn bè', en: 'Family & friends', slug: 'gia-dinh-ban-be', grammar: ['G02', 'G16']},
      {id: 'noi-03', no: 3, stage: 1, title: 'Thói quen hằng ngày', en: 'Daily routine', slug: 'thoi-quen-hang-ngay', grammar: ['G02', 'G18']},
      {id: 'noi-04', no: 4, stage: 1, title: 'Nhà ở & khu phố', en: 'Home & neighbourhood', slug: 'nha-o-khu-pho', grammar: ['G15', 'G18', 'G16']},
      {id: 'noi-05', no: 5, stage: 2, title: 'Kỷ niệm tuổi thơ', en: 'Childhood memories', slug: 'ky-niem-tuoi-tho', grammar: ['G04', 'G26']},
      {id: 'noi-06', no: 6, stage: 2, title: 'Du lịch & kỳ nghỉ', en: 'Travel & holidays', slug: 'du-lich-ky-nghi', grammar: ['G04', 'G05', 'G06']},
      {id: 'noi-07', no: 7, stage: 2, title: 'Sở thích & giải trí', en: 'Hobbies & free time', slug: 'so-thich-giai-tri', grammar: ['G13', 'G06', 'G07']},
      {id: 'noi-08', no: 8, stage: 2, title: 'Một sự kiện đáng nhớ', en: 'A memorable event', slug: 'su-kien-dang-nho', grammar: ['G04', 'G05', 'G08']},
      {id: 'noi-09', no: 9, stage: 3, title: 'Học tập', en: 'Studying', slug: 'hoc-tap', grammar: ['G06', 'G11', 'G13']},
      {id: 'noi-10', no: 10, stage: 3, title: 'Công việc & nghề nghiệp', en: 'Work & careers', slug: 'cong-viec-nghe-nghiep', grammar: ['G11', 'G19']},
      {id: 'noi-11', no: 11, stage: 3, title: 'Kế hoạch & ước mơ', en: 'Plans & dreams', slug: 'ke-hoach-uoc-mo', grammar: ['G09', 'G10', 'G21']},
      {id: 'noi-12', no: 12, stage: 3, title: 'Công nghệ & mạng xã hội', en: 'Technology & social media', slug: 'cong-nghe-mang-xa-hoi', grammar: ['G11', 'G17', 'G24']},
      {id: 'noi-13', no: 13, stage: 4, title: 'Sức khỏe & lối sống', en: 'Health & lifestyle', slug: 'suc-khoe-loi-song', grammar: ['G11', 'G20', 'G13']},
      {id: 'noi-14', no: 14, stage: 4, title: 'Môi trường', en: 'The environment', slug: 'moi-truong', grammar: ['G19', 'G20', 'G24']},
      {id: 'noi-15', no: 15, stage: 4, title: 'Ẩm thực & văn hóa', en: 'Food & culture', slug: 'am-thuc-van-hoa', grammar: ['G22', 'G19', 'G16']},
      {id: 'noi-16', no: 16, stage: 4, title: 'Thành phố & nông thôn', en: 'City vs countryside', slug: 'thanh-pho-nong-thon', grammar: ['G17', 'G24', 'G21']},
      {id: 'noi-17', no: 17, stage: 5, title: 'Giới thiệu bản thân khi phỏng vấn', en: 'Tell me about yourself', slug: 'phong-van-gioi-thieu-ban-than', grammar: ['G06', 'G07', 'G02']},
      {id: 'noi-18', no: 18, stage: 5, title: 'Trình bày dự án tiêu biểu', en: 'Walk me through a project', slug: 'phong-van-du-an-tieu-bieu', grammar: ['G04', 'G19', 'G06']},
      {id: 'noi-19', no: 19, stage: 5, title: 'Kiến thức Frontend', en: 'Frontend development', slug: 'phong-van-frontend', grammar: ['G02', 'G19', 'G22']},
      {id: 'noi-20', no: 20, stage: 5, title: 'Backend, API & cơ sở dữ liệu', en: 'Backend, APIs & databases', slug: 'phong-van-backend-api-database', grammar: ['G19', 'G20', 'G24']},
      {id: 'noi-21', no: 21, stage: 5, title: 'Thiết kế hệ thống & kiến trúc', en: 'System design & architecture', slug: 'phong-van-system-design', grammar: ['G20', 'G11', 'G17']},
      {id: 'noi-22', no: 22, stage: 5, title: 'Gỡ lỗi & xử lý sự cố', en: 'Debugging & incidents', slug: 'phong-van-debugging-su-co', grammar: ['G04', 'G05', 'G08']},
      {id: 'noi-23', no: 23, stage: 5, title: 'Làm việc nhóm, Agile & code review', en: 'Teamwork, Agile & code review', slug: 'phong-van-lam-viec-nhom-agile', grammar: ['G02', 'G11', 'G23']},
      {id: 'noi-24', no: 24, stage: 5, title: 'Câu hỏi hành vi – phương pháp STAR', en: 'Behavioural questions (STAR)', slug: 'phong-van-cau-hoi-hanh-vi-star', grammar: ['G04', 'G08', 'G21']},
      {id: 'noi-25', no: 25, stage: 5, title: 'Giải thích kỹ thuật cho người không chuyên', en: 'Explaining tech to non-tech people', slug: 'phong-van-giai-thich-ky-thuat', grammar: ['G17', 'G20', 'G24']},
      {id: 'noi-26', no: 26, stage: 5, title: 'Đặt câu hỏi & thỏa thuận lương', en: 'Your questions & salary talk', slug: 'phong-van-dat-cau-hoi-luong', grammar: ['G25', 'G11', 'G09']},
    ],
  },
  viet: {
    name: 'Luyện viết',
    base: '/luyen-viet',
    stages: [
      {no: 1, title: 'Câu & đoạn văn', goal: 'Viết câu đúng ngữ pháp và đoạn văn 80–120 từ có câu chủ đề rõ ràng.', grammar: 'Cấu trúc câu, các thì (G01–G08)'},
      {no: 2, title: 'Thư & email', goal: 'Viết email thân mật và trang trọng đúng bố cục, đúng giọng văn.', grammar: 'Modal, câu hỏi gián tiếp, tương lai (G09–G11, G25)'},
      {no: 3, title: 'Đoạn văn lập luận', goal: 'Viết đoạn nêu ý kiến, so sánh, nguyên nhân – kết quả; mô tả biểu đồ.', grammar: 'So sánh, bị động, liên từ (G17, G19, G24)'},
      {no: 4, title: 'Bài luận', goal: 'Viết bài luận 250 từ, 4 đoạn, lập luận chặt chẽ.', grammar: 'Câu phức, điều kiện, đảo ngữ (G20–G24, G28)'},
    ],
    topics: [
      {id: 'viet-01', no: 1, stage: 1, title: 'Viết câu đúng: đơn, ghép, phức', en: 'Writing correct sentences', slug: 'viet-cau-dung', grammar: ['G01', 'G24', 'G22']},
      {id: 'viet-02', no: 2, stage: 1, title: 'Đoạn văn giới thiệu bản thân', en: 'Self-introduction paragraph', slug: 'doan-van-gioi-thieu', grammar: ['G02', 'G06']},
      {id: 'viet-03', no: 3, stage: 1, title: 'Đoạn văn miêu tả người & nơi chốn', en: 'Descriptive paragraph', slug: 'doan-van-mieu-ta', grammar: ['G16', 'G18', 'G22']},
      {id: 'viet-04', no: 4, stage: 1, title: 'Đoạn văn kể lại trải nghiệm', en: 'Narrative paragraph', slug: 'doan-van-ke-chuyen', grammar: ['G04', 'G05', 'G08']},
      {id: 'viet-05', no: 5, stage: 2, title: 'Email thân mật', en: 'Informal email', slug: 'email-than-mat', grammar: ['G06', 'G09']},
      {id: 'viet-06', no: 6, stage: 2, title: 'Email trang trọng', en: 'Formal email', slug: 'email-trang-trong', grammar: ['G11', 'G25', 'G19']},
      {id: 'viet-07', no: 7, stage: 2, title: 'Email phàn nàn & xin lỗi', en: 'Complaint & apology emails', slug: 'email-phan-nan-xin-loi', grammar: ['G04', 'G12', 'G19']},
      {id: 'viet-08', no: 8, stage: 2, title: 'Lời mời, tin nhắn & ghi chú', en: 'Invitations, messages & notes', slug: 'loi-moi-tin-nhan', grammar: ['G09', 'G11', 'G13']},
      {id: 'viet-09', no: 9, stage: 3, title: 'Đoạn văn nêu ý kiến', en: 'Opinion paragraph', slug: 'doan-van-y-kien', grammar: ['G24', 'G11']},
      {id: 'viet-10', no: 10, stage: 3, title: 'Đoạn văn so sánh – đối chiếu', en: 'Compare & contrast paragraph', slug: 'doan-van-so-sanh', grammar: ['G17', 'G24']},
      {id: 'viet-11', no: 11, stage: 3, title: 'Đoạn văn nguyên nhân – kết quả', en: 'Cause & effect paragraph', slug: 'doan-van-nguyen-nhan-ket-qua', grammar: ['G24', 'G20']},
      {id: 'viet-12', no: 12, stage: 3, title: 'Mô tả biểu đồ', en: 'Describing charts', slug: 'mo-ta-bieu-do', grammar: ['G17', 'G19', 'G04']},
      {id: 'viet-13', no: 13, stage: 4, title: 'Cấu trúc bài luận', en: 'Essay structure', slug: 'cau-truc-bai-luan', grammar: ['G24', 'G22']},
      {id: 'viet-14', no: 14, stage: 4, title: 'Bài luận nêu ý kiến', en: 'Opinion essay', slug: 'bai-luan-y-kien', grammar: ['G24', 'G20', 'G28']},
      {id: 'viet-15', no: 15, stage: 4, title: 'Bài luận thảo luận hai quan điểm', en: 'Discussion essay', slug: 'bai-luan-thao-luan', grammar: ['G24', 'G22', 'G19']},
      {id: 'viet-16', no: 16, stage: 4, title: 'Bài luận vấn đề – giải pháp', en: 'Problem–solution essay', slug: 'bai-luan-van-de-giai-phap', grammar: ['G20', 'G11', 'G19']},
    ],
  },
};

export function findTopic(id: string): {skill: SkillKey; topic: SkillTopic} | null {
  for (const skill of Object.keys(SKILLS) as SkillKey[]) {
    const topic = SKILLS[skill].topics.find((t) => t.id === id);
    if (topic) return {skill, topic};
  }
  return null;
}
