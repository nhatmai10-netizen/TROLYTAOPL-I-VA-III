
import { GoogleGenAI } from "@google/genai";
import { AppendixType, GenerationConfig } from "../types";
import { DIGITAL_COMPETENCY_MATRIX } from "../constants";

export const generateAppendix = async (
  config: GenerationConfig, 
  onUpdate?: (text: string) => void
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const isPhuLucI = config.appendixType === AppendixType.PHU_LUC_I;
  const isTC2 = config.gradeLevel.includes('TC2');
  const levelKey = isTC2 ? 'TC2' : 'TC1';
  
  const competencyStr = JSON.stringify(DIGITAL_COMPETENCY_MATRIX.domains, null, 2);

  const systemInstruction = `
    Bạn là một chuyên gia quản lý giáo dục chuyên nghiệp tại Việt Nam.
    NHIỆM VỤ: Soạn thảo văn bản hành chính giáo dục chuẩn xác theo mẫu Công văn 5512/BGDĐT-GDTrH.

    1. VỀ HÌNH THỨC VĂN BẢN (QUAN TRỌNG):
    Văn bản phải có đầy đủ các phần hành chính ở đầu trang:
    - Góc trái: TRƯỜNG: ${config.schoolName || '................'} | TỔ: ${config.departmentName || '................'}
    - Góc phải: CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM | Độc lập - Tự do - Hạnh phúc
    - Tên văn bản: 
      + Nếu Phụ lục I: KẾ HOẠCH DẠY HỌC CỦA TỔ CHUYÊN MÔN
      + Nếu Phụ lục III: KẾ HOẠCH GIÁO DỤC CỦA GIÁO VIÊN
    - Dòng thông tin: Môn học: ${config.subjectName} | Khối lớp: ${config.gradeLevel} | Năm học: ${config.academicYear}

    2. CẤU TRÚC PHỤ LỤC I (Kế hoạch Tổ chuyên môn):
    Mục I: ĐẶC ĐIỂM TÌNH HÌNH (Gồm các bảng: 1. Số lớp, số học sinh; 2. Tình hình đội ngũ; 3. Thiết bị dạy học; 4. Phòng học bộ môn - Để trống khung hoặc điền dấu chấm để người dùng tự hoàn thiện).
    Mục II: KẾ HOẠCH DẠY HỌC
      1. Phân phối chương trình: Bảng 3 cột: STT | Bài học (số tiết) | Yêu cầu cần đạt (Tích hợp mã NLS ở cuối phần nội dung).
      2. Chuyên đề lựa chọn (nếu có).
      3. Kiểm tra, đánh giá định kỳ: Bảng gồm: Bài kiểm tra | Thời gian | Thời điểm | Hình thức.
    Mục III: CÁC NỘI DUNG KHÁC.

    3. CẤU TRÚC PHỤ LỤC III (Kế hoạch cá nhân Giáo viên):
    Mục I: Kế hoạch dạy học
      - Bảng 7 cột: STT | Bài học | Số tiết | Thời điểm | Thiết bị dạy học | Địa điểm dạy học | Biểu hiện NLS.
    Mục II: Nhiệm vụ khác (bồi dưỡng học sinh giỏi, phụ đạo...).

    4. QUY TẮC NĂNG LỰC SỐ (NLS):
    - Sử dụng mã NLS ở mức độ ${levelKey}. Tham chiếu bảng mã: ${competencyStr}.
    - Phụ lục I: Mã NLS ghi trong ngoặc vuông ở cuối cột YCCĐ. Vd: [NLS: 1.1.${levelKey}a].
    - Phụ lục III: Mô tả chi tiết hành vi học sinh gắn với kiến thức bài học trong cột "Biểu hiện NLS".

    5. QUY TẮC TOÁN HỌC:
    - Công thức toán học PHẢI bọc trong dấu $...$ (Vd: $S = a \times b$).

    YÊU CẦU TRÌNH BÀY: HTML sạch, bảng border="1", căn lề văn bản hành chính chuyên nghiệp.
  `;

  const prompt = `
    DỮ LIỆU ĐẦU VÀO:
    ${config.inputData}

    HÃY THỰC HIỆN:
    Soạn thảo ${isPhuLucI ? 'PHỤ LỤC I (Kế hoạch dạy học của Tổ chuyên môn)' : 'PHỤ LỤC III (Kế hoạch giáo dục của Giáo viên)'} đúng mẫu 5512.
    Đảm bảo tốc độ xử lý nhanh nhất, gán mã NLS và viết biểu hiện NLS thật "trúng" kiến thức.
  `;

  try {
    const responseStream = await ai.models.generateContentStream({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.1,
      },
    });

    let fullText = "";
    for await (const chunk of responseStream) {
      const chunkText = chunk.text || "";
      fullText += chunkText;
      if (onUpdate) {
        onUpdate(fullText);
      }
    }

    return fullText;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Lỗi kết nối AI. Vui lòng thử lại.");
  }
};
