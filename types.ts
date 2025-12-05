export enum SegmentType {
  NOUN = '名詞',
  VERB = '動詞',
  ADJECTIVE = '形容詞',
  PARTICLE = '助詞',
  ADVERB = '副詞',
  EXPRESSION = '表現',
  OTHER = 'その他'
}

export interface JSLSegment {
  originalText: string;
  jslGloss: string;
  type: string; // Using string to allow flexibility from AI, but guided by SegmentType
  explanation?: string;
}

export interface AnalysisResult {
  segments: JSLSegment[];
  politeTranslation?: string;
}

// Web Speech API types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}