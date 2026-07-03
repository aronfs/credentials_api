export interface GeneratePasswordInput {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilarCharacters: boolean;
}

export interface GeneratedPassword {
  password: string;
  length: number;
  strength: string;
  score: number;
}

export interface PasswordEvaluation {
  strength: string;
  score: number;
  suggestions: string[];
}

export interface PasswordGeneratorServicePort {
  generate(input: GeneratePasswordInput): GeneratedPassword;
  evaluate(password: string): PasswordEvaluation;
}