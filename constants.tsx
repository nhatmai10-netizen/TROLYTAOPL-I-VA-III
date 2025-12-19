
export const GDPT_2018_SUBJECTS = [
  "Toán", "Ngữ văn", "Tiếng Anh", "Vật lí", "Hóa học", "Sinh học", 
  "Lịch sử và Địa lí", "Giáo dục kinh tế và pháp luật", "Công nghệ", 
  "Tin học", "Giáo dục thể chất", "Âm nhạc", "Mĩ thuật", 
  "Hoạt động trải nghiệm, hướng nghiệp", "Nội dung giáo dục địa phương",
  "Khoa học tự nhiên", "Lịch sử", "Địa lí", "Giáo dục công dân"
];

export const DEPARTMENTS = [
  "Khoa học tự nhiên (KHTN)",
  "Khoa học xã hội (KHXH)",
  "Hoạt động giáo dục (HĐGD)"
];

export const ACADEMIC_YEARS = [
  "2025 - 2026",
  "2026 - 2027",
  "2027 - 2028",
  "2028 - 2029"
];

// Refined indicators based on the 2025 THCS Training Manual (TC1: Grades 6-7, TC2: Grades 8-9)
export const DIGITAL_COMPETENCY_MATRIX = {
  levels: {
    TC1: { label: "Trung cấp 1", grades: [6, 7] },
    TC2: { label: "Trung cấp 2", grades: [8, 9] }
  },
  domains: [
    {
      code: "1.1",
      name: "Duyệt, tìm kiếm và lọc dữ liệu",
      TC1: "a-Giải thích được nhu cầu thông tin; b-Thực hiện quy trình tìm kiếm trong môi trường số; c-Giải thích cách truy cập và điều hướng kết quả.",
      TC2: "a-Minh họa nhu cầu thông tin; b-Tổ chức tìm kiếm dữ liệu/nội dung trong môi trường số; c-Mô tả cách truy cập và điều hướng giữa các kết quả."
    },
    {
      code: "1.2",
      name: "Đánh giá dữ liệu và nội dung số",
      TC1: "a-Phân tích, so sánh đánh giá độ tin cậy và chính xác của nguồn tin; b-Phân tích diễn giải dữ liệu/nội dung xác định rõ ràng.",
      TC2: "a-Thực hiện phân tích so sánh đánh giá các nguồn dữ liệu/nội dung; b-Thực hiện phân tích diễn giải và đánh giá dữ liệu/nội dung số."
    },
    {
      code: "1.3",
      name: "Quản lý dữ liệu và thông tin",
      TC1: "a-Lựa chọn dữ liệu/nội dung để tổ chức, lưu trữ, truy xuất; b-Sắp xếp chúng trật tự trong môi trường có cấu trúc.",
      TC2: "a-Sắp xếp thông tin dữ liệu để dễ dàng lưu trữ/truy xuất; b-Tổ chức được thông tin dữ liệu nội dung trong môi trường có cấu trúc."
    },
    {
      code: "2.1",
      name: "Tương tác qua công nghệ số",
      TC1: "a-Thực hiện tương tác xác định rõ ràng và thường xuyên; b-Lựa chọn phương tiện giao tiếp phù hợp bối cảnh nhất định.",
      TC2: "a-Lựa chọn nhiều công nghệ số để tương tác; b-Lựa chọn nhiều phương tiện truyền thông số phù hợp bối cảnh nhất định."
    },
    {
      code: "2.2",
      name: "Chia sẻ thông tin số",
      TC1: "a-Lựa chọn công nghệ số phù hợp để trao đổi; b-Giải thích cách thức hoạt động như trung gian chia sẻ; c-Minh họa phương pháp tham chiếu và ghi nguồn.",
      TC2: "a-Vận dụng công nghệ số phù hợp để chia sẻ; b-Giải thích được cách đóng vai trò trung gian chia sẻ; c-Áp dụng phương pháp tham chiếu và ghi nguồn."
    },
    {
      code: "2.4",
      name: "Hợp tác qua công nghệ số",
      TC1: "a-Lựa chọn công cụ số xác định rõ ràng cho quá trình hợp tác.",
      TC2: "a-Lựa chọn công cụ số cho các quá trình hợp tác."
    },
    {
      code: "3.1",
      name: "Phát triển nội dung số",
      TC1: "a-Chỉ ra cách tạo/chỉnh sửa nội dung có khái niệm cụ thể; b-Thể hiện bản thân qua việc tạo nội dung số thông thường.",
      TC2: "a-Chỉ ra cách tạo/chỉnh sửa nội dung ở các định dạng khác nhau; b-Thể hiện bản thân qua việc tạo ra các nội dung số."
    },
    {
      code: "3.4",
      name: "Lập trình",
      TC1: "a-Liệt kê hướng dẫn thông thường cho hệ thống máy tính giải quyết vấn đề thường ngày.",
      TC2: "a-Liệt kê hướng dẫn for hệ thống máy tính giải quyết một vấn đề nhất định hoặc nhiệm vụ cụ thể."
    },
    {
      code: "4.1",
      name: "Bảo vệ thiết bị",
      TC1: "a-Chỉ ra cách thức cơ bản bảo vệ thiết bị; b-Phân biệt rủi ro/đe dọa cơ bản; c-Chọn lựa biện pháp an toàn/bảo mật rõ ràng.",
      TC2: "a-Thiết lập cách thức bảo vệ thiết bị; b-Phân biệt rủi ro/đe dọa trong môi trường số; c-Chọn lựa biện pháp an toàn và bảo mật."
    },
    {
      code: "5.2",
      name: "Xác định nhu cầu và giải pháp",
      TC1: "a-Chỉ ra nhu cầu xác định rõ ràng; b-Chọn công cụ số thông thường; c-Chọn cách thông thường để điều chỉnh môi trường số.",
      TC2: "a-Giải thích nhu cầu cá nhân; b-Lựa chọn công cụ số và giải pháp công nghệ có thể có; c-Chọn cách điều chỉnh/tùy chỉnh môi trường số."
    },
    {
      code: "6.1",
      name: "Hiểu biết về AI",
      TC1: "a-Giải thích nguyên tắc hoạt động cơ bản của AI; b-Diễn giải thuật ngữ/khái niệm liên quan AI.",
      TC2: "a-Áp dụng nguyên tắc cơ bản AI để giải quyết vấn đề đơn giản; b-Thực hiện thao tác cơ bản trên công cụ AI."
    },
    {
      code: "6.2",
      name: "Sử dụng AI",
      TC1: "a-Sử dụng công cụ AI trong công việc/học tập; b-Thực hành kỹ năng dùng AI qua bài tập/dự án nhỏ.",
      TC2: "a-Tối ưu hóa việc sử dụng công cụ AI đạt hiệu quả cao hơn; b-Quản lý triển khai công cụ AI trong các dự án nhỏ."
    }
  ]
};

export const DEMO_DATA = `Chương I: Máy tính và cộng đồng
Bài 1: Thông tin và dữ liệu (2 tiết): Nhận biết sự khác nhau giữa thông tin và dữ liệu. Tính tổng hai số $a$ và $b$: $S = a + b$.
Bài 2: Khai thác thông tin trên Internet (3 tiết): Tìm kiếm thông tin trên web, xác định từ khóa phù hợp. Trích dẫn nguồn tài liệu.
Bài 3: Sơ đồ tư duy (4 tiết): Sử dụng phần mềm để vẽ sơ đồ tư duy tóm tắt bài học. Ví dụ: Sơ đồ cấu trúc máy tính.
Bài 4: Thuật toán (5 tiết): Mô tả thuật toán bằng sơ đồ khối. Ví dụ thuật toán tìm số lớn nhất trong 3 số $a, b, c$.
Bài 5: Ứng dụng AI (2 tiết): Trò chuyện với ChatGPT để tìm hiểu về biến đổi khí hậu. Đánh giá câu trả lời của AI.`;
