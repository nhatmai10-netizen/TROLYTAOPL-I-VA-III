
export enum AppendixType {
  PHU_LUC_I = 'PHU_LUC_I',
  PHU_LUC_III = 'PHU_LUC_III'
}

export interface GenerationConfig {
  appendixType: AppendixType;
  inputData: string;
  // Updated to string to accommodate specific grade strings like 'Lớp 6 (TC1)'
  gradeLevel: string;
  schoolName: string;
  departmentName: string;
  teacherName: string;
  subjectName: string;
  academicYear: string;
}

export interface GeneratedContent {
  title: string;
  html: string;
}