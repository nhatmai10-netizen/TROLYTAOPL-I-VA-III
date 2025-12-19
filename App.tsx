
import React, { useState, useRef, useEffect } from 'react';
import { AppendixType, GenerationConfig } from './types';
import { GDPT_2018_SUBJECTS, DEMO_DATA, DEPARTMENTS, ACADEMIC_YEARS } from './constants';
import { generateAppendix } from './services/geminiService';

declare const mammoth: any;
declare const pdfjsLib: any;
declare const MathJax: any;

const App: React.FC = () => {
  const [config, setConfig] = useState<GenerationConfig>({
    appendixType: AppendixType.PHU_LUC_I,
    inputData: '',
    gradeLevel: 'Khối 6 (TC1)',
    schoolName: '',
    departmentName: DEPARTMENTS[0],
    teacherName: '',
    subjectName: 'Tin học',
    academicYear: ACADEMIC_YEARS[0]
  });

  const [isLoading, setIsLoading] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (generatedHtml && typeof MathJax !== 'undefined') {
      const timer = setTimeout(() => {
        MathJax.typesetPromise().catch((err: any) => {});
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [generatedHtml]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      if (file.name.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setConfig(prev => ({ ...prev, inputData: result.value }));
      } else if (file.name.endsWith('.pdf')) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(" ");
          fullText += pageText + "\n";
        }
        setConfig(prev => ({ ...prev, inputData: fullText }));
      } else {
        const text = await file.text();
        setConfig(prev => ({ ...prev, inputData: text }));
      }
    } catch (err) {
      setError("Không thể đọc file. Vui lòng kiểm tra định dạng.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!config.inputData.trim()) {
      setError("Vui lòng nhập hoặc tải lên dữ liệu bài học.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedHtml('');
    try {
      await generateAppendix(config, (updatedText) => {
        setGeneratedHtml(updatedText);
      });
    } catch (err: any) {
      setError(err.message || "Đã có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  const exportToWord = () => {
    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
                    <head><meta charset='utf-8'><title>Phu Luc 5512</title>
                    <style>
                      body { font-family: "Times New Roman", serif; font-size: 12pt; }
                      table { border-collapse: collapse; width: 100%; border: 0.5pt solid black; margin-bottom: 20px; }
                      th, td { border: 0.5pt solid black; padding: 5pt; vertical-align: top; }
                      th { background-color: #f3f4f6; text-align: center; font-weight: bold; }
                      h1, h2, h3 { text-align: center; text-transform: uppercase; font-weight: bold; margin-bottom: 10px; }
                      .admin-header { width: 100%; border: none !important; margin-bottom: 30px; }
                      .admin-header td { border: none !important; padding: 0 !important; width: 50%; }
                    </style>
                    </head><body>`;
    const footer = "</body></html>";
    const content = document.querySelector('.document-preview-container')?.innerHTML || generatedHtml;
    const sourceHTML = header + content + footer;
    
    const blob = new Blob(['\ufeff', sourceHTML], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${config.appendixType}_${config.subjectName}_${config.gradeLevel.split(' ')[0]}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <div className="bg-indigo-950 text-indigo-200 text-[10px] font-bold py-1.5 px-6 text-center no-print uppercase tracking-widest border-b border-indigo-900">
        Tác giả: Trần Thị Ngọc - THCS Thanh Luông, xã Thanh Nưa
      </div>
      <header className="bg-slate-900 text-white shadow-xl no-print border-b-4 border-indigo-500">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500 p-2 rounded-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
            <div>
              <h1 className="text-xl font-bold uppercase tracking-tight text-indigo-50">Hệ thống Biên tập 5512 - NLS</h1>
              <p className="text-indigo-400 text-[10px] font-bold uppercase">Xử lý siêu tốc - Gemini 3 Flash</p>
            </div>
          </div>
          <div className="flex bg-slate-800 rounded-lg p-1">
            <button 
              onClick={() => setConfig(prev => ({ ...prev, appendixType: AppendixType.PHU_LUC_I }))}
              className={`px-5 py-2 rounded-md text-sm font-bold transition-all ${config.appendixType === AppendixType.PHU_LUC_I ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              Phụ lục I (Tổ)
            </button>
            <button 
              onClick={() => setConfig(prev => ({ ...prev, appendixType: AppendixType.PHU_LUC_III }))}
              className={`px-5 py-2 rounded-md text-sm font-bold transition-all ${config.appendixType === AppendixType.PHU_LUC_III ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              Phụ lục III (GV)
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-[1700px] mx-auto w-full px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full lg:w-1/4 space-y-6 no-print">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xs font-black text-slate-400 uppercase mb-4 tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
              Cấu hình hồ sơ
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Cấp học / Mức độ</label>
                  <select 
                    value={config.gradeLevel}
                    onChange={(e) => setConfig(prev => ({ ...prev, gradeLevel: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm font-medium outline-none"
                  >
                    <optgroup label="Trung cấp 1 (TC1)">
                      <option value="Khối 6 (TC1)">Lớp 6</option>
                      <option value="Khối 7 (TC1)">Lớp 7</option>
                    </optgroup>
                    <optgroup label="Trung cấp 2 (TC2)">
                      <option value="Khối 8 (TC2)">Lớp 8</option>
                      <option value="Khối 9 (TC2)">Lớp 9</option>
                    </optgroup>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Môn học</label>
                <select 
                  value={config.subjectName}
                  onChange={(e) => setConfig(prev => ({ ...prev, subjectName: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm font-medium outline-none"
                >
                  {GDPT_2018_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Tên trường</label>
                <input 
                  type="text" 
                  value={config.schoolName}
                  onChange={(e) => setConfig(prev => ({ ...prev, schoolName: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none"
                  placeholder="Vd: THCS Thanh Luông"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Chọn Tổ</label>
                  <select 
                    value={config.departmentName}
                    onChange={(e) => setConfig(prev => ({ ...prev, departmentName: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Năm học</label>
                  <select 
                    value={config.academicYear}
                    onChange={(e) => setConfig(prev => ({ ...prev, academicYear: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {ACADEMIC_YEARS.map(year => <option key={year} value={year}>{year}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Tên Giáo viên (Phụ lục III)</label>
                <input 
                  type="text" 
                  value={config.teacherName}
                  onChange={(e) => setConfig(prev => ({ ...prev, teacherName: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none"
                  placeholder="Vd: Nguyễn Văn A"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xs font-black text-slate-400 uppercase mb-4 tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              Nội dung chuẩn
            </h2>
            <div className="flex gap-2 mb-4">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-indigo-50 hover:bg-indigo-100 rounded-xl text-xs font-bold text-indigo-700 transition-all border border-indigo-100"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                Tải lên file
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".docx,.pdf,.txt" className="hidden" />
              <button 
                onClick={() => setConfig(prev => ({ ...prev, inputData: DEMO_DATA }))}
                className="py-2.5 px-4 bg-amber-50 hover:bg-amber-100 rounded-xl text-xs font-bold text-amber-700 border border-amber-200"
              >
                Mẫu
              </button>
            </div>
            <textarea 
              rows={10}
              value={config.inputData}
              onChange={(e) => setConfig(prev => ({ ...prev, inputData: e.target.value }))}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-all"
              placeholder="Dán yêu cầu cần đạt tại đây..."
            />
            <button 
              onClick={handleGenerate}
              disabled={isLoading}
              className={`w-full mt-4 py-4 rounded-xl text-white font-black uppercase tracking-widest shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 ${isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              {isLoading ? 'Đang biên soạn...' : 'Bắt đầu biên tập'}
            </button>
            {error && <p className="mt-3 text-[11px] text-red-500 text-center font-bold italic">{error}</p>}
          </div>
        </aside>

        {/* Preview Panel */}
        <section className="flex-grow flex flex-col bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden min-h-[85vh]">
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center no-print">
            <div className="flex items-center gap-2">
              <div className="flex space-x-1">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400"></span>
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400"></span>
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
              </div>
              <span className="ml-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                {isLoading ? 'Hệ thống đang xuất bản thời gian thực...' : 'Bản thảo 5512 hoàn tất'}
              </span>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={exportToWord}
                disabled={!generatedHtml}
                className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase transition-all disabled:opacity-50"
              >
                Xuất Word
              </button>
              <button 
                onClick={() => window.print()}
                disabled={!generatedHtml}
                className="flex items-center gap-2 px-5 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase transition-all disabled:opacity-50"
              >
                In/PDF
              </button>
            </div>
          </div>
          
          <div className="flex-grow p-10 sm:p-16 overflow-y-auto bg-white document-preview">
            {generatedHtml ? (
              <div className="document-preview-container">
                <div 
                  className="prose prose-slate max-w-none prose-sm sm:prose-base 
                  [&_table]:w-full [&_table]:border-collapse [&_table]:my-8 
                  [&_th]:border [&_th]:border-black [&_th]:p-3 [&_th]:bg-slate-50 [&_th]:font-bold [&_th]:text-center [&_th]:text-[11pt]
                  [&_td]:border [&_td]:border-black [&_td]:p-3 [&_td]:align-top [&_td]:text-[11pt]"
                  dangerouslySetInnerHTML={{ __html: generatedHtml }} 
                />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center space-y-6">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <div className="text-center">
                  <h3 className="text-slate-400 font-bold text-base uppercase tracking-widest">Hệ thống sẵn sàng</h3>
                  <p className="text-slate-300 text-xs mt-2 italic">Chọn Phụ lục I hoặc III và cung cấp dữ liệu bài học.</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-200 py-3 px-8 flex justify-between items-center text-[9px] text-slate-400 font-black uppercase tracking-widest no-print">
        <p>Phiên bản 5512 Admin Pro v3.1</p>
        <p>Hệ thống AI xử lý siêu tốc chuẩn hóa giáo dục</p>
      </footer>
    </div>
  );
};

export default App;
