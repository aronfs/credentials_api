export interface GeneratePasswordRequest {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilarCharacters: boolean;
}

export interface GeneratePasswordResponse {
  password: string;
  length: number;
  strength: string;
  score: number;
}

export interface EvaluatePasswordRequest {
  password: string;
}

export interface EvaluatePasswordResponse {
  strength: string;
  score: number;
  suggestions: string[];
}