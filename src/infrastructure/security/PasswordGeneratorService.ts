import {
  PasswordGeneratorServicePort,
  GeneratePasswordInput,
  GeneratedPassword,
  PasswordEvaluation,
} from "../../domain/ports/PasswordGeneratorServicePort";
import { randomBytes } from "crypto";

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";
const SIMILAR = "0OoI1l";

const COMMON_PATTERNS = [
  "123456", "password", "qwerty", "admin", "12345678", "123456789",
  "1234", "12345", "letmein", "monkey", "dragon", "abc123",
  "111111", "000000", "password1", "iloveyou", "trustno1",
];

export class PasswordGeneratorService implements PasswordGeneratorServicePort {
  generate(input: GeneratePasswordInput): GeneratedPassword {
    let chars = "";
    if (input.includeUppercase) chars += UPPERCASE;
    if (input.includeLowercase) chars += LOWERCASE;
    if (input.includeNumbers) chars += NUMBERS;
    if (input.includeSymbols) chars += SYMBOLS;

    if (input.excludeSimilarCharacters) {
      for (const c of SIMILAR) {
        chars = chars.replaceAll(c, "");
      }
    }

    if (chars.length === 0) {
      throw new Error("Debe incluir al menos un tipo de caracter");
    }

    let password = "";
    const bytes = randomBytes(input.length);
    for (let i = 0; i < input.length; i++) {
      password += chars[bytes[i] % chars.length];
    }

    const evaluation = this.evaluate(password);

    return {
      password,
      length: input.length,
      strength: evaluation.strength,
      score: evaluation.score,
    };
  }

  evaluate(password: string): PasswordEvaluation {
    let score = 0;
    const suggestions: string[] = [];

    if (password.length >= 8) score += 10;
    if (password.length >= 12) score += 10;
    if (password.length >= 16) score += 10;
    if (password.length >= 20) score += 10;
    if (password.length < 8) {
      suggestions.push("Usa al menos 8 caracteres");
    }

    if (/[A-Z]/.test(password)) {
      score += 15;
    } else {
      suggestions.push("Agrega mayúsculas");
    }

    if (/[a-z]/.test(password)) {
      score += 15;
    } else {
      suggestions.push("Agrega minúsculas");
    }

    if (/[0-9]/.test(password)) {
      score += 15;
    } else {
      suggestions.push("Agrega números");
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score += 15;
    } else {
      suggestions.push("Agrega símbolos");
    }

    const repeated = password.match(/(.)\1{2,}/);
    if (repeated) {
      score -= 10;
      suggestions.push("Evita caracteres repetidos");
    }

    const lowerPass = password.toLowerCase();
    for (const pattern of COMMON_PATTERNS) {
      if (lowerPass.includes(pattern)) {
        score -= 15;
        suggestions.push("Evita patrones comunes");
        break;
      }
    }

    score = Math.max(0, Math.min(100, score));

    let strength: string;
    if (score >= 80) strength = "very_strong";
    else if (score >= 60) strength = "strong";
    else if (score >= 40) strength = "medium";
    else strength = "weak";

    return { strength, score, suggestions };
  }
}