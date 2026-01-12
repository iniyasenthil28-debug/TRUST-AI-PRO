
export type ContentType = 'text' | 'image' | 'audio';

export interface VerificationResult {
  trustScore: number;
  authenticityRating: 'Authentic' | 'Suspicious' | 'Synthetic' | 'Undetermined';
  summary: string;
  analysisPoints: string[];
  intentAnalysis: string;
  metadata: Record<string, any>;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  type: ContentType;
  input: string; // Base64 for images/audio, plain text for text
  result: VerificationResult;
}
