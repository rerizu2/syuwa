export interface SegmentResult {
  originalText: string;
  segments: string[];
}

export interface AnalysisError {
  message: string;
}

export enum AppStatus {
  IDLE,
  LOADING,
  SUCCESS,
  ERROR
}